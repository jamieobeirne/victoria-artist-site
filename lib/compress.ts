// Client-side image compression, applied just before the presigned upload.
//
// Victoria uploads straight off a phone or a camera without thinking about it,
// because she has no reason to: the two production test files were 2.18 MB and
// 4.79 MB. Nothing else in the pipeline shrinks them, so without this every
// visitor downloads the full-resolution original and the 10 GB R2 allowance
// fills with pixels no screen will ever show.
//
// Everything here degrades to "return the original file" rather than throwing.
// A failed compression must never cost Victoria an upload.

/** Longest edge of the stored image, in CSS pixels. 2400 covers a full-bleed
 *  artwork on a retina display with room to spare. */
export const MAX_IMAGE_DIMENSION = 2400

/** WebP quality. 0.82 is visually lossless on photographs at this scale. */
export const COMPRESSION_QUALITY = 0.82

export const COMPRESSED_TYPE = 'image/webp'

/**
 * Scale a width/height pair so its longest edge fits maxEdge, preserving the
 * aspect ratio. Never upscales — a small image is returned untouched.
 */
export function fitWithin(
  width: number,
  height: number,
  maxEdge: number
): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxEdge || longest === 0) return { width, height }
  const scale = maxEdge / longest
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/** Re-extension for the compressed copy. The presign route derives the R2 key's
 *  extension from this filename, so it has to match the encoded type. */
export function compressedFilename(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, '').trim()
  return `${base || 'imagen'}.webp`
}

/**
 * Returns a smaller WebP copy of `file`, or `file` itself when compression is
 * unavailable, fails, or would not actually save anything.
 */
export async function compressImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') {
    return file
  }

  let bitmap: ImageBitmap
  try {
    // 'from-image' applies the EXIF orientation tag. Without it, portrait
    // photos off a phone are drawn to the canvas on their side — the canvas
    // reads raw pixels and knows nothing about the tag the browser honours.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }

  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_IMAGE_DIMENSION)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, COMPRESSED_TYPE, COMPRESSION_QUALITY)
    })

    // toBlob hands back null, or silently falls back to PNG, when the browser
    // cannot encode the requested type. Either way the original is safer.
    if (!blob || blob.type !== COMPRESSED_TYPE) return file

    // An already-optimised file can re-encode larger. Keep whichever is smaller.
    if (blob.size >= file.size) return file

    return new File([blob], compressedFilename(file.name), {
      type: COMPRESSED_TYPE,
      lastModified: Date.now(),
    })
  } catch {
    return file
  } finally {
    bitmap.close()
  }
}
