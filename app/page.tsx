'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Artwork {
  src: string
  title: string
  meta: string
  desc?: string
}

const TRABAJO_ITEMS: { group: string; items: Artwork[] }[] = [
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0044.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0045.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0046.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0047.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0007.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0008.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0009.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0010.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0011.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0012.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0013.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0014.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0015.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0016.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0017.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0018.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0019.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0020.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0048.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0022.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0023.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0049.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0025.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0026.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0027.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0028.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0029.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
  { group: 'Lorem ipsum', items: [
    { src: '/images/landingImage_page-0051.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0031.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
    { src: '/images/landingImage_page-0032.jpg', title: 'Lorem ipsum', meta: 'Lorem ipsum' },
  ]},
]

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

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null)
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)
  const [openYearTrabajo, setOpenYearTrabajo] = useState<number | null>(null)
  const [openYearProyectos, setOpenYearProyectos] = useState<number | null>(null)

  function toggleYear(
    index: number,
    openYear: number | null,
    setOpenYear: (v: number | null) => void
  ) {
    setOpenYear(openYear === index ? null : index)
  }

  if (!entered) {
    return (
      <main className="site-shell" data-state="gateway">
        <section className="gateway" aria-labelledby="gateway-title">
          <img
            className="gateway-image"
            src="/images/landingImage_page-0033.jpg"
            alt="Pencil drawing used as the landing gateway artwork"
          />
          <div className="gateway-overlay">
            <div className="gateway-topbar">
              <div className="title-band">
                <h1 id="gateway-title">Victoria Ruiz Diaz</h1>
              </div>
              <button
                id="enter-btn"
                className="enter-btn"
                type="button"
                onClick={() => setEntered(true)}
              >
                Entrar
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <aside className="content-sidebar" aria-label="Menu principal">
            <div>
              <h2 className="sidebar-name">
                Victoria<br />Ruiz<br />Diaz
              </h2>
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
                    {TRABAJO_ITEMS.map((group, i) => (
                      <div key={i} className="year-item">
                        <button
                          className={`year-btn${openYearTrabajo === i ? ' open' : ''}`}
                          type="button"
                          onClick={() => toggleYear(i, openYearTrabajo, setOpenYearTrabajo)}
                        >
                          {group.group}
                        </button>
                        {openYearTrabajo === i && (
                          <ul className="year-dropdown">
                            {group.items.map((item, j) => (
                              <li key={j}>
                                <a
                                  href="#"
                                  className={activeArtwork?.src === item.src ? 'sub-active' : ''}
                                  onClick={e => {
                                    e.preventDefault()
                                    setActiveArtwork(item)
                                  }}
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

              <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
                <button
                  className="nav-toggle"
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
                          className={`year-btn${openYearProyectos === i ? ' open' : ''}`}
                          type="button"
                          onClick={() => toggleYear(i, openYearProyectos, setOpenYearProyectos)}
                        >
                          {group.group}
                        </button>
                        {openYearProyectos === i && (
                          <ul className="year-dropdown">
                            {group.items.map((item, j) => (
                              <li key={j}>
                                <a
                                  href="#"
                                  className={activeArtwork?.src === item.src ? 'sub-active' : ''}
                                  onClick={e => {
                                    e.preventDefault()
                                    setActiveArtwork(item)
                                  }}
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

          <section className="trabajo-stage" aria-label="Obra seleccionada">
            <div className="artwork-display">
              <img
                src={activeArtwork?.src ?? '/images/homePageImage.jpg'}
                alt="Obra destacada"
              />
              <div className="artwork-info">
                <span className="artwork-title">{activeArtwork?.title ?? ''}</span>
                <span className="artwork-meta">{activeArtwork?.meta ?? ''}</span>
                {activeArtwork?.desc && (
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
