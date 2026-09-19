/** @jest-environment node */
import { POST as addImagesRoute } from '@/app/api/admin/entries/[category]/[id]/images/route'
import { addImages } from '@/lib/entries'
import * as authModule from '@/lib/auth'
import * as manifestModule from '@/lib/manifest'
import { ManifestConflictError } from '@/lib/manifest'
import * as r2Module from '@/lib/r2'
import type { NextRequest } from 'next/server'
import type { Manifest, ImageItem } from '@/lib/schema'

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/manifest')
jest.mock('@/lib/r2')

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest
}

function baseManifest(): Manifest {
  return {
    trabajo: [
      {
        id: 'e1',
        title: 'Serie 1',
        description: 'Descripcion.',
        images: [
          { id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/i1.jpg', caption: '' },
          { id: 'i2', url: 'https://cdn.victoriaruizdiaz.com/i2.jpg', caption: '' },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    proyectos: [],
  }
}

const newImage: ImageItem = { id: 'i3', url: 'https://cdn.victoriaruizdiaz.com/i3.webp', caption: '' }
const params = { params: Promise.resolve({ category: 'trabajo', id: 'e1' }) }
const ORIGINAL_ADMIN_EMAILS = process.env.ADMIN_EMAILS

beforeEach(() => {
  jest.clearAllMocks()
  process.env.ADMIN_EMAILS = 'victoriard6@gmail.com'
  ;(authModule.auth as jest.Mock).mockResolvedValue({ user: { email: 'victoriard6@gmail.com' } })
  ;(manifestModule.readManifestForUpdate as jest.Mock).mockResolvedValue({ manifest: baseManifest(), etag: 'etag-1' })
  ;(manifestModule.writeManifest as jest.Mock).mockResolvedValue(undefined)
  ;(r2Module.deleteObject as jest.Mock).mockResolvedValue(undefined)
  ;(r2Module.keyFromPublicUrl as jest.Mock).mockImplementation((url: string) => url.split('/').pop())
})

afterAll(() => {
  if (ORIGINAL_ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS
  else process.env.ADMIN_EMAILS = ORIGINAL_ADMIN_EMAILS
})

describe('addImages', () => {
  it('appends rather than inserting, so the lead image is never displaced', () => {
    const next = addImages(baseManifest(), 'trabajo', 'e1', [newImage])
    expect(next.trabajo[0].images.map(i => i.id)).toEqual(['i1', 'i2', 'i3'])
  })

  it('appends several at once, in the order given', () => {
    const second: ImageItem = { ...newImage, id: 'i4', url: 'https://cdn.victoriaruizdiaz.com/i4.webp' }
    const next = addImages(baseManifest(), 'trabajo', 'e1', [newImage, second])
    expect(next.trabajo[0].images.map(i => i.id)).toEqual(['i1', 'i2', 'i3', 'i4'])
  })

  it('bumps updatedAt', () => {
    const before = baseManifest()
    const next = addImages(before, 'trabajo', 'e1', [newImage])
    expect(next.trabajo[0].updatedAt).not.toBe(before.trabajo[0].updatedAt)
  })

  it('does not mutate the manifest it was given', () => {
    const before = baseManifest()
    addImages(before, 'trabajo', 'e1', [newImage])
    expect(before.trabajo[0].images).toHaveLength(2)
  })

  it('leaves the other category alone', () => {
    const next = addImages(baseManifest(), 'trabajo', 'e1', [newImage])
    expect(next.proyectos).toEqual([])
  })

  it('throws for an unknown entry', () => {
    expect(() => addImages(baseManifest(), 'trabajo', 'nope', [newImage])).toThrow(/not found/)
  })

  it('throws for an unknown category-entry pairing', () => {
    expect(() => addImages(baseManifest(), 'proyectos', 'e1', [newImage])).toThrow(/not found/)
  })

  it('rejects an id already on the entry, so a double submit cannot duplicate it', () => {
    const clash: ImageItem = { id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/other.webp', caption: '' }
    expect(() => addImages(baseManifest(), 'trabajo', 'e1', [clash])).toThrow(/already on entry/)
  })

  it('throws when given nothing to add', () => {
    expect(() => addImages(baseManifest(), 'trabajo', 'e1', [])).toThrow(/No images/)
  })
})

describe('POST /api/admin/entries/[category]/[id]/images', () => {
  it('returns 401 when unauthenticated and does not write', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue(null)
    const res = await addImagesRoute(makeRequest({ images: [newImage] }), params)
    expect(res.status).toBe(401)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('appends the image and writes the manifest', async () => {
    const res = await addImagesRoute(makeRequest({ images: [newImage] }), params)
    expect(res.status).toBe(200)
    const [written] = (manifestModule.writeManifest as jest.Mock).mock.calls[0]
    expect((written as Manifest).trabajo[0].images.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3'])
  })

  it('returns 400 for an invalid category', async () => {
    const res = await addImagesRoute(makeRequest({ images: [newImage] }), {
      params: Promise.resolve({ category: 'nope', id: 'e1' }),
    })
    expect(res.status).toBe(400)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('returns 400 for an empty image list', async () => {
    const res = await addImagesRoute(makeRequest({ images: [] }), params)
    expect(res.status).toBe(400)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('returns 400 for a malformed image record', async () => {
    const res = await addImagesRoute(makeRequest({ images: [{ id: 'x', url: 'not-a-url', caption: '' }] }), params)
    expect(res.status).toBe(400)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('returns 404 for an entry that does not exist', async () => {
    const res = await addImagesRoute(makeRequest({ images: [newImage] }), {
      params: Promise.resolve({ category: 'trabajo', id: 'missing' }),
    })
    expect(res.status).toBe(404)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('returns 409 on a manifest conflict and deletes the just-uploaded object so it cannot leak', async () => {
    ;(manifestModule.writeManifest as jest.Mock).mockRejectedValue(new ManifestConflictError())
    const res = await addImagesRoute(makeRequest({ images: [newImage] }), params)
    expect(res.status).toBe(409)
    expect(r2Module.deleteObject).toHaveBeenCalledTimes(1)
    expect(r2Module.keyFromPublicUrl).toHaveBeenCalledWith(newImage.url)
  })

  it('does not touch R2 on a successful write', async () => {
    await addImagesRoute(makeRequest({ images: [newImage] }), params)
    expect(r2Module.deleteObject).not.toHaveBeenCalled()
  })
})
