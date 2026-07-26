import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { categorySchema } from '@/lib/schema'
import { readManifestForUpdate, writeManifest, ManifestConflictError } from '@/lib/manifest'
import { deleteImage } from '@/lib/entries'
import { deleteObject, keyFromPublicUrl } from '@/lib/r2'

type RouteParams = { params: Promise<{ category: string; id: string; imageId: string }> }

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const { category, id, imageId } = await params
  const categoryResult = categorySchema.safeParse(category)
  if (!categoryResult.success) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const { manifest, etag } = await readManifestForUpdate()
  let next
  let removedImage
  try {
    ;({ manifest: next, removedImage } = deleteImage(manifest, categoryResult.data, id, imageId))
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  try {
    await writeManifest(next, etag)
  } catch (err) {
    if (err instanceof ManifestConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }

  try {
    await deleteObject(keyFromPublicUrl(removedImage.url))
  } catch (err) {
    console.error(`Failed to delete orphaned R2 object for image "${removedImage.id}":`, err)
  }

  return NextResponse.json({ ok: true })
}
