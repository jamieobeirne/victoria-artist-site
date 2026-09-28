'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LANG_COOKIE, type Lang } from '@/lib/i18n'
import { useLang } from './LangContext'

const ONE_YEAR = 60 * 60 * 24 * 365

// ES / EN, the active one in bold, like the active menu link. Nothing is stored
// until a visitor clicks: the cookie is the only one the public site sets, and
// the Privacidad page says so.
export default function LangToggle({ className = '' }: { className?: string }) {
  const router = useRouter()
  const { lang, t } = useLang()
  const [pending, startTransition] = useTransition()

  function choose(next: Lang) {
    if (next === lang || pending) return
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
    // A refresh re-renders the server side in the new language while the
    // sidebar keeps its state: open accordions and the selected work stay put.
    startTransition(() => router.refresh())
  }

  return (
    <div className={`lang-toggle ${className}`.trim()} role="group" aria-label={t.language}>
      <button
        type="button"
        lang="es"
        aria-label="Español"
        aria-pressed={lang === 'es'}
        className={lang === 'es' ? 'lang-active' : ''}
        onClick={() => choose('es')}
      >
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={lang === 'en'}
        className={lang === 'en' ? 'lang-active' : ''}
        onClick={() => choose('en')}
      >
        EN
      </button>
    </div>
  )
}
