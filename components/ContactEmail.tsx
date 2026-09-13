'use client'

import { useState } from 'react'

const ADDRESS = 'victoriard6@gmail.com'

/**
 * Shown in both Sidebar and HomeGallery, which duplicate each other's markup.
 * It lives here so the two cannot drift apart.
 *
 * The envelope is a button, not a mailto: link. A mailto: does nothing at all
 * on a machine with no mail handler registered — the browser flashes the target
 * and drops it — so the icon reveals the address instead, which is something
 * every visitor can act on. Once revealed it is also a mailto:, for anyone who
 * does have a client, and copyable for anyone who doesn't.
 *
 * The address is rendered only after the click, so it is absent from the served
 * HTML until then.
 */
export default function ContactEmail() {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused. The address is on screen either way,
      // so there is nothing to recover — just don't report a success.
    }
  }

  return (
    <div className="contact-email">
      <button
        type="button"
        className="contact-email-toggle"
        onClick={() => setRevealed(true)}
        aria-expanded={revealed}
        aria-label={revealed ? 'Dirección de correo' : 'Mostrar dirección de correo'}
        disabled={revealed}
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

      {revealed && (
        <>
          <a href={`mailto:${ADDRESS}`} className="contact-email-link">
            {ADDRESS}
          </a>
          <button type="button" className="contact-email-copy" onClick={copy} aria-live="polite">
            {copied ? 'copiado' : 'copiar'}
          </button>
        </>
      )}
    </div>
  )
}
