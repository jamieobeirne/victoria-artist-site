'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'
import { CharCounter } from './CharCounter'

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
  const [error, setError] = useState<string | null>(null)

  const canSave =
    title.length > 0 && title.length <= 80 && description.length > 0 && description.length <= 500 && !saving

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
        <label htmlFor="edit-title">Título</label>
        <input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} maxLength={160} required />
        <CharCounter value={title} max={80} />
      </div>

      <div className="form-field">
        <label htmlFor="edit-description">Descripción</label>
        <textarea
          id="edit-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          maxLength={800}
          required
        />
        <CharCounter value={description} max={500} />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="form-submit" disabled={!canSave}>
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
