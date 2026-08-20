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

const PROYECTOS_ITEMS: { group: string; items: Artwork[] }[] = [
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0034.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0035.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0036.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0037.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0038.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0039.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }]},
  { group: 'Lorem ipsum', items: [{ src: '/images/landingImage_page-0040.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0041.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }, { src: '/images/landingImage_page-0052.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }]},
]

export default function HomePage() {
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null)
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <aside className="content-sidebar" aria-label="Menu principal">
            <div>
              <Link href="/home" className="inner-page-name" onClick={() => setActiveArtwork(null)}>
                <h2 className="sidebar-name">Victoria Ruiz Diaz</h2>
              </Link>
            </div>

            <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
              <Link href="/home" className="nav-active" onClick={() => setActiveArtwork(null)}>Inicio</Link>

              <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
                <button className="nav-toggle" type="button" onClick={() => setTrabajoOpen(o => !o)}>
                  Trabajo
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {TRABAJO_ITEMS.map((group, i) => (
                        <a
                          key={i}
                          href="#"
                          className={activeArtwork?.src === group.items[0].src ? 'sub-active' : ''}
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
                <button className="nav-toggle" type="button" onClick={() => setProyectosOpen(o => !o)}>
                  Proyectos
                </button>
                <div className="nav-accordion-body">
                  <div className="accordion-inner">
                    <nav className="sub-nav">
                      {PROYECTOS_ITEMS.map((group, i) => (
                        <a
                          key={i}
                          href="#"
                          className={activeArtwork?.src === group.items[0].src ? 'sub-active' : ''}
                          onClick={e => { e.preventDefault(); setActiveArtwork(group.items[0]) }}
                        >
                          {group.group}
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
              <img src={activeArtwork?.src ?? '/images/home.jpg'} alt="Obra destacada" />
              <div className="artwork-info">
                <span className="artwork-title">{activeArtwork?.title ?? ''}</span>
                <span className="artwork-meta">{activeArtwork?.meta ?? ''}</span>
                {activeArtwork?.desc && <span className="artwork-desc">{activeArtwork.desc}</span>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
