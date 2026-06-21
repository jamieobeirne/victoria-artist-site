import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Trabajo — Victoria Ruiz Diaz' }

export default function TrabajoPage() {
  return (
    <InnerLayout activePage="trabajo">
      <section className="trabajo-stage" aria-label="Obra seleccionada">
        <div className="artwork-display">
          <img src="/images/landingImage_page-0043.jpg" alt="Obra seleccionada" />
          <div className="artwork-info">
            <span className="artwork-title">Lorem ipsum</span>
            <span className="artwork-meta">Lorem ipsum</span>
          </div>
        </div>
      </section>
    </InnerLayout>
  )
}
