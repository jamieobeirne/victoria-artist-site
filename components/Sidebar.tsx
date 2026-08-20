'use client'

import { useState } from 'react'
import Link from 'next/link'

const TRABAJO_LINKS = [
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
  'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
]

const PROYECTOS_LINKS = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']

interface SidebarProps {
  activePage?: 'statement' | 'bio' | 'cv' | 'trabajo' | 'proyectos'
}


export default function Sidebar({ activePage }: SidebarProps) {
  const [trabajoOpen, setTrabajoOpen] = useState(activePage === 'trabajo')
  const [proyectosOpen, setProyectosOpen] = useState(activePage === 'proyectos')
  const [cvOpen, setCvOpen] = useState(activePage === 'bio' || activePage === 'cv')

  return (
    <aside className="content-sidebar" aria-label="Menu principal">
      <div>
        <Link href="/home" className="inner-page-name">
          <h2 className="sidebar-name">Victoria Ruiz Diaz</h2>
        </Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
        <Link href="/home">Inicio</Link>

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

        <div className={`nav-accordion-item${cvOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${activePage === 'bio' || activePage === 'cv' ? ' nav-active' : ''}`}
            type="button"
            onClick={() => setCvOpen(o => !o)}
          >
            CV
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">
                <Link href="/bio" className={activePage === 'bio' ? 'sub-active' : ''}>Bio</Link>
                <Link href="/cv" className={activePage === 'cv' ? 'sub-active' : ''}>CV extendido</Link>
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
  )
}
