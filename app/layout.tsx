import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Victoria Ruiz Diaz',
  description: 'Portafolio de Victoria Ruiz Diaz',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
