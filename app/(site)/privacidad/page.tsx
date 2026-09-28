import { L } from '@/components/LangContext'
import { getLang } from '@/lib/lang.server'

export async function generateMetadata() {
  const lang = await getLang()
  return { title: `${lang === 'en' ? 'Privacy' : 'Privacidad'} — Victoria Ruiz Diaz` }
}

// Only <p> is styled inside .inner-body, so this page uses paragraphs and bold
// leads rather than headings or lists. Anything else would fall back to the
// browser's defaults and break the typography of the rest of the site.
export default function PrivacidadPage() {
  return (
    <section className="inner-stage" aria-labelledby="privacy-heading">
      <header className="inner-header">
        <h3 className="inner-heading" id="privacy-heading">
          <L es="Política de privacidad" en="Privacy policy" />
        </h3>
      </header>
      <L
        es={
          <div className="inner-body">
            <p>
              Esta web es el portafolio personal de Victoria Ruiz Diaz. Recoge la mínima información
              posible: no utiliza cookies de seguimiento, ni analítica, ni publicidad, ni contenido de
              terceros incrustado.
            </p>

            <p>
              <strong>Visitantes.</strong> Al navegar por esta web no se recoge ningún dato personal. No
              hay formularios, ni analítica, ni botones de redes sociales que informen a terceros de tu
              visita.
            </p>

            <p>
              <strong>Cookie de idioma.</strong> La única cookie que puede instalarse al visitar la web es
              la de idioma, y solo si eliges uno con el selector ES / EN. Se llama «lang», guarda
              únicamente el idioma elegido y caduca al cabo de un año. Sirve para mostrarte la web en ese
              idioma y para nada más; no contiene datos personales y puedes borrarla desde tu navegador en
              cualquier momento.
            </p>

            <p>
              La dirección de correo que aparece al pulsar el icono del sobre se muestra únicamente en
              tu navegador. Mostrarla o copiarla no envía ninguna información a esta web.
            </p>

            <p>
              <strong>Registros técnicos.</strong> La web está alojada en Vercel y las imágenes se
              sirven a través de Cloudflare. Como cualquier servidor web, estos proveedores registran
              automáticamente datos técnicos de cada petición —dirección IP, fecha y hora, navegador y
              página solicitada— con el fin de prestar el servicio, garantizar su seguridad y detectar
              incidencias. Esos registros los gestionan dichos proveedores conforme a sus propias
              políticas de privacidad, disponibles en vercel.com/legal/privacy-policy y en
              cloudflare.com/privacypolicy.
            </p>

            <p>
              <strong>Área de administración.</strong> La web incluye un área privada desde la que
              Victoria publica su obra. El acceso se realiza mediante «Iniciar sesión con Google» y
              está restringido a una lista cerrada de direcciones autorizadas.
            </p>

            <p>
              Al iniciar sesión, Google comunica a esta web el nombre, la dirección de correo
              electrónico y la imagen de perfil de la cuenta, y si esa dirección ha sido verificada.
              Estos datos se utilizan exclusivamente para comprobar que la persona está autorizada a
              administrar el sitio. No se guardan en ninguna base de datos: se conservan en una cookie
              de sesión cifrada, en el navegador de quien administra la web, que caduca por sí sola.
              Esta web no solicita acceso al correo, los contactos, los archivos ni a ningún otro
              contenido de la cuenta de Google.
            </p>

            <p>
              <strong>Contenido publicado.</strong> Las imágenes y los textos del portafolio se
              almacenan en Cloudflare R2 y son públicos por su propia naturaleza: forman parte de la
              obra expuesta.
            </p>

            <p>
              <strong>Enlaces externos.</strong> El enlace a Instagram conduce a un sitio de terceros,
              con sus propias condiciones y su propia política de privacidad. Mientras no lo pulses, esta
              web no transmite ningún dato a ese servicio.
            </p>

            <p>
              <strong>Tus derechos.</strong> Esta web no conserva datos personales de sus visitantes,
              de modo que no hay nada que consultar, rectificar ni suprimir. Si aun así tienes alguna
              duda sobre el tratamiento de tus datos, puedes escribir a la dirección de contacto y se
              te responderá.
            </p>

            <p>
              <strong>Contacto.</strong> victoriard6@gmail.com
            </p>

            <p>Última actualización: 28 de septiembre de 2026.</p>
          </div>
        }
        en={
          <div className="inner-body" lang="en">
            <p>
              This website is the personal portfolio of Victoria Ruiz Diaz. It collects as little
              information as possible: it uses no tracking cookies, no analytics, no advertising and no
              embedded third-party content.
            </p>

            <p>
              <strong>Visitors.</strong> No personal data is collected while you browse this website.
              There are no forms, no analytics and no social media buttons that tell third parties about
              your visit.
            </p>

            <p>
              <strong>Language cookie.</strong> The only cookie this website can set for visitors is the
              language cookie, and only if you choose a language with the ES / EN selector. It is called
              “lang”, stores nothing but the language you chose, and expires after one year. It is used
              to show you the site in that language and for nothing else; it contains no personal data,
              and you can delete it from your browser at any time.
            </p>

            <p>
              The email address that appears when you press the envelope icon is shown only in your
              browser. Showing or copying it sends no information to this website.
            </p>

            <p>
              <strong>Technical logs.</strong> The website is hosted on Vercel and its images are served
              through Cloudflare. Like any web server, these providers automatically log technical data
              about each request (IP address, date and time, browser and page requested) in order to
              provide the service, keep it secure and detect problems. Those logs are managed by the
              providers under their own privacy policies, available at vercel.com/legal/privacy-policy
              and cloudflare.com/privacypolicy.
            </p>

            <p>
              <strong>Administration area.</strong> The website includes a private area from which
              Victoria publishes her work. Access is through “Sign in with Google” and is restricted to a
              closed list of authorised addresses.
            </p>

            <p>
              When someone signs in, Google gives this website the account’s name, email address and
              profile picture, and whether that address has been verified. This data is used only to
              check that the person is authorised to manage the site. It is not saved in any database: it
              is kept in an encrypted session cookie, in the administrator’s browser, which expires on its
              own. This website does not ask for access to the email, contacts, files or any other
              content of the Google account.
            </p>

            <p>
              <strong>Published content.</strong> The portfolio’s images and texts are stored in
              Cloudflare R2 and are public by nature: they are part of the work on show.
            </p>

            <p>
              <strong>External links.</strong> The Instagram link leads to a third-party website, with
              its own terms and its own privacy policy. Until you click it, this website sends no data to
              that service.
            </p>

            <p>
              <strong>Your rights.</strong> This website keeps no personal data about its visitors, so
              there is nothing to access, correct or delete. If you still have a question about how your
              data is handled, you can write to the contact address and you will receive a reply.
            </p>

            <p>
              <strong>Contact.</strong> victoriard6@gmail.com
            </p>

            <p>Last updated: 28 September 2026.</p>

            <p>This is a translation. If it differs from the Spanish version, the Spanish prevails.</p>
          </div>
        }
      />
    </section>
  )
}
