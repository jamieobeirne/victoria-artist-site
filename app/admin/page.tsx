import Link from 'next/link'
import { readManifest } from '@/lib/manifest'
import { DeleteEntryButton } from '@/components/admin/DeleteEntryButton'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Panel de administración — Victoria Ruiz Diaz' }

const CATEGORY_LABELS = { trabajo: 'Trabajo', proyectos: 'Proyectos' } as const

export default async function AdminDashboardPage() {
  const manifest = await readManifest()

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Entradas</h1>
        <Link href="/admin/new" className="form-submit">
          + Nueva entrada
        </Link>
      </div>

      {(['trabajo', 'proyectos'] as const).map(category => (
        <section key={category} className="admin-section">
          <h2>{CATEGORY_LABELS[category]}</h2>
          {manifest[category].length === 0 ? (
            <p className="admin-empty">Todavía no hay entradas en esta categoría.</p>
          ) : (
            <ul className="admin-entry-list">
              {manifest[category].map(entry => (
                <li key={entry.id}>
                  <Link href={`/admin/${category}/${entry.id}`}>{entry.title}</Link>
                  <span className="admin-entry-meta">{entry.images.length} imagen(es)</span>
                  <DeleteEntryButton category={category} id={entry.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
