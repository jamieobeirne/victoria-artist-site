import Link from 'next/link'

export default function GatewayPage() {
  return (
    <main className="site-shell" data-state="gateway">
      <section className="gateway" aria-labelledby="gateway-title">
        <img
          className="gateway-image"
          src="/images/landingImage_page-0033.jpg"
          alt="Pencil drawing used as the landing gateway artwork"
        />
        <div className="gateway-overlay">
          <div className="gateway-topbar">
            <div className="title-band">
              <h1 id="gateway-title">Victoria Ruiz Diaz</h1>
            </div>
            <Link href="/home" className="enter-btn">Entrar</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
