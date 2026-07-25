/** @jest-environment node */
import { validateUploadFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/upload'

describe('validateUploadFile', () => {
  it('accepts an allowed image type under the size cap', () => {
    for (const type of ALLOWED_IMAGE_TYPES) {
      expect(validateUploadFile({ type, size: 1024 }).ok).toBe(true)
    }
  })

  it('rejects a non-image file type', () => {
    const result = validateUploadFile({ type: 'application/pdf', size: 1024 })
    expect(result.ok).toBe(false)
  })

  it('rejects a file exceeding the size cap', () => {
    const result = validateUploadFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 })
    expect(result.ok).toBe(false)
  })

  it('accepts a file exactly at the size cap', () => {
    const result = validateUploadFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES })
    expect(result.ok).toBe(true)
  })
})
