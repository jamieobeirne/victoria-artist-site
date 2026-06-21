'use client'

import { useState } from 'react'
import Link from 'next/link'

const TRABAJO_LINKS = [
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
]

const PROYECTOS_LINKS = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']

interface SidebarProps {
  activePage?: 'statement' | 'bio' | 'contacto' | 'trabajo' | 'proyectos'
}

function setEntered() {
  sessionStorage.setItem('victoria-entered', 'true')
}

export default function Sidebar({ activePage }: SidebarProps) {
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)

  return (
    <aside className="content-sidebar" aria-label="Menu principal">
      <div>
        <Link href="/" className="inner-page-name" onClick={setEntered}>
          <h2 className="sidebar-name">
            Victoria<br />Ruiz<br />Diaz
          </h2>
        </Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
        <Link href="/" onClick={setEntered}>Inicio</Link>

        <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${activePage === 'trabajo' ? ' nav-active' : ''}`}
            type="button"
            onClick={() => setTrabajoOpen(o => !o)}
          >
            Trabajo
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">
                {TRABAJO_LINKS.map((label, i) => (
                  <Link key={i} href="/trabajo">{label}</Link>
                ))}
              </nav>
            </div>
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
            <div className="accordion-inner">
              <nav className="sub-nav">
                {PROYECTOS_LINKS.map((label, i) => (
                  <Link key={i} href="/proyectos">{label}</Link>
                ))}
              </nav>
            </div>
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
