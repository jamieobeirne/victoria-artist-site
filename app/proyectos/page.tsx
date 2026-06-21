'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Artwork {
  src: string
  title: string
  meta: string
  desc?: string
}

const PROYECTOS_ITEMS: { group: string; items: Artwork[] }[] = [
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0034.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0035.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0036.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0037.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0038.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0039.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0040.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0041.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { src: '/images/landingImage_page-0052.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ]},
]

const TRABAJO_GROUPS = Array(10).fill('Lorem ipsum')

export default function ProyectosPage() {
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null)
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(true)
  const [openYearTrabajo, setOpenYearTrabajo] = useState<number | null>(null)
  const [openYear, setOpenYear] = useState<number | null>(null)

  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <aside className="content-sidebar" aria-label="Menu principal">
            <div>
              <Link href="/" className="inner-page-name">
                <h2 className="sidebar-name">Victoria<br />Ruiz<br />Diaz</h2>
              </Link>
            </div>

            <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
              <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
                <button
                  className="nav-toggle"
                  type="button"
                  onClick={() => setTrabajoOpen(o => !o)}
                >
                  Trabajo
                </button>
                <div className="nav-accordion-body">
                  <nav className="year-nav">
                    {TRABAJO_GROUPS.map((label, i) => (
                      <div key={i} className="year-item">
                        <button
                          className={`year-btn${openYearTrabajo === i ? ' open' : ''}`}
                          type="button"
                          onClick={() => setOpenYearTrabajo(openYearTrabajo === i ? null : i)}
                        >
                          {label}
                        </button>
                        {openYearTrabajo === i && (
                          <ul className="year-dropdown">
                            <li><Link href="/trabajo">A — Lorem ipsum</Link></li>
                            <li><Link href="/trabajo">B — Lorem ipsum</Link></li>
                            <li><Link href="/trabajo">C — Lorem ipsum</Link></li>
                          </ul>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
                <button
                  className="nav-toggle nav-active"
                  type="button"
                  onClick={() => setProyectosOpen(o => !o)}
                >
                  Proyectos
                </button>
                <div className="nav-accordion-body">
                  <nav className="year-nav">
                    {PROYECTOS_ITEMS.map((group, i) => (
                      <div key={i} className="year-item">
                        <button
                          className={`year-btn${openYear === i ? ' open' : ''}`}
                          type="button"
                          onClick={() => setOpenYear(openYear === i ? null : i)}
                        >
                          {group.group}
                        </button>
                        {openYear === i && (
                          <ul className="year-dropdown">
                            {group.items.map((item, j) => (
                              <li key={j}>
                                <a
                                  href="#"
                                  className={activeArtwork?.src === item.src ? 'sub-active' : ''}
                                  onClick={e => { e.preventDefault(); setActiveArtwork(item) }}
                                >
                                  {String.fromCharCode(65 + j)} — Lorem ipsum
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              <Link href="/statement">Statement</Link>
              <Link href="/bio">Bio</Link>
              <Link href="/contacto">Contacto</Link>
            </nav>
          </aside>

          <section className="trabajo-stage" aria-label="Proyecto seleccionado">
            <div className="artwork-display">
              {activeArtwork && (
                <>
                  <img src={activeArtwork.src} alt="Proyecto seleccionado" />
                  <div className="artwork-info">
                    <span className="artwork-title">{activeArtwork.title}</span>
                    <span className="artwork-meta">{activeArtwork.meta}</span>
                    {activeArtwork.desc && (
                      <span className="artwork-desc">{activeArtwork.desc}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
