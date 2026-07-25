/** @jest-environment node */
import { POST as createEntryRoute } from '@/app/api/admin/entries/route'
import { PATCH as patchEntryRoute, DELETE as deleteEntryRoute } from '@/app/api/admin/entries/[category]/[id]/route'
import { DELETE as deleteImageRoute } from '@/app/api/admin/entries/[category]/[id]/images/[imageId]/route'
import * as authModule from '@/lib/auth'
import * as manifestModule from '@/lib/manifest'
import type { NextRequest } from 'next/server'
import type { Manifest } from '@/lib/schema'

jest.mock('@/lib/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/manifest')

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
          { id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/i1.jpg', caption: 'Uno' },
          { id: 'i2', url: 'https://cdn.victoriaruizdiaz.com/i2.jpg', caption: 'Dos' },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    proyectos: [],
  }
}

const authedSession = { user: { email: 'victoriard6@gmail.com' } }

beforeEach(() => {
  jest.clearAllMocks()
  ;(authModule.auth as jest.Mock).mockResolvedValue(authedSession)
  ;(manifestModule.readManifest as jest.Mock).mockResolvedValue(baseManifest())
  ;(manifestModule.writeManifest as jest.Mock).mockResolvedValue(undefined)
})

describe('POST /api/admin/entries', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue(null)
    const res = await createEntryRoute(
      makeRequest({ category: 'trabajo', title: 'x', description: 'x', images: [{ id: 'i', url: 'https://cdn.victoriaruizdiaz.com/i.jpg', caption: 'x' }] })
    )
    expect(res.status).toBe(401)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('returns 400 and does not write when the payload is invalid', async () => {
    const res = await createEntryRoute(makeRequest({ category: 'trabajo', title: 'x'.repeat(81), description: 'x', images: [] }))
    expect(res.status).toBe(400)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })

  it('creates the entry in the requested category and writes the manifest', async () => {
    const res = await createEntryRoute(
      makeRequest({
        category: 'proyectos',
        title: 'Proyecto nuevo',
        description: 'Descripcion nueva.',
        images: [{ id: 'ip1', url: 'https://cdn.victoriaruizdiaz.com/ip1.jpg', caption: 'Vista' }],
      })
    )
    expect(res.status).toBe(201)
    const written = (manifestModule.writeManifest as jest.Mock).mock.calls[0][0] as Manifest
    expect(written.proyectos).toHaveLength(1)
    expect(written.trabajo).toEqual(baseManifest().trabajo)
  })
})

describe('PATCH /api/admin/entries/[category]/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(authModule.auth as jest.Mock).mockResolvedValue(null)
    const res = await patchEntryRoute(makeRequest({ title: 'x' }), { params: Promise.resolve({ category: 'trabajo', id: 'e1' }) })
    expect(res.status).toBe(401)
  })

  it('updates the entry text and writes the manifest', async () => {
    const res = await patchEntryRoute(makeRequest({ title: 'Titulo actualizado' }), {
      params: Promise.resolve({ category: 'trabajo', id: 'e1' }),
    })
    expect(res.status).toBe(200)
    const written = (manifestModule.writeManifest as jest.Mock).mock.calls[0][0] as Manifest
    expect(written.trabajo[0].title).toBe('Titulo actualizado')
  })

  it('returns 404 for an unknown entry id', async () => {
    const res = await patchEntryRoute(makeRequest({ title: 'x' }), {
      params: Promise.resolve({ category: 'trabajo', id: 'does-not-exist' }),
    })
    expect(res.status).toBe(404)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/admin/entries/[category]/[id]', () => {
  it('deletes the entry and writes the manifest', async () => {
    const res = await deleteEntryRoute(makeRequest(undefined), { params: Promise.resolve({ category: 'trabajo', id: 'e1' }) })
    expect(res.status).toBe(200)
    const written = (manifestModule.writeManifest as jest.Mock).mock.calls[0][0] as Manifest
    expect(written.trabajo).toHaveLength(0)
  })
})

describe('DELETE /api/admin/entries/[category]/[id]/images/[imageId]', () => {
  it('deletes one image and writes the manifest', async () => {
    const res = await deleteImageRoute(makeRequest(undefined), {
      params: Promise.resolve({ category: 'trabajo', id: 'e1', imageId: 'i2' }),
    })
    expect(res.status).toBe(200)
    const written = (manifestModule.writeManifest as jest.Mock).mock.calls[0][0] as Manifest
    expect(written.trabajo[0].images.map((i: { id: string }) => i.id)).toEqual(['i1'])
  })

  it('blocks deleting the last image and does not write', async () => {
    ;(manifestModule.readManifest as jest.Mock).mockResolvedValue({
      trabajo: [{ ...baseManifest().trabajo[0], images: [baseManifest().trabajo[0].images[0]] }],
      proyectos: [],
    })
    const res = await deleteImageRoute(makeRequest(undefined), {
      params: Promise.resolve({ category: 'trabajo', id: 'e1', imageId: 'i1' }),
    })
    expect(res.status).toBe(400)
    expect(manifestModule.writeManifest).not.toHaveBeenCalled()
  })
})
