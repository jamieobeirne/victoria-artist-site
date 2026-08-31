'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Entry } from '@/lib/schema'

export function HomeGallery({ trabajo, proyectos }: { trabajo: Entry[]; proyectos: Entry[] }) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)

  function selectEntry(entry: Entry) {
    setActiveEntry(entry)
    setActiveImageIndex(0)
  }

  function resetToDefault() {
    setActiveEntry(null)
    setActiveImageIndex(0)
  }

  const activeImage = activeEntry?.images[activeImageIndex]

  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <aside className="content-sidebar" aria-label="Menu principal">
            <div>
              <Link href="/home" className="inner-page-name" onClick={resetToDefault}>
                <h2 className="sidebar-name">Victoria Ruiz Diaz</h2>
              </Link>
            </div>

            <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
              <Link href="/home" className="nav-active" onClick={resetToDefault}>
                Inicio
              </Link>

              <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
                <button className="nav-toggle" type="button" onClick={() => setTrabajoOpen(o => !o)}>
                  Trabajo
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {trabajo.map(entry => (
                        <a
                          key={entry.id}
                          href="#"
                          className={activeEntry?.id === entry.id ? 'sub-active' : ''}
                          onClick={e => {
                            e.preventDefault()
                            selectEntry(entry)
                          }}
                        >
                          {entry.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
                <button className="nav-toggle" type="button" onClick={() => setProyectosOpen(o => !o)}>
                  Proyectos
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {proyectos.map(entry => (
                        <a
                          key={entry.id}
                          href="#"
                          className={activeEntry?.id === entry.id ? 'sub-active' : ''}
                          onClick={e => {
                            e.preventDefault()
                            selectEntry(entry)
                          }}
                        >
                          {entry.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <Link href="/statement">Statement</Link>

              <div className={`nav-accordion-item${cvOpen ? ' open' : ''}`}>
                <button className="nav-toggle" type="button" onClick={() => setCvOpen(o => !o)}>
                  CV
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      <Link href="/bio">Bio</Link>
                      <Link href="/cv">CV extendido</Link>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="sidebar-social" aria-label="Redes sociales">
                <a href="mailto:victoriard6@gmail.com" aria-label="Email" className="social-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 6l10 7 10-7" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/victoria_r_d_" aria-label="Instagram" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </nav>
          </aside>

          <section className="trabajo-stage" aria-label="Obra seleccionada">
            <div className="artwork-display">
              <img src={activeImage?.url ?? '/images/home.jpg'} alt="Obra destacada" />
              <div className="artwork-info">
                <span className="artwork-title">{activeEntry?.title ?? ''}</span>
                <span className="artwork-meta">{activeImage?.caption ?? ''}</span>
                {activeEntry?.description && <span className="artwork-desc">{activeEntry.description}</span>}
              </div>
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
                      <img src={image.url} alt={image.caption} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
