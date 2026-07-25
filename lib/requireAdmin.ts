import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

type RequireAdminResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }

export function requireAdminSession(session: Session | null): RequireAdminResult {
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { ok: true, session }
}
