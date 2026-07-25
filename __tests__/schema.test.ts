/** @jest-environment node */
import { entrySchema, imageItemSchema, categorySchema, createEntryRequestSchema } from '@/lib/schema'

const baseImage = { id: 'i1', url: 'https://cdn.victoriaruizdiaz.com/i1.jpg', caption: 'ok' }
const baseEntry = {
  id: 'e1',
  title: 'ok',
  description: 'ok',
  images: [baseImage],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('field length limits', () => {
  it('accepts an 80-char title, rejects 81', () => {
    expect(entrySchema.safeParse({ ...baseEntry, title: 'a'.repeat(80) }).success).toBe(true)
    expect(entrySchema.safeParse({ ...baseEntry, title: 'a'.repeat(81) }).success).toBe(false)
  })

  it('accepts a 500-char description, rejects 501', () => {
    expect(entrySchema.safeParse({ ...baseEntry, description: 'a'.repeat(500) }).success).toBe(true)
    expect(entrySchema.safeParse({ ...baseEntry, description: 'a'.repeat(501) }).success).toBe(false)
  })

  it('accepts a 150-char caption, rejects 151', () => {
    expect(imageItemSchema.safeParse({ ...baseImage, caption: 'a'.repeat(150) }).success).toBe(true)
    expect(imageItemSchema.safeParse({ ...baseImage, caption: 'a'.repeat(151) }).success).toBe(false)
  })
})

describe('entry image count', () => {
  it('rejects an entry with zero images', () => {
    expect(entrySchema.safeParse({ ...baseEntry, images: [] }).success).toBe(false)
  })
})

describe('category enum', () => {
  it('accepts trabajo and proyectos', () => {
    expect(categorySchema.safeParse('trabajo').success).toBe(true)
    expect(categorySchema.safeParse('proyectos').success).toBe(true)
  })

  it('rejects any other value', () => {
    expect(categorySchema.safeParse('projects').success).toBe(false)
    expect(categorySchema.safeParse('').success).toBe(false)
  })
})

describe('createEntryRequestSchema — client/server share this schema', () => {
  it('rejects the same 81-char title the server-side entrySchema rejects', () => {
    const payload = { category: 'trabajo', title: 'a'.repeat(81), description: 'ok', images: [baseImage] }
    expect(createEntryRequestSchema.safeParse(payload).success).toBe(false)
  })

  it('accepts a valid payload', () => {
    const payload = { category: 'trabajo', title: 'ok', description: 'ok', images: [baseImage] }
    expect(createEntryRequestSchema.safeParse(payload).success).toBe(true)
  })
})
