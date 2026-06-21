import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Proyectos — Victoria Ruiz Diaz' }

export default function ProyectosPage() {
  return (
    <InnerLayout activePage="proyectos">
      <section className="trabajo-stage" aria-label="Proyecto seleccionado">
        <div className="artwork-display">
          <img src="/images/landingImage_page-0034.jpg" alt="Proyecto seleccionado" />
          <div className="artwork-info">
            <span className="artwork-title">Lorem ipsum</span>
            <span className="artwork-meta">Lorem ipsum</span>
          </div>
        </div>
      </section>
    </InnerLayout>
  )
}
