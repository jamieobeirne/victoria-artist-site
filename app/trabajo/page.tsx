import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Trabajo — Victoria Ruiz Diaz' }

export default function TrabajoPage() {
  return (
    <InnerLayout activePage="trabajo">
      <section className="trabajo-stage" aria-label="Obra seleccionada" />
    </InnerLayout>
  )
}
