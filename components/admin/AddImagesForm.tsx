'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'
import { acceptFiles, uploadImage, MAX_MB, type PendingImage } from './imageUpload'

/**
 * Adds images to an entry that already exists. Separate from EditEntryForm,
 * which owns the text: this sits with the existing images so "add" and
 * "remove" are in the same place.
 *
 * New images are appended. HomeGallery leads with the first image, so an
 * upload made later must not take over as the lead image.
 */
export function AddImagesForm({ category, id }: { category: Category; id: string }) {
  const router = useRouter()
  const [images, setImages] = useState<PendingImage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  function handleFiles(fileList: FileList | null) {
    const { accepted, rejected } = acceptFiles(fileList)
    setFileErrors(rejected)
    if (accepted.length > 0) setImages(prev => [...prev, ...accepted])
  }

  function removeImage(imageId: string) {
    setImages(prev => {
      const target = prev.find(img => img.id === imageId)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(img => img.id !== imageId)
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (images.length === 0 || submitting) return

    const controller = new AbortController()
    abortRef.current = controller
    setSubmitting(true)
    setError(null)
    try {
      const uploaded = await Promise.all(images.map(img => uploadImage(img, controller.signal)))

      const res = await fetch(`/api/admin/entries/${category}/${id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: uploaded }),
        signal: controller.signal,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudieron añadir las imágenes')
      }

      images.forEach(img => URL.revokeObjectURL(img.previewUrl))
      setImages([])
      setFileErrors([])
      router.refresh()
    } catch (err) {
      const caught = err as Error
      setError(
        caught.name === 'AbortError'
          ? 'Subida cancelada. No se ha añadido ninguna imagen.'
          : caught.message
      )
    } finally {
      abortRef.current = null
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="add-images">Añadir imágenes</label>
        {/* Hidden native control plus a styled label, same as the new-entry
            form: a file input has no placeholder, so the label is the prompt. */}
        <input
          id="add-images"
          type="file"
          className="file-input-hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={e => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
          disabled={submitting}
        />
        <label htmlFor="add-images" className="file-drop">
          Haz clic aquí para añadir una o varias imágenes. JPG, PNG o WebP · máximo {MAX_MB} MB por imagen
        </label>
      </div>

      {images.length > 0 && (
        <ul className="admin-image-list">
          {images.map(img => (
            <li key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="" width={96} height={96} className="admin-image-thumb" />
              <span className="admin-image-name">{img.file.name}</span>
              <button
                type="button"
                className="admin-danger-btn"
                onClick={() => removeImage(img.id)}
                disabled={submitting}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {fileErrors.length > 0 && (
        <ul className="admin-error admin-file-errors" role="alert">
          {fileErrors.map(message => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {error && <p className="admin-error">{error}</p>}

      {images.length > 0 && (
        <div className="form-actions">
          <button type="submit" className="form-submit" disabled={submitting}>
            {submitting ? 'Añadiendo…' : `Añadir ${images.length} imagen(es)`}
          </button>
          {submitting && (
            <button type="button" className="admin-danger-btn" onClick={() => abortRef.current?.abort()}>
              Cancelar subida
            </button>
          )}
        </div>
      )}
    </form>
  )
}
