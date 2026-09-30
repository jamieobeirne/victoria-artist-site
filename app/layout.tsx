import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Victoria Ruiz Diaz',
  description: 'Portafolio de Victoria Ruiz Diaz',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  },
}

// Only the artist's name uses Roboto: Bold on the gateway, Light in the sidebar.
// next/font self-hosts the files at build time, so no request goes to Google.
const roboto = Roboto({ weight: ['300', '700'], subsets: ['latin'], display: 'swap', variable: '--font-roboto' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.variable}>
      <body>{children}</body>
    </html>
  )
}
