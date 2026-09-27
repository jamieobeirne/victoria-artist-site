'use client'

import { createContext, useContext, useState } from 'react'
import type { Entry } from '@/lib/schema'

interface GalleryState {
  activeEntry: Entry | null
  activeImageIndex: number
  manifestError: boolean
  selectEntry: (entry: Entry) => void
  setActiveImageIndex: (index: number) => void
  resetToDefault: () => void
}

const GalleryContext = createContext<GalleryState | null>(null)

// Shared between the sidebar (which picks an entry) and the /home stage (which
// shows it). Lives in the (site) layout, so the selection survives a visit to
// Statement or CV and back.
export function GalleryProvider({ manifestError, children }: { manifestError: boolean; children: React.ReactNode }) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  function selectEntry(entry: Entry) {
    setActiveEntry(entry)
    setActiveImageIndex(0)
  }

  function resetToDefault() {
    setActiveEntry(null)
    setActiveImageIndex(0)
  }

  return (
    <GalleryContext.Provider
      value={{ activeEntry, activeImageIndex, manifestError, selectEntry, setActiveImageIndex, resetToDefault }}
    >
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery(): GalleryState {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGallery must be used inside GalleryProvider')
  return ctx
}
