export function isAllowedEmail(email: string | null | undefined, emailVerified: boolean | undefined): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length === 0) return false
  if (!email) return false
  if (emailVerified !== true) return false
  return adminEmails.includes(email.toLowerCase())
}
