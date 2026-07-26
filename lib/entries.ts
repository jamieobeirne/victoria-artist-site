import { randomUUID } from 'crypto'
import type { Manifest, Entry, Category, CreateEntryRequest, ImageItem } from './schema'

export function createEntry(manifest: Manifest, req: CreateEntryRequest): { manifest: Manifest; entry: Entry } {
  const now = new Date().toISOString()
  const entry: Entry = {
    id: randomUUID(),
    title: req.title,
    description: req.description,
    images: req.images,
    createdAt: now,
    updatedAt: now,
  }
  const next: Manifest = {
    ...manifest,
    [req.category]: [...manifest[req.category], entry],
  }
  return { manifest: next, entry }
}

export function updateEntry(
  manifest: Manifest,
  category: Category,
  id: string,
  patch: { title?: string; description?: string }
): Manifest {
  const list = manifest[category]
  const idx = list.findIndex(e => e.id === id)
  if (idx === -1) throw new Error(`Entry "${id}" not found in "${category}"`)

  const updated: Entry = { ...list[idx], ...patch, updatedAt: new Date().toISOString() }
  const nextList = [...list]
  nextList[idx] = updated
  return { ...manifest, [category]: nextList }
}

export function deleteEntry(
  manifest: Manifest,
  category: Category,
  id: string
): { manifest: Manifest; removedImages: ImageItem[] } {
  const list = manifest[category]
  const entry = list.find(e => e.id === id)
  if (!entry) throw new Error(`Entry "${id}" not found in "${category}"`)

  const nextList = list.filter(e => e.id !== id)
  return { manifest: { ...manifest, [category]: nextList }, removedImages: entry.images }
}

export function deleteImage(
  manifest: Manifest,
  category: Category,
  entryId: string,
  imageId: string
): { manifest: Manifest; removedImage: ImageItem } {
  const list = manifest[category]
  const idx = list.findIndex(e => e.id === entryId)
  if (idx === -1) throw new Error(`Entry "${entryId}" not found in "${category}"`)

  const entry = list[idx]
  if (entry.images.length <= 1) {
    throw new Error('Cannot delete the last image of an entry — delete the entry instead')
  }

  const removedImage = entry.images.find(img => img.id === imageId)
  if (!removedImage) {
    throw new Error(`Image "${imageId}" not found on entry "${entryId}"`)
  }

  const nextImages = entry.images.filter(img => img.id !== imageId)
  const updated: Entry = { ...entry, images: nextImages, updatedAt: new Date().toISOString() }
  const nextList = [...list]
  nextList[idx] = updated
  return { manifest: { ...manifest, [category]: nextList }, removedImage }
}
