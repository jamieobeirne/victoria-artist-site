'use client'

import ContactLinks from './ContactLinks'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Entry } from '@/lib/schema'
import { useGallery } from './GalleryContext'

const UNTITLED = 'Sin título'

// The one sidebar for every public page. It is rendered by app/(site)/layout.tsx,
// so it stays mounted across navigation; do not render it from a page.
export default function Sidebar({ trabajo, proyectos }: { trabajo: Entry[]; proyectos: Entry[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const { activeEntry, selectEntry, resetToDefault } = useGallery()

  const onHome = pathname === '/home'
  const onCv = pathname === '/bio' || pathname === '/cv'

  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(onCv)

  function showEntry(entry: Entry) {
    selectEntry(entry)
    if (!onHome) router.push('/home')
  }

  function entryLinks(entries: Entry[]) {
    return entries.map(entry => (
      <a
        key={entry.id}
        href="/home"
        className={onHome && activeEntry?.id === entry.id ? 'sub-active' : ''}
        onClick={e => {
          e.preventDefault()
          showEntry(entry)
        }}
      >
        {entry.title || UNTITLED}
      </a>
    ))
  }

  return (
    <aside className="content-sidebar" aria-label="Menu principal">
      <div>
        <Link href="/home" className="inner-page-name" onClick={resetToDefault}>
          <h2 className="sidebar-name">Victoria Ruiz Diaz</h2>
        </Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Navegacion secundaria">
        <Link href="/home" className={onHome ? 'nav-active' : ''} onClick={resetToDefault}>
          Inicio
        </Link>

        <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
          <button className="nav-toggle" type="button" aria-expanded={trabajoOpen} onClick={() => setTrabajoOpen(o => !o)}>
            Trabajo
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">{entryLinks(trabajo)}</nav>
            </div>
          </div>
        </div>

        <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={proyectosOpen}
            onClick={() => setProyectosOpen(o => !o)}
          >
            Proyectos
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">{entryLinks(proyectos)}</nav>
            </div>
          </div>
        </div>

        <Link href="/statement" className={pathname === '/statement' ? 'nav-active' : ''}>
          Statement
        </Link>

        <div className={`nav-accordion-item${cvOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${onCv ? ' nav-active' : ''}`}
            type="button"
            aria-expanded={cvOpen}
            onClick={() => setCvOpen(o => !o)}
          >
            CV
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">
                <Link href="/bio" className={pathname === '/bio' ? 'sub-active' : ''}>
                  Bio
                </Link>
                <Link href="/cv" className={pathname === '/cv' ? 'sub-active' : ''}>
                  CV extendido
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <ContactLinks />
      </nav>
    </aside>
  )
}
