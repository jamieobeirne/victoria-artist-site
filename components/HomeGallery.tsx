'use client'

import ContactLinks from './ContactLinks'
import { useState } from 'react'
import Link from 'next/link'
import type { Entry } from '@/lib/schema'

const UNTITLED = 'Sin título'

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
                          {entry.title || UNTITLED}
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
                          {entry.title || UNTITLED}
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

              <ContactLinks />
            </nav>
          </aside>

          <section className="trabajo-stage" aria-label="Obra seleccionada">
            <div className="artwork-display">
              <img src={activeImage?.url ?? '/images/home.jpg'} alt={activeEntry ? activeEntry.title || UNTITLED : 'Obra destacada'} />
              <div className="artwork-info">
                <span className="artwork-title">{activeEntry ? activeEntry.title || UNTITLED : ''}</span>
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
                      <img src={image.url} alt={`${activeEntry.title || UNTITLED} — ${index + 1}`} />
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
