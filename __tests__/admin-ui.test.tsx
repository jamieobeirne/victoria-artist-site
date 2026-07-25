import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CharCounter } from '@/components/admin/CharCounter'
import { NewEntryForm } from '@/components/admin/NewEntryForm'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

describe('CharCounter', () => {
  it('shows the current length over the max', () => {
    render(<CharCounter value="hola" max={80} />)
    expect(screen.getByText('4/80')).toBeInTheDocument()
  })

  it('flags the over-limit state visually when value exceeds max', () => {
    render(<CharCounter value={'a'.repeat(81)} max={80} />)
    const counter = screen.getByText('81/80')
    expect(counter.className).toMatch(/over/)
  })

  it('does not flag the state when at the max', () => {
    render(<CharCounter value={'a'.repeat(80)} max={80} />)
    const counter = screen.getByText('80/80')
    expect(counter.className).not.toMatch(/over/)
  })
})

describe('NewEntryForm', () => {
  it('has no default category selected and submit disabled until one is chosen', () => {
    render(<NewEntryForm />)
    const select = screen.getByLabelText(/categor/i) as HTMLSelectElement
    expect(select.value).toBe('')
    const submit = screen.getByRole('button', { name: /guardar/i })
    expect(submit).toBeDisabled()
  })

  it('updates the title character counter as the admin types', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)
    const title = screen.getByLabelText(/t.tulo/i)
    await user.type(title, 'Serie nueva')
    expect(screen.getByText('11/80')).toBeInTheDocument()
  })

  it('keeps submit disabled with no images attached, even with valid text and category', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)
    await user.selectOptions(screen.getByLabelText(/categor/i), 'trabajo')
    await user.type(screen.getByLabelText(/t.tulo/i), 'Titulo valido')
    await user.type(screen.getByLabelText(/descripci.n/i), 'Descripcion valida de la obra.')
    const submit = screen.getByRole('button', { name: /guardar/i })
    expect(submit).toBeDisabled()
  })
})
