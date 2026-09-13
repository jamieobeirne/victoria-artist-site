'use client'

import ContactLinks from './ContactLinks'
import { useState } from 'react'
import Link from 'next/link'

interface SidebarProps {
  activePage?: 'statement' | 'bio' | 'cv' | 'trabajo' | 'proyectos'
}


export default function Sidebar({ activePage }: SidebarProps) {
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

        <Link href="/trabajo" className={activePage === 'trabajo' ? 'nav-active' : ''}>
          Trabajo
        </Link>

        <Link href="/proyectos" className={activePage === 'proyectos' ? 'nav-active' : ''}>
          Proyectos
        </Link>

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

        <ContactLinks />
      </nav>
    </aside>
  )
}
