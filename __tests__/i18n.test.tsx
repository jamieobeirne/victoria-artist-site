import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '@/components/Sidebar'
import LangToggle from '@/components/LangToggle'
import { GalleryProvider } from '@/components/GalleryContext'
import { LangProvider } from '@/components/LangContext'
import StatementPage from '../app/(site)/statement/page'
import CvPage from '../app/(site)/cv/page'
import { dict, parseLang, type Lang } from '@/lib/i18n'

const refresh = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => '/home',
  useRouter: () => ({ push: jest.fn(), refresh }),
}))

function withLang(lang: Lang, node: React.ReactNode) {
  return render(
    <LangProvider lang={lang}>
      <GalleryProvider manifestError={false}>{node}</GalleryProvider>
    </LangProvider>,
  )
}

function clearCookie() {
  document.cookie = 'lang=; path=/; max-age=0'
}

describe('language', () => {
  beforeEach(() => {
    refresh.mockClear()
    clearCookie()
  })

  it('treats anything but "en" as Spanish', () => {
    expect(parseLang('en')).toBe('en')
    expect(parseLang('es')).toBe('es')
    expect(parseLang(undefined)).toBe('es')
    expect(parseLang('fr')).toBe('es')
  })

  it('has every string in both languages', () => {
    expect(Object.keys(dict.en).sort()).toEqual(Object.keys(dict.es).sort())
    for (const value of Object.values(dict.en)) expect(value).not.toBe('')
  })

  it('shows the menu in Spanish by default', () => {
    withLang('es', <Sidebar trabajo={[]} proyectos={[]} />)
    for (const label of ['Inicio', 'Trabajo', 'Proyectos', 'CV extendido']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('shows the menu in English', () => {
    withLang('en', <Sidebar trabajo={[]} proyectos={[]} />)
    for (const label of ['Home', 'Work', 'Projects', 'Full CV']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument()
  })

  it('puts the toggle in the sidebar with the current language pressed', () => {
    withLang('en', <Sidebar trabajo={[]} proyectos={[]} />)
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('sets no cookie until a language is chosen, then stores it and refreshes', async () => {
    withLang('es', <LangToggle />)
    expect(document.cookie).not.toContain('lang=')

    await userEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(document.cookie).toContain('lang=en')
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('does nothing when the current language is clicked again', async () => {
    withLang('es', <LangToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Español' }))
    expect(document.cookie).not.toContain('lang=')
    expect(refresh).not.toHaveBeenCalled()
  })

  it('renders the Statement in the chosen language', () => {
    const { unmount } = withLang('en', <StatementPage />)
    expect(screen.getByText('More than producing images, drawing opens a space.')).toBeInTheDocument()
    unmount()
    withLang('es', <StatementPage />)
    expect(screen.getByText('Más que producir imágenes, el dibujo abre un espacio.')).toBeInTheDocument()
  })

  it('translates the CV labels but keeps the entries in Spanish', () => {
    withLang('en', <CvPage />)
    expect(screen.getByText('group and solo exhibitions')).toBeInTheDocument()
    expect(screen.getAllByText(/Tu flora y mi fauna/, { selector: 'td' }).length).toBeGreaterThan(0)
    expect(screen.getByText('Entries are listed in their original Spanish.')).toBeInTheDocument()
  })
})
