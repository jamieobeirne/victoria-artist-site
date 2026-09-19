import {
  fitWithin,
  compressedFilename,
  compressImage,
  MAX_IMAGE_DIMENSION,
  COMPRESSED_TYPE,
} from '@/lib/compress'

describe('fitWithin', () => {
  it('leaves an image already inside the box untouched', () => {
    expect(fitWithin(1200, 800, 2400)).toEqual({ width: 1200, height: 800 })
  })

  it('does not upscale an image smaller than the box', () => {
    expect(fitWithin(300, 200, MAX_IMAGE_DIMENSION)).toEqual({ width: 300, height: 200 })
  })

  it('scales a landscape image by its longest edge', () => {
    expect(fitWithin(6000, 4000, 2400)).toEqual({ width: 2400, height: 1600 })
  })

  it('scales a portrait image by its longest edge', () => {
    expect(fitWithin(3000, 4500, 2400)).toEqual({ width: 1600, height: 2400 })
  })

  it('never rounds an extreme aspect ratio down to zero', () => {
    const { width, height } = fitWithin(10000, 3, 2400)
    expect(width).toBe(2400)
    expect(height).toBeGreaterThanOrEqual(1)
  })

  it('tolerates a zero-sized bitmap rather than dividing by zero', () => {
    expect(fitWithin(0, 0, 2400)).toEqual({ width: 0, height: 0 })
  })
})

describe('compressedFilename', () => {
  it('replaces the original extension', () => {
    expect(compressedFilename('IMG_4821.JPG')).toBe('IMG_4821.webp')
  })

  it('keeps dots that are part of the name', () => {
    expect(compressedFilename('obra.final.v2.png')).toBe('obra.final.v2.webp')
  })

  it('handles a name with no extension', () => {
    expect(compressedFilename('retrato')).toBe('retrato.webp')
  })

  it('falls back to a name when there is nothing left', () => {
    expect(compressedFilename('.jpg')).toBe('imagen.webp')
  })
})

describe('compressImage', () => {
  const original = new File(['x'.repeat(64)], 'foto.jpg', { type: 'image/jpeg' })

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).createImageBitmap
    jest.restoreAllMocks()
  })

  it('returns the original when the browser cannot decode images', async () => {
    // jsdom has no createImageBitmap — the same shape as an old browser.
    expect(await compressImage(original)).toBe(original)
  })

  it('returns the original when decoding throws', async () => {
    ;(globalThis as Record<string, unknown>).createImageBitmap = jest
      .fn()
      .mockRejectedValue(new Error('corrupt'))
    expect(await compressImage(original)).toBe(original)
  })

  it('returns the original when the canvas cannot encode WebP', async () => {
    ;(globalThis as Record<string, unknown>).createImageBitmap = jest
      .fn()
      .mockResolvedValue({ width: 4000, height: 3000, close: jest.fn() })
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage: jest.fn() } as unknown as CanvasRenderingContext2D)
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(cb => cb(null))

    expect(await compressImage(original)).toBe(original)
  })

  it('keeps the original when re-encoding would make it bigger', async () => {
    ;(globalThis as Record<string, unknown>).createImageBitmap = jest
      .fn()
      .mockResolvedValue({ width: 100, height: 100, close: jest.fn() })
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage: jest.fn() } as unknown as CanvasRenderingContext2D)
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(cb =>
        cb(new Blob(['y'.repeat(4096)], { type: COMPRESSED_TYPE }))
      )

    expect(await compressImage(original)).toBe(original)
  })

  it('returns a smaller WebP file with a matching name when encoding succeeds', async () => {
    const close = jest.fn()
    ;(globalThis as Record<string, unknown>).createImageBitmap = jest
      .fn()
      .mockResolvedValue({ width: 6000, height: 4000, close })
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({ drawImage: jest.fn() } as unknown as CanvasRenderingContext2D)
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(cb => cb(new Blob(['z'], { type: COMPRESSED_TYPE })))

    const result = await compressImage(original)

    expect(result).not.toBe(original)
    expect(result.type).toBe(COMPRESSED_TYPE)
    expect(result.name).toBe('foto.webp')
    expect(result.size).toBeLessThan(original.size)
    expect(close).toHaveBeenCalled()
  })
})
