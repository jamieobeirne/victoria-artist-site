import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/requireAdmin'
import { validateUploadFile } from '@/lib/upload'
import { presignUpload, publicUrlFor } from '@/lib/r2'

export async function POST(req: NextRequest) {
  const session = await auth()
  const check = requireAdminSession(session)
  if (!check.ok) return check.response

  const body = await req.json()
  const filename = typeof body?.filename === 'string' ? body.filename : ''
  const contentType = typeof body?.contentType === 'string' ? body.contentType : ''
  const size = typeof body?.size === 'number' ? body.size : 0

  const validation = validateUploadFile({ type: contentType, size })
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : 'jpg'
  const key = `images/${randomUUID()}.${ext}`

  const uploadUrl = await presignUpload(key, contentType)
  const publicUrl = publicUrlFor(key)

  return NextResponse.json({ uploadUrl, key, publicUrl })
}
