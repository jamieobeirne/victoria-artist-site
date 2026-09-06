'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createEntryRequestSchema, type Category } from '@/lib/schema'
import { CharCounter } from './CharCounter'

const TITLE_MAX = 80
const DESCRIPTION_MAX = 500
const CAPTION_MAX = 150

type PendingImage = { id: string; file: File; caption: string; previewUrl: string }

function Required() {
  return (
    <span className="required-star" aria-hidden="true">
      *
    </span>
  )
}

export function NewEntryForm() {
  const router = useRouter()
  const [category, setCategory] = useState<'' | Category>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<PendingImage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const next = Array.from(fileList).map(file => ({
      id: crypto.randomUUID(),
      file,
      caption: '',
      previewUrl: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...next])
  }

  function updateCaption(id: string, caption: string) {
    setImages(prev => prev.map(img => (img.id === id ? { ...img, caption } : img)))
  }

  function removeImage(id: string) {
    setImages(prev => {
      const target = prev.find(img => img.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(img => img.id !== id)
    })
  }

  function cancelUpload() {
    abortRef.current?.abort()
  }

  async function uploadImage(pending: PendingImage, signal: AbortSignal) {
    const presignRes = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: pending.file.name,
        contentType: pending.file.type,
        size: pending.file.size,
      }),
      signal,
    })
    if (!presignRes.ok) {
      const body = await presignRes.json().catch(() => ({}))
      throw new Error(body.error ?? 'No se pudo preparar la subida')
    }
    const { uploadUrl, publicUrl } = await presignRes.json()

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: pending.file,
      headers: { 'Content-Type': pending.file.type },
      signal,
    })
    if (!putRes.ok) throw new Error('No se pudo subir la imagen')

    return { id: pending.id, url: publicUrl as string, caption: pending.caption }
  }

  // Inputs are hard-capped at the schema limits, so the only way to be invalid
  // is to leave something empty. Missing fields turn red once a save is tried.
  const categoryMissing = category === ''
  const titleMissing = title.length === 0
  const descriptionMissing = description.length === 0
  const imagesMissing = images.length === 0
  const captionsMissing = images.some(img => img.caption.length === 0)

  const canSubmit =
    !categoryMissing &&
    !titleMissing &&
    !descriptionMissing &&
    !imagesMissing &&
    !captionsMissing &&
    !submitting

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAttempted(true)
    if (!canSubmit) return

    const controller = new AbortController()
    abortRef.current = controller
    setSubmitting(true)
    setError(null)
    try {
      const uploaded = await Promise.all(images.map(img => uploadImage(img, controller.signal)))
      const payload = { category, title, description, images: uploaded }
      const parsed = createEntryRequestSchema.safeParse(payload)
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Datos inválidos')

      const res = await fetch('/api/admin/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo crear la entrada')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      const caught = err as Error
      setError(
        caught.name === 'AbortError'
          ? 'Subida cancelada. No se ha creado la entrada.'
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
        <label htmlFor="new-entry-category">
          Categoría <Required />
        </label>
        <select
          id="new-entry-category"
          value={category}
          onChange={e => setCategory(e.target.value as '' | Category)}
          aria-invalid={attempted && categoryMissing}
          disabled={submitting}
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          <option value="trabajo">Trabajo</option>
          <option value="proyectos">Proyectos</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="new-entry-title">
          Título <Required />
        </label>
        <input
          id="new-entry-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          aria-invalid={attempted && titleMissing}
          disabled={submitting}
          required
        />
        <CharCounter value={title} max={TITLE_MAX} />
      </div>

      <div className="form-field">
        <label htmlFor="new-entry-description">
          Descripción <Required />
        </label>
        <textarea
          id="new-entry-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          maxLength={DESCRIPTION_MAX}
          aria-invalid={attempted && descriptionMissing}
          disabled={submitting}
          required
        />
        <CharCounter value={description} max={DESCRIPTION_MAX} />
      </div>

      <div className="form-field">
        <label htmlFor="new-entry-images">
          Imágenes <Required />
        </label>
        <input
          id="new-entry-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={e => handleFiles(e.target.files)}
          aria-invalid={attempted && imagesMissing}
          disabled={submitting}
        />
      </div>

      {images.length > 0 && (
        <ul className="admin-image-list">
          {images.map(img => (
            <li key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="" width={96} height={96} className="admin-image-thumb" />
              <div className="form-field">
                <label htmlFor={`caption-${img.id}`}>
                  Descripción breve de la imagen <Required />
                </label>
                <input
                  id={`caption-${img.id}`}
                  value={img.caption}
                  onChange={e => updateCaption(img.id, e.target.value)}
                  maxLength={CAPTION_MAX}
                  aria-invalid={attempted && img.caption.length === 0}
                  disabled={submitting}
                />
                <CharCounter value={img.caption} max={CAPTION_MAX} />
              </div>
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

      {error && <p className="admin-error">{error}</p>}

      <div className="form-actions">
        {/* The wrapper catches clicks on the disabled button, which swallows its
            own events, so an attempted save still marks the missing fields. */}
        <span className="form-submit-wrap" onClick={() => setAttempted(true)}>
          <button type="submit" className="form-submit" disabled={!canSubmit}>
            {submitting ? 'Guardando…' : 'Guardar entrada'}
          </button>
        </span>

        {submitting && (
          <button type="button" className="admin-danger-btn" onClick={cancelUpload}>
            Cancelar subida
          </button>
        )}
      </div>
    </form>
  )
}
