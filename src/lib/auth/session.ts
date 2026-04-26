import { getServerSession } from 'next-auth'
import { authOptions } from './options'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireUser() {
  const session = await getSession()
  // @ts-expect-error — id is added in session callback
  if (!session?.user?.id) return null
  // @ts-expect-error
  return { id: session.user.id as string, email: session.user.email as string, name: session.user.name as string | null }
}
