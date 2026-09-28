import { L } from '@/components/LangContext'

export const metadata = { title: 'Statement — Victoria Ruiz Diaz' }

// The English is a translation of Victoria's own words. She approves any change
// to it, as to the Spanish.
export default function StatementPage() {
  return (
    <section className="inner-stage" aria-label="Statement">
      <header className="inner-header">
        <h3 className="inner-heading">Statement</h3>
      </header>
      <L
        es={
          <div className="inner-body">
            <p>
              Dibujo para estar. El dibujo es, para mí, una práctica de atención. Un lugar donde el tiempo deja de
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
        }
        en={
          <div className="inner-body" lang="en">
            <p>
              I draw in order to be present. For me, drawing is a practice of attention: a place where
              time stops answering to urgency, and the gaze finds the chance to pause, to stay, and to
              open onto other ways of relating to the visible.
            </p>
            <p>
              I work with graphite, charcoal and ink. The austerity of these materials suits a slow
              process, sustained by observation and the patient making of each image. My practice is in
              dialogue with natural history and scientific illustration, not with their urge to describe
              or classify, but with their power to open up other ways of looking. The landscapes,
              organisms and forms in my drawings do not set out to represent an existing world. They
              arise from a practice in which observation and imagination are no longer seen as opposites,
              and become complementary ways of approaching the visible.
            </p>
            <p>More than producing images, drawing opens a space.</p>
            <p>A space to be, and to remain.</p>
          </div>
        }
      />
    </section>
  )
}
