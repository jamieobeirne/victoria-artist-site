import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/signin')

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <span>Panel de Victoria</span>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}
        >
          <button type="submit" className="admin-signout">
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  )
}
