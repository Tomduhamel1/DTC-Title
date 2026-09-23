import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { requireUser } from '@/lib/auth/session'
import { getOrCreateClosingForUser } from '@/lib/closing'
import { prisma } from '@/lib/db'
import DashboardHome from '@/components/dashboard/DashboardHome'
import DashboardHomeUnified from '@/components/dashboard/DashboardHomeUnified'
import OnboardingForm from '@/components/dashboard/OnboardingForm'
import type { AccountStep } from '@/components/dashboard/AccountSection'

export const dynamic = 'force-dynamic'

const CHANNEL_LABEL: Record<string, string> = {
  sms: 'text message',
  mailto: 'email',
  we_email: 'email',
  copy_link: 'a copied link',
  native_share: 'a share',
}

function formatSentDetail(invite: { createdAt: Date; channel: string; lenderEmail: string | null }) {
  const date = new Date(invite.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const via = CHANNEL_LABEL[invite.channel] || 'share'
  const recipient = invite.lenderEmail ? ` to ${invite.lenderEmail}` : ' to your team'
  return `Sent ${date} via ${via}${recipient}.`
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { claim?: string; variant?: string; closingId?: string | string[] }
}) {
  const requestedClosingId = searchParams?.closingId
  if (requestedClosingId !== undefined &&
      (typeof requestedClosingId !== 'string' || !requestedClosingId.trim())) notFound()

  const user = await requireUser()
  if (!user) {
    const query = new URLSearchParams()
    if (typeof requestedClosingId === 'string') query.set('closingId', requestedClosingId)
    if (typeof searchParams?.claim === 'string') query.set('claim', searchParams.claim)
    if (searchParams?.variant === 'unified') query.set('variant', 'unified')
    const callbackUrl = '/dashboard' + (query.size ? `?${query}` : '')
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  // Persona routing: a broker/agent/lender who lands here (nav button, bare
  // /login) belongs on the teammate dashboard — and must NOT get a spurious
  // stub borrower Closing created for them. Borrowers with an owned closing
  // are unaffected even if they also appear as a teammate elsewhere.
  const [ownedClosing, brokerMembership, teammateCount] = await Promise.all([
    prisma.closing.findFirst({ where: { userId: user.id }, select: { id: true } }),
    prisma.brokerMembership.findFirst({ where: { userId: user.id }, select: { id: true } }),
    prisma.teammateClosing.count({ where: { userId: user.id } }),
  ])
  const isProfessional = !!brokerMembership || teammateCount > 0
  if (requestedClosingId === undefined && !ownedClosing && isProfessional) {
    redirect('/teammate/dashboard')
  }

  // A link selects a file; it never grants access or falls back to another file.
  const closing = typeof requestedClosingId === 'string'
    ? await prisma.closing.findFirst({
      where: { id: requestedClosingId, userId: user.id },
      include: { milestones: true },
    })
    : await getOrCreateClosingForUser(user.id)
  if (!closing) notFound()

  const ownedClosings = await prisma.closing.findMany({
    where: { userId: user.id },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: { id: true, propertyAddress: true, gardenFileNumber: true, status: true },
  })

  // If we arrived here from the post-share sign-up funnel, claim the invite
  // (anonymous when sent) onto this user + closing before reading state.
  const claimRefId = searchParams?.claim
  if (typeof claimRefId === 'string' && claimRefId) {
    // Do not move an invitation from another file when switching dashboards.
    await prisma.lenderRequest.updateMany({
      where: { refId: claimRefId, AND: [
        { OR: [{ userId: null }, { userId: user.id }] },
        { OR: [{ closingId: null }, { closingId: closing.id }] },
      ] },
      data: { userId: user.id, closingId: closing.id },
    })
  }

  const latestInvite = await prisma.lenderRequest.findFirst({
    where: { userId: user.id, closingId: closing.id },
    orderBy: { createdAt: 'desc' },
  })

  const orderPlaced = closing.status !== 'pending'

  const accountSteps: AccountStep[] = [
    {
      key: 'account',
      status: 'done',
      title: 'Account created',
      detail: `Signed in as ${user.email}.`,
    },
    {
      key: 'invite',
      status: latestInvite || orderPlaced ? 'done' : 'active',
      title: latestInvite || orderPlaced ? 'Invited your team' : 'Invite your closing team',
      detail: latestInvite
        ? formatSentDetail(latestInvite)
        : orderPlaced
        ? 'Order matched to your account.'
        : "Tell your team you'd like to use BetterClose for this closing.",
      completedAt: latestInvite?.createdAt ?? null,
    },
    {
      key: 'order',
      status: orderPlaced ? 'done' : latestInvite ? 'active' : 'pending',
      title: orderPlaced ? 'Order received' : 'Team places the order',
      detail: orderPlaced
        ? 'Order received from your team.'
        : latestInvite
        ? "Waiting for your team to place the order. We'll email you when it lands."
        : "Once your team places the order, you'll see it here.",
      completedAt: orderPlaced ? closing.updatedAt : null,
    },
  ]

  const needsOnboarding = !closing.propertyAddress && !latestInvite && !orderPlaced

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-700">Your borrower dashboard</p>
            {isProfessional && (
              <Link href="/teammate/dashboard" className="text-sm font-semibold text-emerald-700 underline">
                View your professional closings
              </Link>
            )}
          </div>
          {ownedClosings.length > 1 && (
            <form action="/dashboard" method="get" className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
              <label htmlFor="borrower-closing" className="mb-2 block text-sm font-semibold text-gray-700">Your closing</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select id="borrower-closing" name="closingId" defaultValue={closing.id}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                  {ownedClosings.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.propertyAddress || 'Closing without property address'}
                      {item.gardenFileNumber ? ` — File ${item.gardenFileNumber}` : ''}
                      {item.status === 'closed' ? ' (Completed)' : ''}
                    </option>
                  ))}
                </select>
                {searchParams?.variant === 'unified' && <input type="hidden" name="variant" value="unified" />}
                <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">View closing</button>
              </div>
            </form>
          )}
          {needsOnboarding ? (
            <OnboardingForm closingId={closing.id} userName={user.name} userEmail={user.email} />
          ) : searchParams?.variant === 'unified' ? (
            <DashboardHomeUnified
              closing={closing}
              userName={user.name}
              userEmail={user.email}
              accountSteps={accountSteps}
            />
          ) : (
            <DashboardHome
              closing={closing}
              userName={user.name}
              userEmail={user.email}
              accountSteps={accountSteps}
            />
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
