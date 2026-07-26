import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { categorySchema } from '@/lib/schema'
import { readManifestForUpdate, writeManifest, ManifestConflictError } from '@/lib/manifest'
import { updateEntry, deleteEntry } from '@/lib/entries'
import { deleteObject, keyFromPublicUrl } from '@/lib/r2'

const patchBodySchema = z.object({
  title: z.string().min(1).max(80).optional(),
  description: z.string().min(1).max(500).optional(),
})

type RouteParams = { params: Promise<{ category: string; id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const { category, id } = await params
  const categoryResult = categorySchema.safeParse(category)
  if (!categoryResult.success) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const body = await req.json()
  const parsed = patchBodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const { manifest, etag } = await readManifestForUpdate()
  let next
  try {
    next = updateEntry(manifest, categoryResult.data, id, parsed.data)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }

  try {
    await writeManifest(next, etag)
  } catch (err) {
    if (err instanceof ManifestConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const { category, id } = await params
  const categoryResult = categorySchema.safeParse(category)
  if (!categoryResult.success) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const { manifest, etag } = await readManifestForUpdate()
  let next
  let removedImages
  try {
    ;({ manifest: next, removedImages } = deleteEntry(manifest, categoryResult.data, id))
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }

  try {
    await writeManifest(next, etag)
  } catch (err) {
    if (err instanceof ManifestConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }

  // Manifest write already succeeded — the entry is gone either way. R2 cleanup
  // is best-effort: log failures rather than reporting the delete as failed.
  await Promise.allSettled(
    removedImages.map(img => deleteObject(keyFromPublicUrl(img.url)))
  ).then(results => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Failed to delete orphaned R2 object for image "${removedImages[i].id}":`, r.reason)
      }
    })
  })

  return NextResponse.json({ ok: true })
}
