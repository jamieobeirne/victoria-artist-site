'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/schema'

export function DeleteEntryButton({ category, id }: { category: Category; id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Eliminar esta entrada y todas sus imágenes?')) return
    setDeleting(true)
    const res = await fetch(`/api/admin/entries/${category}/${id}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) router.refresh()
  }

  return (
    <button type="button" className="admin-danger-btn" onClick={handleDelete} disabled={deleting}>
      {deleting ? 'Eliminando…' : 'Eliminar entrada'}
    </button>
  )
}
