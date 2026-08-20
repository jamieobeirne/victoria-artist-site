import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Statement — Victoria Ruiz Diaz' }

export default function StatementPage() {
  return (
    <InnerLayout activePage="statement">
      <section className="inner-stage" aria-label="Statement">
        <header className="inner-header">
          <h3 className="inner-heading">Statement</h3>
        </header>
        <div className="inner-body">
          <p className="statement-lead">Dibujo para estar</p>
          <p>
            El dibujo es, para mí, una práctica de atención. Un lugar donde el tiempo deja de
            responder a la urgencia y la mirada encuentra la posibilidad de detenerse, permanecer y
            abrirse a otras formas de relación con lo visible.
          </p>
          <p>
            Trabajo con grafito, carbón y tinta. La austeridad de estos materiales acompaña un
            proceso lento, sostenido por la observación y la construcción paciente de cada imagen.
            Mi práctica dialoga con la historia natural y la ilustración científica, no desde su
            voluntad de describir o clasificar, sino desde la posibilidad de abrir otras formas de
            observar. Los paisajes, organismos y formas que aparecen en mis dibujos no buscan
            representar un mundo existente. Surgen de una práctica donde la observación y la
            imaginación dejan de entenderse como opuestas para convertirse en formas complementarias
            de aproximarse a lo visible.
          </p>
          <p>Más que producir imágenes, el dibujo abre un espacio.</p>
          <p>Un espacio para ser y permanecer.</p>
        </div>
      </section>
    </InnerLayout>
  )
}
