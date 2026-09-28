import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/components/LangContext'
import { dict } from '@/lib/i18n'
import { getLang } from '@/lib/lang.server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Victoria Ruiz Diaz',
    description: dict[await getLang()].siteDescription,
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
    },
  }
}

// Only the artist's name uses Roboto: Bold on the gateway, Light in the sidebar.
// next/font self-hosts the files at build time, so no request goes to Google.
const roboto = Roboto({ weight: ['300', '700'], subsets: ['latin'], display: 'swap', variable: '--font-roboto' })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang()
  return (
    <html lang={lang} className={roboto.variable}>
      <body>
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  )
}
