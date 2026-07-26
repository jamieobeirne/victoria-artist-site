/** @jest-environment node */
import { createEntry, updateEntry, deleteEntry, deleteImage } from '@/lib/entries'
import type { Manifest } from '@/lib/schema'

function baseManifest(): Manifest {
  return {
    trabajo: [
      {
        id: 'e1',
        title: 'Serie 1',
        description: 'Descripcion original.',
        images: [
          { id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/i1.jpg', caption: 'Uno' },
          { id: 'i2', url: 'https://cdn.victoriaruizdiaz.com/i2.jpg', caption: 'Dos' },
          { id: 'i3', url: 'https://cdn.victoriaruizdiaz.com/i3.jpg', caption: 'Tres' },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    proyectos: [
      {
        id: 'p1',
        title: 'Proyecto 1',
        description: 'Descripcion de proyecto.',
        images: [{ id: 'ip1', url: 'https://cdn.victoriaruizdiaz.com/ip1.jpg', caption: 'Vista' }],
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      },
    ],
  }
}

describe('createEntry', () => {
  it('appends to manifest.trabajo and leaves manifest.proyectos untouched', () => {
    const manifest = baseManifest()
    const { manifest: next, entry } = createEntry(manifest, {
      category: 'trabajo',
      title: 'Serie 2',
      description: 'Nueva serie.',
      images: [{ id: 'i4', url: 'https://cdn.victoriaruizdiaz.com/i4.jpg', caption: 'Cuatro' }],
    })
    expect(next.trabajo).toHaveLength(2)
    expect(next.proyectos).toEqual(manifest.proyectos)
    expect(entry.title).toBe('Serie 2')
    expect(entry.id).toBeTruthy()
  })

  it('appends to manifest.proyectos and leaves manifest.trabajo untouched', () => {
    const manifest = baseManifest()
    const { manifest: next } = createEntry(manifest, {
      category: 'proyectos',
      title: 'Proyecto 2',
      description: 'Otro proyecto.',
      images: [{ id: 'ip2', url: 'https://cdn.victoriaruizdiaz.com/ip2.jpg', caption: 'Otra vista' }],
    })
    expect(next.proyectos).toHaveLength(2)
    expect(next.trabajo).toEqual(manifest.trabajo)
  })
})

describe('updateEntry', () => {
  it('updates title/description, preserves images and id/createdAt, bumps updatedAt', () => {
    const manifest = baseManifest()
    const originalImages = manifest.trabajo[0].images
    const next = updateEntry(manifest, 'trabajo', 'e1', { title: 'Nuevo titulo' })
    const updated = next.trabajo.find(e => e.id === 'e1')!
    expect(updated.title).toBe('Nuevo titulo')
    expect(updated.images).toEqual(originalImages)
    expect(updated.id).toBe('e1')
    expect(updated.createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(updated.updatedAt).not.toBe('2026-01-01T00:00:00.000Z')
  })

  it('throws when the entry does not exist', () => {
    const manifest = baseManifest()
    expect(() => updateEntry(manifest, 'trabajo', 'nope', { title: 'x' })).toThrow()
  })
})

describe('deleteEntry', () => {
  it('removes the entry from the manifest array', () => {
    const manifest = baseManifest()
    const { manifest: next } = deleteEntry(manifest, 'trabajo', 'e1')
    expect(next.trabajo).toHaveLength(0)
    expect(next.proyectos).toEqual(manifest.proyectos)
  })

  it('returns the removed entry images so callers can clean them up in R2', () => {
    const manifest = baseManifest()
    const { removedImages } = deleteEntry(manifest, 'trabajo', 'e1')
    expect(removedImages.map(i => i.id)).toEqual(['i1', 'i2', 'i3'])
  })

  it('throws when the entry does not exist', () => {
    const manifest = baseManifest()
    expect(() => deleteEntry(manifest, 'trabajo', 'nope')).toThrow()
  })
})

describe('deleteImage', () => {
  it('removes one image from a multi-image entry, keeps the rest in order', () => {
    const manifest = baseManifest()
    const { manifest: next } = deleteImage(manifest, 'trabajo', 'e1', 'i2')
    const entry = next.trabajo.find(e => e.id === 'e1')!
    expect(entry.images.map(i => i.id)).toEqual(['i1', 'i3'])
  })

  it('returns the removed image so callers can clean it up in R2', () => {
    const manifest = baseManifest()
    const { removedImage } = deleteImage(manifest, 'trabajo', 'e1', 'i2')
    expect(removedImage.id).toBe('i2')
  })

  it('blocks deleting the last remaining image of an entry', () => {
    const manifest = baseManifest()
    expect(() => deleteImage(manifest, 'proyectos', 'p1', 'ip1')).toThrow()
    // proyectos entry still has its one image — nothing was mutated
    expect(manifest.proyectos[0].images).toHaveLength(1)
  })

  it('throws when the image does not exist on the entry', () => {
    const manifest = baseManifest()
    expect(() => deleteImage(manifest, 'trabajo', 'e1', 'not-an-image')).toThrow()
  })
})
