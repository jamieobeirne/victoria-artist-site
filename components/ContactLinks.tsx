'use client'

import { useEffect, useState } from 'react'

const ADDRESS = 'victoriard6@gmail.com'
const HIDE_AFTER_MS = 10000

/**
 * Owns the whole contact block — both icons and the reveal — because Sidebar
 * and HomeGallery duplicate each other's markup and have drifted apart once
 * already. One copy here means they cannot.
 *
 * The envelope is a button, not a mailto: link. A mailto: does nothing at all
 * on a machine with no mail handler registered — the browser flashes the target
 * and drops it — so the icon reveals the address instead. Once revealed it is
 * also a mailto:, for anyone who does have a client, and copyable for anyone
 * who doesn't. It is rendered only after the click, so it is absent from the
 * served HTML until a visitor asks for it.
 */
export default function ContactLinks() {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  // Bumped on copy so the auto-hide timer restarts rather than pulling the
  // address away from someone who is still using it.
  const [keepAlive, setKeepAlive] = useState(0)

  useEffect(() => {
    if (!revealed) return
    const timer = window.setTimeout(() => {
      setRevealed(false)
      setCopied(false)
    }, HIDE_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [revealed, keepAlive])

  async function copy() {
    setKeepAlive(n => n + 1)
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
    } catch {
      // Clipboard access can be refused. The address is on screen either way,
      // so there is nothing to recover — just don't report a success.
    }
  }

  return (
    <div className="sidebar-contact">
      <div className="sidebar-social" aria-label="Redes sociales">
        <button
          type="button"
          className="social-icon contact-toggle"
          onClick={() => setRevealed(v => !v)}
          aria-expanded={revealed}
          aria-label={revealed ? 'Ocultar dirección de correo' : 'Mostrar dirección de correo'}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
          </svg>
        </button>

        <a
          href="https://www.instagram.com/victoria_r_d_"
          aria-label="Instagram"
          className="social-icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>

      {revealed && (
        <div className="contact-email">
          <a href={`mailto:${ADDRESS}`} className="contact-email-link">
            {ADDRESS}
          </a>
          <button type="button" className="contact-email-copy" onClick={copy} aria-live="polite">
            {copied ? 'copiado' : 'copiar'}
          </button>
        </div>
      )}
    </div>
  )
}
