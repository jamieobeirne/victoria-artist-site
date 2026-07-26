import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { createEntryRequestSchema } from '@/lib/schema'
import { readManifestForUpdate, writeManifest, ManifestConflictError } from '@/lib/manifest'
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

  const { manifest, etag } = await readManifestForUpdate()
  const { manifest: next, entry } = createEntry(manifest, parsed.data)

  try {
    await writeManifest(next, etag)
  } catch (err) {
    if (err instanceof ManifestConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }

  return NextResponse.json({ entry }, { status: 201 })
}
