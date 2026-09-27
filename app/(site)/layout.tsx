import { readManifest } from '@/lib/manifest'
import type { Manifest } from '@/lib/schema'
import { GalleryProvider } from '@/components/GalleryContext'
import Sidebar from '@/components/Sidebar'

// Every public page with the menu lives under this layout. Next keeps a layout
// mounted while you navigate between the pages beneath it, so the sidebar is
// never torn down and rebuilt: its accordions keep their state and animate.
// The manifest is read here because the sidebar lists the entries. Dynamic, as
// /home was before, so a new upload shows on the next request.
export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let manifest: Manifest = { trabajo: [], proyectos: [] }
  let manifestError = false
  try {
    manifest = await readManifest()
  } catch (err) {
    // Read-only display path: an empty menu here writes nothing. Statement, Bio
    // and CV still render, and /home shows its retry message instead.
    console.error('Failed to read manifest for the sidebar', err)
    manifestError = true
  }

  return (
    <GalleryProvider manifestError={manifestError}>
      <main className="site-shell" data-state="content">
        <div className="content-layer">
          <div className="content-shell">
            <Sidebar trabajo={manifest.trabajo} proyectos={manifest.proyectos} />
            {children}
          </div>
        </div>
      </main>
    </GalleryProvider>
  )
}
