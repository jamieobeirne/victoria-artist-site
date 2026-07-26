'use client'

export default function HomeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="site-shell" data-state="content">
      <div className="content-layer">
        <div className="content-shell" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <p>No se pudo cargar la galeria en este momento.</p>
            <button type="button" className="form-submit" onClick={() => reset()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
