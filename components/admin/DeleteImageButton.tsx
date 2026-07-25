'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'

export function DeleteImageButton({ category, id, imageId }: { category: Category; id: string; imageId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm('¿Eliminar esta imagen?')) return
    setDeleting(true)
    setError(null)
    const res = await fetch(`/api/admin/entries/${category}/${id}/images/${imageId}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) {
      router.refresh()
      return
    }
    const body = await res.json().catch(() => ({}))
    setError(body.error ?? 'No se pudo eliminar la imagen')
  }

  return (
    <div className="admin-image-actions">
      <button type="button" className="admin-danger-btn" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Eliminando…' : 'Eliminar imagen'}
      </button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
