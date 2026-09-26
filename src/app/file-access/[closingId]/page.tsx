import { notFound, redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { fileDestination, validFileId } from '@/lib/auth/fileAccess'
import FileAccessCard from './FileAccessCard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'View your file · BetterClose', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }

export default async function FileAccessPage({ params }: { params: Promise<{ closingId: string }> }) {
  const { closingId } = await params
  if (!validFileId(closingId)) notFound()
  const user = await requireUser()
  if (user && await prisma.teammateClosing.findFirst({ where: { closingId, userId: user.id }, select: { id: true } })) {
    redirect(fileDestination(closingId))
  }
  // No address, file number, recipient identity or existence disclosure to an
  // anonymous/different account. GET does not look up or consume the email key.
  return <FileAccessCard closingId={closingId} signedIn={Boolean(user)} />
}
