/** @jest-environment node */
import { readManifest, readManifestForUpdate, writeManifest, ManifestConflictError } from '@/lib/manifest'
import * as r2 from '@/lib/r2'

jest.mock('@/lib/r2')

const validManifest = {
  trabajo: [
    {
      id: 'e1',
      title: 'Serie 1',
      description: 'Una descripcion breve de la serie.',
      images: [{ id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/i1.jpg', caption: 'Detalle' }],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  proyectos: [],
}

describe('readManifest', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns the parsed manifest for valid JSON', async () => {
    ;(r2.getObject as jest.Mock).mockResolvedValue(JSON.stringify(validManifest))
    await expect(readManifest()).resolves.toEqual(validManifest)
  })

  it('throws on corrupted JSON rather than returning a default/empty manifest', async () => {
    ;(r2.getObject as jest.Mock).mockResolvedValue('{ this is not valid json')
    await expect(readManifest()).rejects.toThrow()
  })

  it('throws when parsed content fails schema validation', async () => {
    ;(r2.getObject as jest.Mock).mockResolvedValue(JSON.stringify({ trabajo: 'not-an-array', proyectos: [] }))
    await expect(readManifest()).rejects.toThrow()
  })
})

describe('writeManifest', () => {
  beforeEach(() => jest.clearAllMocks())

  it('does not write when the payload fails schema validation (title too long)', async () => {
    const invalid = {
      trabajo: [{ ...validManifest.trabajo[0], title: 'x'.repeat(81) }],
      proyectos: [],
    }
    await expect(writeManifest(invalid as never)).rejects.toThrow()
    expect(r2.putObject).not.toHaveBeenCalled()
  })

  it('rejects an entry with zero images', async () => {
    const invalid = {
      trabajo: [{ ...validManifest.trabajo[0], images: [] }],
      proyectos: [],
    }
    await expect(writeManifest(invalid as never)).rejects.toThrow()
    expect(r2.putObject).not.toHaveBeenCalled()
  })

  it('writes the full manifest, including both categories, on valid input', async () => {
    await writeManifest(validManifest)
    expect(r2.putObject).toHaveBeenCalledTimes(1)
    const [key, body] = (r2.putObject as jest.Mock).mock.calls[0]
    expect(key).toBe('manifest.json')
    const written = JSON.parse(body as string)
    expect(written.trabajo).toHaveLength(1)
    expect(written).toHaveProperty('proyectos')
    expect(written.proyectos).toEqual([])
  })

  it('a write touching one category leaves the other category untouched', async () => {
    const next = {
      trabajo: validManifest.trabajo,
      proyectos: [
        {
          id: 'e2',
          title: 'Proyecto 1',
          description: 'Descripcion del proyecto.',
          images: [{ id: 'i2', url: 'https://cdn.victoriaruizdiaz.com/i2.jpg', caption: 'Vista' }],
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
      ],
    }
    await writeManifest(next)
    const [, body] = (r2.putObject as jest.Mock).mock.calls[0]
    const written = JSON.parse(body as string)
    expect(written.trabajo).toEqual(validManifest.trabajo)
    expect(written.proyectos).toEqual(next.proyectos)
  })

  it('passes the expected etag through to the R2 put as a conditional write', async () => {
    await writeManifest(validManifest, 'etag-123')
    const [, , , ifMatch] = (r2.putObject as jest.Mock).mock.calls[0]
    expect(ifMatch).toBe('etag-123')
  })

  it('surfaces a ManifestConflictError when the conditional write is rejected (precondition failed)', async () => {
    ;(r2.putObject as jest.Mock).mockRejectedValue({ name: 'PreconditionFailed' })
    await expect(writeManifest(validManifest, 'stale-etag')).rejects.toThrow(ManifestConflictError)
  })
})

describe('readManifestForUpdate', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns the parsed manifest along with the object etag', async () => {
    ;(r2.getObjectWithMeta as jest.Mock).mockResolvedValue({ body: JSON.stringify(validManifest), etag: 'etag-abc' })
    const result = await readManifestForUpdate()
    expect(result.manifest).toEqual(validManifest)
    expect(result.etag).toBe('etag-abc')
  })

  it('throws on corrupted JSON rather than returning a default/empty manifest', async () => {
    ;(r2.getObjectWithMeta as jest.Mock).mockResolvedValue({ body: '{ not valid json', etag: 'etag-abc' })
    await expect(readManifestForUpdate()).rejects.toThrow()
  })
})
