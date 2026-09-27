import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GatewayPage from '../app/page'
import SiteLayout from '../app/(site)/layout'
import HomePage from '../app/(site)/home/page'
import StatementPage from '../app/(site)/statement/page'
import { readManifest } from '@/lib/manifest'
import { usePathname } from 'next/navigation'

jest.mock('@/lib/manifest', () => ({ readManifest: jest.fn(), writeManifest: jest.fn() }))

const push = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push, refresh: jest.fn() }),
}))

const entry = {
  id: 'e1',
  title: 'Serie recien creada',
  description: 'Descripcion.',
  images: [{ id: 'i1', url: '/images/landingImage_page-0044.jpg', caption: '' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

async function renderAt(pathname: string, page: React.ReactNode) {
  ;(usePathname as jest.Mock).mockReturnValue(pathname)
  return render(await SiteLayout({ children: page }))
}

describe('image placement', () => {
  beforeEach(() => {
    push.mockClear()
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [], proyectos: [] })
  })

  it('gateway portrait source points to portrait.jpg', () => {
    const { container } = render(<GatewayPage />)
    const source = container.querySelector('source[media="(orientation: portrait)"]')
    expect(source).toHaveAttribute('srcset', '/images/portrait.jpg')
  })

  it('gateway landscape source points to landscape.jpg', () => {
    const { container } = render(<GatewayPage />)
    const source = container.querySelector('source[media="(orientation: landscape)"]')
    expect(source).toHaveAttribute('srcset', '/images/landscape.jpg')
  })

  it('home page default image is home.jpg when no artwork is selected', async () => {
    await renderAt('/home', <HomePage />)
    const img = screen.getByAltText('Obra destacada')
    expect(img).toHaveAttribute('src', '/images/home.jpg')
  })

  it('a newly created entry from the manifest appears in the sidebar', async () => {
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [entry], proyectos: [] })
    await renderAt('/home', <HomePage />)
    expect(screen.getByText('Serie recien creada')).toBeInTheDocument()
  })
})

describe('shared sidebar', () => {
  beforeEach(() => {
    push.mockClear()
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [entry], proyectos: [] })
  })

  it('on an inner page, Trabajo opens its submenu in place instead of navigating', async () => {
    await renderAt('/statement', <StatementPage />)
    const toggle = screen.getByRole('button', { name: 'Trabajo' })
    expect(toggle.parentElement).not.toHaveClass('open')
    await userEvent.click(toggle)
    expect(toggle.parentElement).toHaveClass('open')
    expect(screen.getByRole('button', { name: 'Proyectos' }).parentElement).not.toHaveClass('open')
    expect(push).not.toHaveBeenCalled()
  })

  it('choosing an entry from an inner page goes to /home', async () => {
    await renderAt('/statement', <StatementPage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    expect(push).toHaveBeenCalledWith('/home')
  })

  it('choosing an entry on /home shows it on the stage without navigating', async () => {
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    expect(screen.getByAltText('Serie recien creada')).toHaveAttribute('src', entry.images[0].url)
    expect(push).not.toHaveBeenCalled()
  })

  it('a manifest read failure keeps the menu and shows the retry message on /home', async () => {
    ;(readManifest as jest.Mock).mockRejectedValue(new Error('R2 down'))
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await renderAt('/home', <HomePage />)
    expect(screen.getByRole('link', { name: 'Statement' })).toBeInTheDocument()
    expect(screen.getByText('No se pudo cargar la galeria en este momento.')).toBeInTheDocument()
  })
})
