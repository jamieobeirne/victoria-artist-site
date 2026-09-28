'use client'

import ContactLinks from './ContactLinks'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Entry } from '@/lib/schema'
import { useGallery } from './GalleryContext'
import { useLang } from './LangContext'
import LangToggle from './LangToggle'

// The top-level ("mother") items. Exactly one is bold at a time: the last one
// clicked. Its child (an entry, Bio or CV extendido) is bold only while that
// mother is the active one.
type Section = 'inicio' | 'trabajo' | 'proyectos' | 'statement' | 'cv'

// The one sidebar for every public page. It is rendered by app/(site)/layout.tsx,
// so it stays mounted across navigation; do not render it from a page.
export default function Sidebar({ trabajo, proyectos }: { trabajo: Entry[]; proyectos: Entry[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const { activeEntry, selectEntry, resetToDefault } = useGallery()
  const { t } = useLang()

  const onHome = pathname === '/home'
  const onCv = pathname === '/bio' || pathname === '/cv'

  function sectionForPath(path: string): Section {
    if (path === '/statement') return 'statement'
    if (path === '/bio' || path === '/cv') return 'cv'
    if (activeEntry) return trabajo.some(e => e.id === activeEntry.id) ? 'trabajo' : 'proyectos'
    return 'inicio'
  }

  const [section, setSection] = useState<Section>(() => sectionForPath(pathname))
  const [trabajoOpen, setTrabajoOpen] = useState(false)
  const [proyectosOpen, setProyectosOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(onCv)

  // Back/forward buttons change the page without a click here, so follow the
  // URL whenever it changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setSection(sectionForPath(pathname))
  }

  function showEntry(entry: Entry, category: Section) {
    setSection(category)
    selectEntry(entry)
    if (!onHome) router.push('/home')
  }

  function goHome() {
    setSection('inicio')
    resetToDefault()
  }

  function entryLinks(entries: Entry[], category: Section) {
    return entries.map(entry => (
      <a
        key={entry.id}
        href="/home"
        className={section === category && onHome && activeEntry?.id === entry.id ? 'sub-active' : ''}
        onClick={e => {
          e.preventDefault()
          showEntry(entry, category)
        }}
      >
        {entry.title || t.untitled}
      </a>
    ))
  }

  return (
    <aside className="content-sidebar" aria-label={t.mainMenu}>
      <div>
        <Link href="/home" className="inner-page-name" onClick={goHome}>
          <h2 className="sidebar-name">Victoria Ruiz Diaz</h2>
        </Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label={t.secondaryNav}>
        <Link href="/home" className={section === 'inicio' ? 'nav-active' : ''} onClick={goHome}>
          {t.home}
        </Link>

        <div className={`nav-accordion-item${trabajoOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${section === 'trabajo' ? ' nav-active' : ''}`}
            type="button"
            aria-expanded={trabajoOpen}
            onClick={() => {
              setSection('trabajo')
              setTrabajoOpen(o => !o)
            }}
          >
            {t.work}
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">{entryLinks(trabajo, 'trabajo')}</nav>
            </div>
          </div>
        </div>

        <div className={`nav-accordion-item${proyectosOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${section === 'proyectos' ? ' nav-active' : ''}`}
            type="button"
            aria-expanded={proyectosOpen}
            onClick={() => {
              setSection('proyectos')
              setProyectosOpen(o => !o)
            }}
          >
            {t.projects}
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">{entryLinks(proyectos, 'proyectos')}</nav>
            </div>
          </div>
        </div>

        <Link
          href="/statement"
          className={section === 'statement' ? 'nav-active' : ''}
          onClick={() => setSection('statement')}
        >
          {t.statement}
        </Link>

        <div className={`nav-accordion-item${cvOpen ? ' open' : ''}`}>
          <button
            className={`nav-toggle${section === 'cv' ? ' nav-active' : ''}`}
            type="button"
            aria-expanded={cvOpen}
            onClick={() => {
              setSection('cv')
              setCvOpen(o => !o)
            }}
          >
            {t.cv}
          </button>
          <div className="nav-accordion-body">
            <div className="accordion-inner">
              <nav className="sub-nav">
                <Link
                  href="/bio"
                  className={section === 'cv' && pathname === '/bio' ? 'sub-active' : ''}
                  onClick={() => setSection('cv')}
                >
                  {t.bio}
                </Link>
                <Link
                  href="/cv"
                  className={section === 'cv' && pathname === '/cv' ? 'sub-active' : ''}
                  onClick={() => setSection('cv')}
                >
                  {t.fullCv}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <ContactLinks />
        <LangToggle className="sidebar-lang" />
      </nav>
    </aside>
  )
}
