'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Artwork {
  src: string
  title: string
  meta: string
  desc?: string
}

const TRABAJO_ITEMS: { group: string; items: Artwork[] }[] = [
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0044.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0045.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0046.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0047.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0007.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0008.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0009.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0010.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0011.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0012.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0013.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0014.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0015.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0016.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0017.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0018.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0019.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0020.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0048.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0022.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0023.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0049.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0025.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0026.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0027.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0028.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0029.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0051.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0031.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }, { src: '/images/landingImage_page-0032.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' }]},
]

const PROYECTOS_LINKS = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']

function setEntered() {
  sessionStorage.setItem('victoria-entered', 'true')
}

export default function TrabajoPage() {
  const [activeArtwork, setActiveArtwork] = useState<Artwork>(TRABAJO_ITEMS[0].items[0])
  const [trabajoOpen, setTrabajoOpen] = useState(true)
  const [proyectosOpen, setProyectosOpen] = useState(false)

  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <aside className="content-sidebar" aria-label="Menu principal">
            <div>
              <Link href="/" className="inner-page-name" onClick={setEntered}>
                <h2 className="sidebar-name">Victoria<br />Ruiz<br />Diaz</h2>
              </Link>
            </div>

            <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
              <Link href="/" onClick={setEntered}>Inicio</Link>

              <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
                <button
                  className="nav-toggle nav-active"
                  type="button"
                  onClick={() => setTrabajoOpen(o => !o)}
                >
                  Trabajo
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {TRABAJO_ITEMS.map((group, i) => (
                        <a
                          key={i}
                          href="#"
                          className={activeArtwork.src === group.items[0].src ? 'sub-active' : ''}
                          onClick={e => { e.preventDefault(); setActiveArtwork(group.items[0]) }}
                        >
                          {group.group}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
                <button
                  className="nav-toggle"
                  type="button"
                  onClick={() => setProyectosOpen(o => !o)}
                >
                  Proyectos
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {PROYECTOS_LINKS.map((label, i) => (
                        <Link key={i} href="/proyectos">{label}</Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <Link href="/statement">Statement</Link>
              <Link href="/bio">Bio</Link>
              <Link href="/contacto">Contacto</Link>
            </nav>
          </aside>

          <section className="trabajo-stage" aria-label="Obra seleccionada">
            <div className="artwork-display">
              <img src={activeArtwork.src} alt="Obra seleccionada" />
              <div className="artwork-info">
                <span className="artwork-title">{activeArtwork.title}</span>
                <span className="artwork-meta">{activeArtwork.meta}</span>
                {activeArtwork.desc && (
                  <span className="artwork-desc">{activeArtwork.desc}</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
