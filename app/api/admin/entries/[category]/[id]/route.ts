import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { categorySchema } from '@/lib/schema'
import { readManifest, writeManifest } from '@/lib/manifest'
import { updateEntry, deleteEntry } from '@/lib/entries'

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

  const manifest = await readManifest()
  try {
    const next = updateEntry(manifest, categoryResult.data, id, parsed.data)
    await writeManifest(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }
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

  const manifest = await readManifest()
  try {
    const next = deleteEntry(manifest, categoryResult.data, id)
    await writeManifest(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }
}
