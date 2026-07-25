import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { createEntryRequestSchema } from '@/lib/schema'
import { readManifest, writeManifest } from '@/lib/manifest'
import { createEntry } from '@/lib/entries'

export async function POST(req: NextRequest) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const body = await req.json()
  const parsed = createEntryRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const manifest = await readManifest()
  const { manifest: next, entry } = createEntry(manifest, parsed.data)
  await writeManifest(next)

  return NextResponse.json({ entry }, { status: 201 })
}
