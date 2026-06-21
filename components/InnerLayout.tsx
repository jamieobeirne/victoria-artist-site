import Sidebar from './Sidebar'

type ActivePage = 'statement' | 'bio' | 'contacto' | 'trabajo' | 'proyectos'

interface InnerLayoutProps {
  activePage: ActivePage
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
