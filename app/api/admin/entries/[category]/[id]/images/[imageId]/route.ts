import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { categorySchema } from '@/lib/schema'
import { readManifest, writeManifest } from '@/lib/manifest'
import { deleteImage } from '@/lib/entries'

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

  const manifest = await readManifest()
  try {
    const next = deleteImage(manifest, categoryResult.data, id, imageId)
    await writeManifest(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
