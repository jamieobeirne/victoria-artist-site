import { cookies } from 'next/headers'
import { LANG_COOKIE, parseLang, type Lang } from './i18n'

// Server-only: reading the cookie makes the page dynamic, which every public
// page already is (app/(site)/layout.tsx is force-dynamic).
export async function getLang(): Promise<Lang> {
  return parseLang((await cookies()).get(LANG_COOKIE)?.value)
}
