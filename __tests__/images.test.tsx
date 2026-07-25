import { render, screen } from '@testing-library/react'
import GatewayPage from '../app/page'
import HomePage from '../app/home/page'
import { readManifest } from '@/lib/manifest'

jest.mock('@/lib/manifest', () => ({ readManifest: jest.fn(), writeManifest: jest.fn() }))

describe('image placement', () => {
  beforeEach(() => {
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
    render(await HomePage())
    const img = screen.getByAltText('Obra destacada')
    expect(img).toHaveAttribute('src', '/images/home.jpg')
  })

  it('a newly created entry from the manifest appears in the home page nav', async () => {
    ;(readManifest as jest.Mock).mockResolvedValue({
      trabajo: [
        {
          id: 'e1',
          title: 'Serie recien creada',
          description: 'Descripcion.',
          images: [{ id: 'i1', url: '/images/landingImage_page-0044.jpg', caption: 'Uno' }],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      proyectos: [],
    })
    render(await HomePage())
    expect(screen.getByText('Serie recien creada')).toBeInTheDocument()
  })
})
