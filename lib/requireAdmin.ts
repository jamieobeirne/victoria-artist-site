import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'
import { isEmailAllowlisted } from './allowlist'

type RequireAdminResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }

export function requireAdminSession(session: Session | null): RequireAdminResult {
  if (!session?.user || !isEmailAllowlisted(session.user.email)) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { ok: true, session }
}
