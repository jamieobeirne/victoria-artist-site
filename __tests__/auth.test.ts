/** @jest-environment node */
import { isAllowedEmail } from '@/lib/allowlist'
import { authConfig } from '@/lib/auth.config'
import { requireAdminSession } from '@/lib/requireAdmin'

describe('isAllowedEmail (signIn allowlist — the real security boundary)', () => {
  const ORIGINAL_ADMIN_EMAILS = process.env.ADMIN_EMAILS

  afterEach(() => {
    if (ORIGINAL_ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS
    else process.env.ADMIN_EMAILS = ORIGINAL_ADMIN_EMAILS
  })

  it('rejects a non-allowlisted, verified email', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
    expect(isAllowedEmail('someoneelse@gmail.com', true)).toBe(false)
  })

  it('rejects an allowlisted email when unverified', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
    expect(isAllowedEmail('victoriard6@gmail.com', false)).toBe(false)
  })

  it('rejects everyone when ADMIN_EMAILS is unset — fail closed, never fail open', () => {
    delete process.env.ADMIN_EMAILS
    expect(isAllowedEmail('victoriard6@gmail.com', true)).toBe(false)
    expect(isAllowedEmail('anyone@gmail.com', true)).toBe(false)
  })

  it('rejects everyone when ADMIN_EMAILS is an empty string', () => {
    process.env.ADMIN_EMAILS = ''
    expect(isAllowedEmail('victoriard6@gmail.com', true)).toBe(false)
  })

  it('rejects everyone when ADMIN_EMAILS is only whitespace/commas', () => {
    process.env.ADMIN_EMAILS = ' , , '
    expect(isAllowedEmail('victoriard6@gmail.com', true)).toBe(false)
  })

  it('accepts a single allowlisted, verified email', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
    expect(isAllowedEmail('victoriard6@gmail.com', true)).toBe(true)
  })

  it('accepts any email in a comma-separated multi-admin list', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com,jamieobeirne123@gmail.com'
    expect(isAllowedEmail('victoriard6@gmail.com', true)).toBe(true)
    expect(isAllowedEmail('jamieobeirne123@gmail.com', true)).toBe(true)
  })

  it('tolerates whitespace around entries in the comma-separated list', () => {
    process.env.ADMIN_EMAILS = ' victoriard6@gmail.com , jamieobeirne123@gmail.com '
    expect(isAllowedEmail('jamieobeirne123@gmail.com', true)).toBe(true)
  })

  it('still rejects an email not in a multi-admin list', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com,jamieobeirne123@gmail.com'
    expect(isAllowedEmail('someoneelse@gmail.com', true)).toBe(false)
  })

  it('is case-insensitive on the email match', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
    expect(isAllowedEmail('Victoriard6@Gmail.com', true)).toBe(true)
  })

  it('does not match on substring/prefix tricks', () => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
    expect(isAllowedEmail('victoriard6@gmail.com.evil.com', true)).toBe(false)
  })
})

describe('authConfig.authorized (middleware-level route protection)', () => {
  const ORIGINAL_ADMIN_EMAILS = process.env.ADMIN_EMAILS

  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
  })

  afterEach(() => {
    if (ORIGINAL_ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS
    else process.env.ADMIN_EMAILS = ORIGINAL_ADMIN_EMAILS
  })

  const authorized = (auth: unknown, pathname: string) =>
    authConfig.callbacks!.authorized!({
      auth: auth as never,
      request: { nextUrl: { pathname } } as never,
    })

  it('denies an unauthenticated request to /admin', () => {
    expect(authorized(null, '/admin')).toBe(false)
  })

  it('denies an unauthenticated request to /api/admin/upload-url', () => {
    expect(authorized(null, '/api/admin/upload-url')).toBe(false)
  })

  it('allows an authenticated, allowlisted request to /admin', () => {
    expect(authorized({ user: { email: 'victoriard6@gmail.com' } }, '/admin')).toBe(true)
  })

  it('allows unauthenticated requests to public, non-admin routes', () => {
    expect(authorized(null, '/home')).toBe(true)
  })

  it('denies a session whose email was removed from ADMIN_EMAILS after the session was issued', () => {
    // Simulates a revoked admin who still holds a valid JWT session — the
    // allowlist must be re-checked per-request, not just at initial sign-in.
    process.env.ADMIN_EMAILS = 'someoneelse@gmail.com'
    expect(authorized({ user: { email: 'victoriard6@gmail.com' } }, '/admin')).toBe(false)
  })
})

describe('requireAdminSession (per-route server-side re-check)', () => {
  const ORIGINAL_ADMIN_EMAILS = process.env.ADMIN_EMAILS

  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
  })

  afterEach(() => {
    if (ORIGINAL_ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS
    else process.env.ADMIN_EMAILS = ORIGINAL_ADMIN_EMAILS
  })

  it('returns a 401 response when there is no session', () => {
    const result = requireAdminSession(null)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(401)
  })

  it('returns ok:true with the session when the email is currently allowlisted', () => {
    const session = { user: { email: 'victoriard6@gmail.com' } } as never
    const result = requireAdminSession(session)
    expect(result.ok).toBe(true)
  })

  it('returns 401 when the session email was removed from ADMIN_EMAILS since the session was issued', () => {
    process.env.ADMIN_EMAILS = 'someoneelse@gmail.com'
    const session = { user: { email: 'victoriard6@gmail.com' } } as never
    const result = requireAdminSession(session)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(401)
  })
})
