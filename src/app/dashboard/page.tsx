import { redirect } from 'next/navigation'
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
  searchParams?: { claim?: string; variant?: string }
}) {
  const user = await requireUser()
  if (!user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const closing = await getOrCreateClosingForUser(user.id)

  // If we arrived here from the post-share sign-up funnel, claim the invite
  // (anonymous when sent) onto this user + closing before reading state.
  const claimRefId = searchParams?.claim
  if (claimRefId) {
    const invite = await prisma.lenderRequest.findUnique({
      where: { refId: claimRefId },
      select: { id: true, userId: true },
    })
    if (invite && (!invite.userId || invite.userId === user.id)) {
      await prisma.lenderRequest.update({
        where: { id: invite.id },
        data: { userId: user.id, closingId: closing.id },
      })
    }
  }

  const latestInvite = await prisma.lenderRequest.findFirst({
    where: { userId: user.id },
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
      title: latestInvite || orderPlaced ? 'Invited your team' : 'Invite your lender or realtor',
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
