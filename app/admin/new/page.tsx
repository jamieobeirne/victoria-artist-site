import Link from 'next/link'
import { NewEntryForm } from '@/components/admin/NewEntryForm'

export const metadata = { title: 'Nueva entrada — Victoria Ruiz Diaz' }

export default function NewEntryPage() {
  return (
    <div className="admin-dashboard">
      <Link href="/admin" className="admin-back">
        ← Volver al panel
      </Link>
      <h1>Nueva entrada</h1>
      <NewEntryForm />
    </div>
  )
}
