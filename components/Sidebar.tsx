'use client'

import { useState } from 'react'
import Link from 'next/link'

const TRABAJO_GROUPS = [
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
]

const PROYECTOS_GROUPS = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']

interface SidebarProps {
  activePage?: 'statement' | 'bio' | 'contacto' | 'trabajo' | 'proyectos'
}

export default function Sidebar({ activePage }: SidebarProps) {
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

  return (
    <aside className="content-sidebar" aria-label="Menu principal">
      <div>
        <Link href="/" className="inner-page-name">
          <h2 className="sidebar-name">
            Victoria<br />Ruiz<br />Diaz
          </h2>
        </Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
        <Link href="/">Inicio</Link>
        <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${activePage === 'trabajo' ? ' nav-active' : ''}`}
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
                    onClick={() => toggleYear(i, openYearTrabajo, setOpenYearTrabajo)}
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
            className={`nav-toggle${activePage === 'proyectos' ? ' nav-active' : ''}`}
            type="button"
            onClick={() => setProyectosOpen(o => !o)}
          >
            Proyectos
          </button>
          <div className="nav-accordion-body">
            <nav className="year-nav">
              {PROYECTOS_GROUPS.map((label, i) => (
                <div key={i} className="year-item">
                  <button
                    className={`year-btn${openYearProyectos === i ? ' open' : ''}`}
                    type="button"
                    onClick={() => toggleYear(i, openYearProyectos, setOpenYearProyectos)}
                  >
                    {label}
                  </button>
                  {openYearProyectos === i && (
                    <ul className="year-dropdown">
                      <li><Link href="/proyectos">A — Lorem ipsum</Link></li>
                      <li><Link href="/proyectos">B — Lorem ipsum</Link></li>
                      <li><Link href="/proyectos">C — Lorem ipsum</Link></li>
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <Link href="/statement" className={activePage === 'statement' ? 'nav-active' : ''}>
          Statement
        </Link>
        <Link href="/bio" className={activePage === 'bio' ? 'nav-active' : ''}>
          Bio
        </Link>
        <Link href="/contacto" className={activePage === 'contacto' ? 'nav-active' : ''}>
          Contacto
        </Link>
      </nav>
    </aside>
  )
}
