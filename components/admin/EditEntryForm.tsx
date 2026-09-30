'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'
import { CharCounter } from './CharCounter'

const TITLE_MAX = 80
const DESCRIPTION_MAX = 500

export function EditEntryForm({
  category,
  id,
  initialTitle,
  initialDescription,
  initialTitleEn = '',
  initialDescriptionEn = '',
}: {
  category: Category
  id: string
  initialTitle: string
  initialDescription: string
  initialTitleEn?: string
  initialDescriptionEn?: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [titleEn, setTitleEn] = useState(initialTitleEn)
  const [descriptionEn, setDescriptionEn] = useState(initialDescriptionEn)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Title and description are optional; nothing here can block a save.
  const canSave = !saving

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/entries/${category}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, titleEn, descriptionEn }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo guardar')
      }
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="edit-title">
          Título
        </label>
        <input
          id="edit-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          disabled={saving}
        />
        <CharCounter value={title} max={TITLE_MAX} />
      </div>

      <div className="form-field">
        <label htmlFor="edit-description">
          Descripción
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          maxLength={DESCRIPTION_MAX}
          disabled={saving}
        />
        <CharCounter value={description} max={DESCRIPTION_MAX} />
      </div>

      <fieldset className="form-english">
        <legend>En inglés (opcional)</legend>
        <p className="form-hint">Si los rellenas, se muestran debajo del texto en español. Si los dejas vacíos, solo se ve el español.</p>

        <div className="form-field">
          <label htmlFor="edit-title-en">Título en inglés</label>
          <input
            id="edit-title-en"
            lang="en"
            value={titleEn}
            onChange={e => setTitleEn(e.target.value)}
            maxLength={TITLE_MAX}
            disabled={saving}
          />
          <CharCounter value={titleEn} max={TITLE_MAX} />
        </div>

        <div className="form-field">
          <label htmlFor="edit-description-en">Descripción en inglés</label>
          <textarea
            id="edit-description-en"
            lang="en"
            value={descriptionEn}
            onChange={e => setDescriptionEn(e.target.value)}
            rows={4}
            maxLength={DESCRIPTION_MAX}
            disabled={saving}
          />
          <CharCounter value={descriptionEn} max={DESCRIPTION_MAX} />
        </div>
      </fieldset>

      {error && <p className="admin-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="form-submit" disabled={!canSave}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
