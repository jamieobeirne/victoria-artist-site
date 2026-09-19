import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { categorySchema, addImagesRequestSchema } from '@/lib/schema'
import { readManifestForUpdate, writeManifest, ManifestConflictError } from '@/lib/manifest'
import { addImages } from '@/lib/entries'
import { deleteObject, keyFromPublicUrl } from '@/lib/r2'

type RouteParams = { params: Promise<{ category: string; id: string }> }

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const { category, id } = await params
  const categoryResult = categorySchema.safeParse(category)
  if (!categoryResult.success) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const body = await req.json()
  const parsed = addImagesRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const { manifest, etag } = await readManifestForUpdate()
  let next
  try {
    next = addImages(manifest, categoryResult.data, id, parsed.data.images)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }

  try {
    await writeManifest(next, etag)
  } catch (err) {
    // The objects are already in R2 but no record now points at them, so they
    // would leak against the 10 GB allowance on every retry. Best-effort
    // cleanup, then report the original failure.
    await Promise.allSettled(
      parsed.data.images.map(img => deleteObject(keyFromPublicUrl(img.url)))
    )
    if (err instanceof ManifestConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }

  revalidatePath('/home')

  return NextResponse.json({ ok: true })
}
