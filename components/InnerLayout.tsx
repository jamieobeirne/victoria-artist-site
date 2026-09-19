import Sidebar from './Sidebar'

type ActivePage = 'statement' | 'bio' | 'cv' | 'trabajo' | 'proyectos'

interface InnerLayoutProps {
  // Optional: /privacidad is a real page but not a menu item, so nothing in
  // the sidebar should be marked active while it is open.
  activePage?: ActivePage
  children: React.ReactNode
}

export default function InnerLayout({ activePage, children }: InnerLayoutProps) {
  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell">
          <Sidebar activePage={activePage} />
          {children}
        </div>
      </div>
    </main>
  )
}
