import { render, screen, within } from '@testing-library/react'
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

  it('on an inner page, Work opens its submenu in place instead of navigating', async () => {
    await renderAt('/statement', <StatementPage />)
    const toggle = screen.getByRole('button', { name: 'Work' })
    expect(toggle.parentElement).not.toHaveClass('open')
    await userEvent.click(toggle)
    expect(toggle.parentElement).toHaveClass('open')
    expect(screen.getByRole('button', { name: 'Projects' }).parentElement).not.toHaveClass('open')
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

  it('the menu labels are English and there is no language toggle', async () => {
    await renderAt('/statement', <StatementPage />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /english|español/i })).not.toBeInTheDocument()
  })
})

describe('English text under the Spanish', () => {
  beforeEach(() => push.mockClear())

  it('shows the English title and description under the Spanish when written', async () => {
    const bilingual = { ...entry, titleEn: 'Newly made series', descriptionEn: 'Description.' }
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [bilingual], proyectos: [] })
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    expect(screen.getByText('Newly made series')).toHaveAttribute('lang', 'en')
    expect(screen.getByText('Description.')).toHaveAttribute('lang', 'en')
    expect(screen.getByText('Descripcion.')).toBeInTheDocument()
  })

  it('a Spanish-only entry shows no English line', async () => {
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [entry], proyectos: [] })
    const { container } = await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    expect(container.querySelector('.artwork-en')).toBeNull()
  })

  it('an English-only title does not also show "Sin título"', async () => {
    const englishOnly = { ...entry, title: '', titleEn: 'Only English' }
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [englishOnly], proyectos: [] })
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Sin título'))
    expect(screen.getByText('Only English', { selector: '.artwork-en' })).toBeInTheDocument()
    expect(screen.queryByText('Sin título', { selector: '.artwork-title' })).not.toBeInTheDocument()
  })
})

describe('enlarging the featured image', () => {
  beforeEach(() => {
    push.mockClear()
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [entry], proyectos: [] })
  })

  it('the default home image cannot be enlarged', async () => {
    await renderAt('/home', <HomePage />)
    expect(screen.queryByRole('button', { name: 'Ampliar imagen' })).not.toBeInTheDocument()
  })

  it('clicking an entry image enlarges it, and a click anywhere returns it to normal', async () => {
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    await userEvent.click(screen.getByRole('button', { name: 'Ampliar imagen' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByAltText('Serie recien creada')).toHaveAttribute('src', entry.images[0].url)
    await userEvent.click(dialog)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Escape returns the enlarged image to normal', async () => {
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByText('Serie recien creada'))
    await userEvent.click(screen.getByRole('button', { name: 'Ampliar imagen' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('active link is bold, one mother at a time', () => {
  beforeEach(() => {
    push.mockClear()
    ;(readManifest as jest.Mock).mockResolvedValue({ trabajo: [entry], proyectos: [] })
  })

  it('on /statement, Statement is the active mother', async () => {
    await renderAt('/statement', <StatementPage />)
    expect(screen.getByRole('link', { name: 'Statement' })).toHaveClass('nav-active')
    expect(document.querySelectorAll('.nav-active')).toHaveLength(1)
  })

  it('clicking another mother moves the bold to it', async () => {
    await renderAt('/statement', <StatementPage />)
    await userEvent.click(screen.getByRole('button', { name: 'Work' }))
    expect(screen.getByRole('button', { name: 'Work' })).toHaveClass('nav-active')
    expect(screen.getByRole('link', { name: 'Statement' })).not.toHaveClass('nav-active')
    expect(document.querySelectorAll('.nav-active')).toHaveLength(1)
  })

  it('choosing a child bolds it with its mother, and another mother clears both', async () => {
    await renderAt('/home', <HomePage />)
    await userEvent.click(screen.getByRole('button', { name: 'Work' }))
    await userEvent.click(screen.getByText('Serie recien creada'))
    expect(screen.getByRole('link', { name: 'Serie recien creada' })).toHaveClass('sub-active')
    expect(screen.getByRole('button', { name: 'Work' })).toHaveClass('nav-active')
    await userEvent.click(screen.getByRole('button', { name: 'Projects' }))
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveClass('nav-active')
    expect(screen.getByRole('button', { name: 'Work' })).not.toHaveClass('nav-active')
    expect(screen.getByRole('link', { name: 'Serie recien creada' })).not.toHaveClass('sub-active')
  })
})
