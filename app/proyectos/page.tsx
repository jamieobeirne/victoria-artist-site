import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Proyectos — Victoria Ruiz Diaz' }

export default function ProyectosPage() {
  return (
    <InnerLayout activePage="proyectos">
      <section className="trabajo-stage" aria-label="Proyecto seleccionado" />
    </InnerLayout>
  )
}
