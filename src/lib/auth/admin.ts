import { redirect } from 'next/navigation'
import { getSession } from './session'

// Comma-separated allowlist of admin email addresses, set in the runtime env.
// Pre-launch this is the simplest auth model that works; promote to a `role`
// column on User when we need finer-grained permissions.
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return adminEmails().includes(email.toLowerCase())
}

/**
 * Server helper for admin pages. Redirects to /login if the visitor isn't
 * signed in, or to / if they're signed in but not an admin. Returns the
 * admin's email/id when allowed.
 */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const session = await getSession()
  // session.user.id is added in the NextAuth callbacks — cast through unknown
  // because the default Session typing doesn't know about it.
  const sessionUser = (session?.user as unknown as { id?: string; email?: string }) || {}
  const id = sessionUser.id
  const email = sessionUser.email

  if (!id || !email) {
    redirect('/login?callbackUrl=/admin')
  }
  if (!isAdminEmail(email)) {
    redirect('/')
  }

  return { id, email }
}
