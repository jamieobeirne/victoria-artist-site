import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Contacto — Victoria Ruiz Diaz' }

export default function ContactoPage() {
  return (
    <InnerLayout activePage="contacto">
      <section className="inner-stage" aria-label="Contacto">
        <header className="inner-header">
          <h3 className="inner-heading">Contacto</h3>
        </header>
        <form className="contact-form" action="#" method="post">
          <div className="form-field">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" autoComplete="name" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" />
          </div>
          <div className="form-field">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows={6} />
          </div>
          <button type="submit" className="form-submit">Enviar</button>
        </form>
      </section>
    </InnerLayout>
  )
}
