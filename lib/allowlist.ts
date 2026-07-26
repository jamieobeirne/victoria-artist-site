function currentAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

/** Re-checkable on every request: is this email currently in ADMIN_EMAILS? Used to close the gap where a revoked admin's still-valid session would otherwise keep working until it expires. */
export function isEmailAllowlisted(email: string | null | undefined): boolean {
  const adminEmails = currentAdminEmails()
  if (adminEmails.length === 0) return false
  if (!email) return false
  return adminEmails.includes(email.toLowerCase())
}

export function isAllowedEmail(email: string | null | undefined, emailVerified: boolean | undefined): boolean {
  if (emailVerified !== true) return false
  return isEmailAllowlisted(email)
}
