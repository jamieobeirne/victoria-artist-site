import { render, screen } from '@testing-library/react'
import GatewayPage from '../app/page'
import HomePage from '../app/home/page'

describe('image placement', () => {
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

  it('home page default image is home.jpg when no artwork is selected', () => {
    render(<HomePage />)
    const img = screen.getByAltText('Obra destacada')
    expect(img).toHaveAttribute('src', '/images/home.jpg')
  })
})
