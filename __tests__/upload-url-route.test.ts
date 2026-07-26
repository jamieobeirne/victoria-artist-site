/** @jest-environment node */
import { POST } from '@/app/api/admin/upload-url/route'
import * as authModule from '@/lib/auth'
import * as r2 from '@/lib/r2'
import type { NextRequest } from 'next/server'

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/r2')

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest
}

describe('POST /api/admin/upload-url', () => {
  const ORIGINAL_ADMIN_EMAILS = process.env.ADMIN_EMAILS

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
  })

  afterAll(() => {
    if (ORIGINAL_ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS
    else process.env.ADMIN_EMAILS = ORIGINAL_ADMIN_EMAILS
  })

  it('returns 401 when there is no session', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue(null)
    const res = await POST(makeRequest({ filename: 'a.jpg', contentType: 'image/jpeg', size: 1024 }))
    expect(res.status).toBe(401)
    expect(r2.presignUpload).not.toHaveBeenCalled()
  })

  it('returns 400 for a disallowed content type, without requesting a presigned URL', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue({ user: { email: 'victoriard6@gmail.com' } })
    const res = await POST(makeRequest({ filename: 'a.pdf', contentType: 'application/pdf', size: 1024 }))
    expect(res.status).toBe(400)
    expect(r2.presignUpload).not.toHaveBeenCalled()
  })

  it('returns 400 for an oversized file, without requesting a presigned URL', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue({ user: { email: 'victoriard6@gmail.com' } })
    const res = await POST(makeRequest({ filename: 'a.jpg', contentType: 'image/jpeg', size: 999_999_999 }))
    expect(res.status).toBe(400)
    expect(r2.presignUpload).not.toHaveBeenCalled()
  })

  it('returns a presigned URL scoped to a unique key for a valid authenticated request', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue({ user: { email: 'victoriard6@gmail.com' } })
    ;(r2.presignUpload as jest.Mock).mockResolvedValue('https://r2.example.com/presigned')
    ;(r2.publicUrlFor as jest.Mock).mockImplementation((key: string) => `https://cdn.victoriaruizdiaz.com/${key}`)

    const res = await POST(makeRequest({ filename: 'photo.jpg', contentType: 'image/jpeg', size: 1024 }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.uploadUrl).toBe('https://r2.example.com/presigned')
    expect(body.key).toMatch(/^images\/.+\.jpg$/)
    expect(body.publicUrl).toBe(`https://cdn.victoriaruizdiaz.com/${body.key}`)

    const [key, contentType] = (r2.presignUpload as jest.Mock).mock.calls[0]
    expect(key).toBe(body.key)
    expect(contentType).toBe('image/jpeg')
  })

  it('two requests for the same filename get different keys', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue({ user: { email: 'victoriard6@gmail.com' } })
    ;(r2.presignUpload as jest.Mock).mockResolvedValue('https://r2.example.com/presigned')
    ;(r2.publicUrlFor as jest.Mock).mockImplementation((key: string) => `https://cdn.victoriaruizdiaz.com/${key}`)

    const res1 = await POST(makeRequest({ filename: 'photo.jpg', contentType: 'image/jpeg', size: 1024 }))
    const res2 = await POST(makeRequest({ filename: 'photo.jpg', contentType: 'image/jpeg', size: 1024 }))
    const body1 = await res1.json()
    const body2 = await res2.json()
    expect(body1.key).not.toBe(body2.key)
  })
})
