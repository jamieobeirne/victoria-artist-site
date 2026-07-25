import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { authConfig } from './auth.config'
import { isAllowedEmail } from './allowlist'

export { isAllowedEmail }

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Google],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ profile }) {
      return isAllowedEmail(profile?.email, profile?.email_verified as boolean | undefined)
    },
  },
})
