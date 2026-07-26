import type { NextAuthConfig } from 'next-auth'
import { isEmailAllowlisted } from './allowlist'

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
      // Re-checked on every request (not just at sign-in) so removing an email
      // from ADMIN_EMAILS takes effect immediately instead of waiting for the
      // admin's existing session/JWT to expire.
      return isEmailAllowlisted(auth?.user?.email)
    },
  },
} satisfies NextAuthConfig
