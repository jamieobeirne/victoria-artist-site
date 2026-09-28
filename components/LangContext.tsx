'use client'

import { createContext, useContext, useEffect } from 'react'
import { dict, type Lang } from '@/lib/i18n'

// Spanish when there is no provider, so components rendered on their own (in
// tests, for example) keep the site's default language.
const LangContext = createContext<Lang>('es')

// Rendered once, by app/layout.tsx, with the language read from the cookie on
// the server. Changing language refreshes the route, which re-renders the
// layout and hands this provider the new value.
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  // The server sets <html lang> on a full load; this keeps it right after a
  // switch without a reload.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang() {
  const lang = useContext(LangContext)
  return { lang, t: dict[lang] }
}

// Picks one of two versions of a piece of content. For the longer texts (Bio,
// Statement, Privacidad) that live in their page rather than in lib/i18n.ts.
export function L({ es, en }: { es: React.ReactNode; en: React.ReactNode }) {
  return <>{useContext(LangContext) === 'en' ? en : es}</>
}
