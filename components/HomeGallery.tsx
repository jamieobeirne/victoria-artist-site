'use client'

import { useRouter } from 'next/navigation'
import { useGallery } from './GalleryContext'

const UNTITLED = 'Sin título'

// The /home stage only. The menu that picks the entry is components/Sidebar.tsx,
// rendered once by app/(site)/layout.tsx; the two share state through GalleryContext.
export function HomeGallery() {
  const router = useRouter()
  const { activeEntry, activeImageIndex, setActiveImageIndex, manifestError } = useGallery()

  if (manifestError) {
    return (
      <section className="trabajo-stage" aria-label="Obra seleccionada">
        <p>No se pudo cargar la galeria en este momento.</p>
        <button type="button" className="form-submit" onClick={() => router.refresh()}>
          Reintentar
        </button>
      </section>
    )
  }

  const activeImage = activeEntry?.images[activeImageIndex]

  return (
    <section className="trabajo-stage" aria-label="Obra seleccionada">
      <div className="artwork-display">
        <div className="artwork-info">
          <span className="artwork-title">{activeEntry ? activeEntry.title || UNTITLED : ''}</span>
          {activeEntry?.description && <span className="artwork-desc">{activeEntry.description}</span>}
        </div>
        <img
          src={activeImage?.url ?? '/images/home.jpg'}
          alt={activeEntry ? activeEntry.title || UNTITLED : 'Obra destacada'}
        />
        {activeEntry && activeEntry.images.length > 1 && (
          <div className="artwork-thumbs" role="tablist" aria-label="Imagenes de la entrada">
            {activeEntry.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                role="tab"
                aria-selected={index === activeImageIndex}
                className={index === activeImageIndex ? 'artwork-thumb active' : 'artwork-thumb'}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image.url} alt={`${activeEntry.title || UNTITLED} — ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
