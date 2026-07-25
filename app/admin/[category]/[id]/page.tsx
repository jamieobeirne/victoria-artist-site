import { notFound } from 'next/navigation'
import { readManifest } from '@/lib/manifest'
import { categorySchema } from '@/lib/schema'
import { EditEntryForm } from '@/components/admin/EditEntryForm'
import { DeleteEntryButton } from '@/components/admin/DeleteEntryButton'
import { DeleteImageButton } from '@/components/admin/DeleteImageButton'

export const dynamic = 'force-dynamic'

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category, id } = await params
  const categoryResult = categorySchema.safeParse(category)
  if (!categoryResult.success) notFound()

  const manifest = await readManifest()
  const entry = manifest[categoryResult.data].find(e => e.id === id)
  if (!entry) notFound()

  return (
    <div className="admin-dashboard">
      <h1>Editar entrada</h1>

      <EditEntryForm
        category={categoryResult.data}
        id={entry.id}
        initialTitle={entry.title}
        initialDescription={entry.description}
      />

      <section className="admin-section">
        <h2>Imágenes</h2>
        <ul className="admin-image-list">
          {entry.images.map(img => (
            <li key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption} width={96} height={96} className="admin-image-thumb" />
              <span>{img.caption}</span>
              <DeleteImageButton category={categoryResult.data} id={entry.id} imageId={img.id} />
            </li>
          ))}
        </ul>
      </section>

      <DeleteEntryButton category={categoryResult.data} id={entry.id} />
    </div>
  )
}
