'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createEntryRequestSchema, type Category } from '@/lib/schema'
import { CharCounter } from './CharCounter'

type PendingImage = { id: string; file: File; caption: string; previewUrl: string }

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

  // Every reason the form cannot be saved, in the order the fields appear.
  // Shown to the admin instead of silently disabling the button.
  const problems: string[] = []
  if (category === '') problems.push('Selecciona una categoría.')
  if (title.length === 0) problems.push('El título es obligatorio.')
  else if (title.length > 80) problems.push(`El título tiene ${title.length} caracteres; el máximo es 80.`)
  if (description.length === 0) problems.push('La descripción es obligatoria.')
  else if (description.length > 500)
    problems.push(`La descripción tiene ${description.length} caracteres; el máximo es 500.`)
  if (images.length === 0) problems.push('Añade al menos una imagen.')
  else {
    if (images.some(img => img.caption.length === 0))
      problems.push('Cada imagen necesita una descripción breve.')
    const longest = images.reduce((max, img) => Math.max(max, img.caption.length), 0)
    if (longest > 150)
      problems.push(`Una descripción de imagen tiene ${longest} caracteres; el máximo es 150.`)
  }

  // Don't scold someone who has only just opened the form.
  const started = category !== '' || title.length > 0 || description.length > 0 || images.length > 0
  const showProblems = (started || attempted) && problems.length > 0
  const canSubmit = problems.length === 0 && !submitting

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
      const e = err as Error
      setError(
        e.name === 'AbortError'
          ? 'Subida cancelada. No se ha creado la entrada.'
          : e.message
      )
    } finally {
      abortRef.current = null
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="new-entry-category">Categoría</label>
        <select
          id="new-entry-category"
          value={category}
          onChange={e => setCategory(e.target.value as '' | Category)}
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
        <label htmlFor="new-entry-title">Título</label>
        <input
          id="new-entry-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={160}
          aria-invalid={title.length > 80}
          disabled={submitting}
          required
        />
        <CharCounter value={title} max={80} />
      </div>

      <div className="form-field">
        <label htmlFor="new-entry-description">Descripción</label>
        <textarea
          id="new-entry-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          maxLength={800}
          aria-invalid={description.length > 500}
          disabled={submitting}
          required
        />
        <CharCounter value={description} max={500} />
      </div>

      <div className="form-field">
        <label htmlFor="new-entry-images">Imágenes</label>
        <input
          id="new-entry-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={e => handleFiles(e.target.files)}
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
                <label htmlFor={`caption-${img.id}`}>Descripción breve de la imagen</label>
                <input
                  id={`caption-${img.id}`}
                  value={img.caption}
                  onChange={e => updateCaption(img.id, e.target.value)}
                  maxLength={200}
                  aria-invalid={img.caption.length > 150}
                  disabled={submitting}
                />
                <CharCounter value={img.caption} max={150} />
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

      {!started && !attempted && (
        <p className="form-hint">
          Todos los campos son obligatorios: categoría, título, descripción y al menos una imagen con su
          descripción breve.
        </p>
      )}

      {showProblems && (
        <div className="form-problems" role="status" aria-live="polite">
          <p className="form-problems-title">
            Todos los campos son obligatorios. Para guardar, corrige lo siguiente:
          </p>
          <ul>
            {problems.map(problem => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-actions">
        {/* The wrapper catches clicks on the disabled button (which swallows its
            own events) so the admin gets told why nothing happened. */}
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
