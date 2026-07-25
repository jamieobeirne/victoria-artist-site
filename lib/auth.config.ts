import type { NextAuthConfig } from 'next-auth'

const ADMIN_PATH_PREFIXES = ['/admin', '/api/admin']

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = ADMIN_PATH_PREFIXES.some(prefix =>
        request.nextUrl.pathname.startsWith(prefix)
      )
      if (!isAdminRoute) return true
      return !!auth?.user
    },
  },
} satisfies NextAuthConfig
