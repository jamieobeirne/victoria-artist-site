export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024

export function validateUploadFile(file: { type: string; size: number }): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `Unsupported file type: ${file.type}` }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `File exceeds the ${MAX_IMAGE_BYTES} byte limit` }
  }
  return { ok: true }
}
