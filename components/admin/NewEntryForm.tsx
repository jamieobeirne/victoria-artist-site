'use client'

import { useState, type FormEvent } from 'react'
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
  const [error, setError] = useState<string | null>(null)

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
    setImages(prev => prev.filter(img => img.id !== id))
  }

  async function uploadImage(pending: PendingImage) {
    const presignRes = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: pending.file.name,
        contentType: pending.file.type,
        size: pending.file.size,
      }),
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
    })
    if (!putRes.ok) throw new Error('No se pudo subir la imagen')

    return { id: pending.id, url: publicUrl as string, caption: pending.caption }
  }

  const titleOk = title.length > 0 && title.length <= 80
  const descriptionOk = description.length > 0 && description.length <= 500
  const captionsOk = images.length > 0 && images.every(img => img.caption.length > 0 && img.caption.length <= 150)
  const canSubmit = category !== '' && titleOk && descriptionOk && captionsOk && !submitting

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const uploaded = await Promise.all(images.map(uploadImage))
      const payload = { category, title, description, images: uploaded }
      const parsed = createEntryRequestSchema.safeParse(payload)
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Datos inválidos')

      const res = await fetch('/api/admin/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo crear la entrada')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
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
                />
                <CharCounter value={img.caption} max={150} />
              </div>
              <button type="button" onClick={() => removeImage(img.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="form-submit" disabled={!canSubmit}>
        {submitting ? 'Guardando…' : 'Guardar entrada'}
      </button>
    </form>
  )
}
