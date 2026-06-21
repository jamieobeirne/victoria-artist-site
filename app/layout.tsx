import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Victoria Ruiz Diaz',
  description: 'Portafolio de Victoria Ruiz Diaz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
