import Link from 'next/link'
import LangToggle from '@/components/LangToggle'
import { L } from '@/components/LangContext'

export default function GatewayPage() {
  return (
    <main className="site-shell" data-state="gateway">
      <section className="gateway" aria-labelledby="gateway-title">
        <picture>
          <source media="(orientation: portrait)" srcSet="/images/portrait.jpg" />
          <source media="(orientation: landscape)" srcSet="/images/landscape.jpg" />
          <img
            className="gateway-image"
            src="/images/landscape.jpg"
            alt="Intro artwork"
          />
        </picture>
        <div className="gateway-overlay">
          <div className="gateway-topbar">
            <div className="title-band">
              <h1 id="gateway-title">Victoria Ruiz Diaz</h1>
            </div>
            <div className="gateway-actions">
              <Link href="/home" className="enter-btn">
                <L es="Entrar" en="Enter" />
              </Link>
              <LangToggle className="gateway-lang" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
