'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGallery } from './GalleryContext'
import { useLang } from './LangContext'

// The /home stage only. The menu that picks the entry is components/Sidebar.tsx,
// rendered once by app/(site)/layout.tsx; the two share state through GalleryContext.
export function HomeGallery() {
  const router = useRouter()
  const { activeEntry, activeImageIndex, setActiveImageIndex, manifestError } = useGallery()
  const { t } = useLang()
  const UNTITLED = t.untitled
  const [enlarged, setEnlarged] = useState(false)

  // A different entry or image always starts at the normal size.
  const [shownKey, setShownKey] = useState(`${activeEntry?.id}:${activeImageIndex}`)
  const key = `${activeEntry?.id}:${activeImageIndex}`
  if (key !== shownKey) {
    setShownKey(key)
    setEnlarged(false)
  }

  // Escape closes, and the page behind does not scroll while enlarged.
  useEffect(() => {
    if (!enlarged) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlarged(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [enlarged])

  if (manifestError) {
    return (
      <section className="trabajo-stage" aria-label={t.selectedWork}>
        <p>{t.galleryError}</p>
        <button type="button" className="form-submit" onClick={() => router.refresh()}>
          {t.retry}
        </button>
      </section>
    )
  }

  const activeImage = activeEntry?.images[activeImageIndex]

  return (
    <section className="trabajo-stage" aria-label={t.selectedWork}>
      <div className="artwork-display">
        <div className="artwork-info">
          <span className="artwork-title">{activeEntry ? activeEntry.title || UNTITLED : ''}</span>
          {activeEntry?.description && <span className="artwork-desc">{activeEntry.description}</span>}
        </div>
        {activeEntry && activeImage ? (
          // Only an entry's image enlarges; the default home image stays as it is.
          <button type="button" className="artwork-zoom" aria-label={t.enlarge} onClick={() => setEnlarged(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- same reason as the stage image: already compressed at upload */}
            <img src={activeImage.url} alt={activeEntry.title || UNTITLED} />
          </button>
        ) : (
          <img src="/images/home.jpg" alt={t.featuredWork} />
        )}
        {activeEntry && activeEntry.images.length > 1 && (
          <div className="artwork-thumbs" role="tablist" aria-label={t.entryImages}>
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

      {enlarged && activeEntry && activeImage && (
        // Any click closes it: on the image or on the space around it.
        <div
          className="artwork-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeEntry.title || UNTITLED} — ${t.enlarged}`}
          onClick={() => setEnlarged(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- same reason as the stage image: already compressed at upload */}
          <img src={activeImage.url} alt={activeEntry.title || UNTITLED} />
          <button type="button" className="artwork-lightbox-close" aria-label={t.close} autoFocus>
            ×
          </button>
        </div>
      )}
    </section>
  )
}
