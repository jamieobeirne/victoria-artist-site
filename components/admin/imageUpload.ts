'use client'

// Shared by NewEntryForm and AddImagesForm. Deliberately one copy: HomeGallery
// and Sidebar drifted apart because the same markup lived in two files, and
// git merges both cleanly without noticing. The upload path is the last place
// that should happen twice.

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/upload'
import { compressImage } from '@/lib/compress'

export type PendingImage = { id: string; file: File; previewUrl: string }
export type UploadedImage = { id: string; url: string; caption: string }

const MAX_MB = Math.round(MAX_IMAGE_BYTES / (1024 * 1024))

function sizeInMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1)
}

/**
 * Splits a FileList into files worth uploading and Spanish messages naming the
 * ones that are not. Checked at selection rather than at save: the server
 * enforces the same limits, but finding out after a long upload is a poor way
 * to learn a file is too big.
 */
export function acceptFiles(fileList: FileList | null): {
  accepted: PendingImage[]
  rejected: string[]
} {
  const accepted: PendingImage[] = []
  const rejected: string[] = []
  if (!fileList || fileList.length === 0) return { accepted, rejected }

  for (const file of Array.from(fileList)) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      rejected.push(
        `${file.name}: formato no admitido${file.type ? ` (${file.type})` : ''}. Usa JPG, PNG o WebP.`
      )
    } else if (file.size > MAX_IMAGE_BYTES) {
      rejected.push(`${file.name}: ${sizeInMb(file.size)} MB. Usa un archivo de menos de ${MAX_MB} MB.`)
    } else {
      accepted.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) })
    }
  }
  return { accepted, rejected }
}

/**
 * Compresses, presigns and PUTs one image straight to R2, returning the record
 * the manifest stores. Compression runs first so the key's extension, the
 * content type and the size the server validates all describe the object that
 * actually gets stored.
 */
export async function uploadImage(pending: PendingImage, signal: AbortSignal): Promise<UploadedImage> {
  const file = await compressImage(pending.file)

  const presignRes = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
    signal,
  })
  if (!presignRes.ok) {
    const body = await presignRes.json().catch(() => ({}))
    throw new Error(body.error ?? 'No se pudo preparar la subida')
  }
  const { uploadUrl, publicUrl } = await presignRes.json()

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
    signal,
  })
  if (!putRes.ok) throw new Error('No se pudo subir la imagen')

  return { id: pending.id, url: publicUrl as string, caption: '' }
}

export { MAX_MB }
