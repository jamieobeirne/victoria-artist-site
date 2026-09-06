'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'
import { CharCounter } from './CharCounter'

const TITLE_MAX = 80
const DESCRIPTION_MAX = 500

function Required() {
  return (
    <span className="required-star" aria-hidden="true">
      *
    </span>
  )
}

export function EditEntryForm({
  category,
  id,
  initialTitle,
  initialDescription,
}: {
  category: Category
  id: string
  initialTitle: string
  initialDescription: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [saving, setSaving] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const titleMissing = title.length === 0
  const descriptionMissing = description.length === 0
  const canSave = !titleMissing && !descriptionMissing && !saving

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAttempted(true)
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/entries/${category}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
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
          Título <Required />
        </label>
        <input
          id="edit-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          aria-invalid={attempted && titleMissing}
          disabled={saving}
          required
        />
        <CharCounter value={title} max={TITLE_MAX} />
      </div>

      <div className="form-field">
        <label htmlFor="edit-description">
          Descripción <Required />
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          maxLength={DESCRIPTION_MAX}
          aria-invalid={attempted && descriptionMissing}
          disabled={saving}
          required
        />
        <CharCounter value={description} max={DESCRIPTION_MAX} />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="form-actions">
        <span className="form-submit-wrap" onClick={() => setAttempted(true)}>
          <button type="submit" className="form-submit" disabled={!canSave}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </span>
      </div>
    </form>
  )
}
