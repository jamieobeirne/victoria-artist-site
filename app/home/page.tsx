import { readManifest } from '@/lib/manifest'
import { HomeGallery } from '@/components/HomeGallery'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ abrir?: string | string[] }>
}) {
  const [manifest, { abrir }] = await Promise.all([readManifest(), searchParams])
  const initialOpen = abrir === 'trabajo' || abrir === 'proyectos' ? abrir : undefined
  return <HomeGallery trabajo={manifest.trabajo} proyectos={manifest.proyectos} initialOpen={initialOpen} />
}
