import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Bio — Victoria Ruiz Diaz' }

export default function BioPage() {
  return (
    <InnerLayout activePage="bio">
      <section className="inner-stage" aria-label="Bio">
        <header className="inner-header">
          <h3 className="inner-heading">Bio</h3>
        </header>
        <div className="inner-body bio-body">
          <figure className="bio-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bio.jpg"
              alt="Victoria Ruiz Diaz en su estudio, rodeada de sus dibujos"
              width={1000}
              height={1501}
              className="bio-photo"
            />
          </figure>
          <div className="bio-text">
              <p>
                Victoria Ruíz Díaz (1984, Argentina) es artista visual y tatuadora. Se formó en Artes
                Visuales, Gestión Cultural y Diseño de la Comunicación Visual en Paraná y Santa Fe. Desde
                2005 ha participado en exposiciones colectivas e individuales en diversas ciudades de
                Argentina y el exterior, recibiendo premios, becas y participando en residencias artísticas
                en Brasil, Miami y distintas provincias argentinas. Actualmente reside en Barcelona, donde
                continúa desarrollando su obra artística y del tatuaje.
              </p>
          </div>
        </div>
      </section>
    </InnerLayout>
  )
}
