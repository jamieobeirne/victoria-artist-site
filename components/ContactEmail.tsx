'use client'

import { useState } from 'react'

const ADDRESS = 'victoriard6@gmail.com'

/**
 * Shown in both Sidebar and HomeGallery, which duplicate each other's markup.
 * It lives here so the two cannot drift apart.
 *
 * The address is visible rather than hidden behind an icon: a mailto: link
 * does nothing at all on a machine with no mail handler registered, and it
 * never reveals the address, so an icon on its own can leave a visitor with
 * no way to make contact. The copy button guarantees the click always does
 * something, whatever the visitor's setup.
 */
export default function ContactEmail() {
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
      <a href={`mailto:${ADDRESS}`} className="contact-email-link">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 6l10 7 10-7" />
        </svg>
        <span>{ADDRESS}</span>
      </a>
      <button type="button" className="contact-email-copy" onClick={copy} aria-live="polite">
        {copied ? 'copiado' : 'copiar'}
      </button>
    </div>
  )
}
