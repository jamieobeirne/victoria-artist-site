import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'Privacidad — Victoria Ruiz Diaz' }

// Only <p> is styled inside .inner-body, so this page uses paragraphs and bold
// leads rather than headings or lists. Anything else would fall back to the
// browser's defaults and break the typography of the rest of the site.
export default function PrivacidadPage() {
  return (
    <InnerLayout>
      <section className="inner-stage" aria-label="Política de privacidad">
        <header className="inner-header">
          <h3 className="inner-heading">Política de privacidad</h3>
        </header>
        <div className="inner-body">
          <p>
            Esta web es el portafolio personal de Victoria Ruiz Diaz. Recoge la mínima información
            posible: no utiliza cookies de seguimiento, ni analítica, ni publicidad, ni contenido de
            terceros incrustado.
          </p>

          <p>
            <strong>Visitantes.</strong> Al navegar por esta web no se instala ninguna cookie en tu
            navegador ni se recoge ningún dato personal. No hay formularios, ni analítica, ni botones
            de redes sociales que informen a terceros de tu visita.
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

          <p>Última actualización: 19 de septiembre de 2026.</p>
        </div>
      </section>
    </InnerLayout>
  )
}
