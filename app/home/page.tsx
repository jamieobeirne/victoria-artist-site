import { readManifest } from '@/lib/manifest'
import { HomeGallery } from '@/components/HomeGallery'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const manifest = await readManifest()
  return <HomeGallery trabajo={manifest.trabajo} proyectos={manifest.proyectos} />
}
