import { signIn } from '@/lib/auth'

export const metadata = { title: 'Iniciar sesión — Victoria Ruiz Diaz' }

export default function SignInPage() {
  return (
    <main className="admin-signin">
      <h1>Panel de administración</h1>
      <p>Inicia sesión con la cuenta de Google de Victoria para continuar.</p>
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/admin' })
        }}
      >
        <button type="submit" className="form-submit">
          Iniciar sesión con Google
        </button>
      </form>
    </main>
  )
}
