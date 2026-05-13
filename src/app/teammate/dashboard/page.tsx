import { redirect } from 'next/navigation'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { claimTeammateClosingsForUser } from '@/lib/teammate/match'
import {
  MILESTONE_KINDS,
  MILESTONE_LABELS,
  type MilestoneKind,
} from '@/lib/closing'
import { getProfessionalContext } from '@/lib/professional'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import RoleSelfIdentifyBanner from '@/components/teammate/RoleSelfIdentifyBanner'
import MuteToggle from './MuteToggle'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams?: { claim?: string }
}

export default async function TeammateDashboardPage({ searchParams }: PageProps) {
  const user = await requireUser()
  if (!user) {
    redirect('/login?callbackUrl=/teammate/dashboard')
  }

  // If we arrived from a /for-my-team -> sign-up funnel, retroactively bind
  // the LenderRequest to this user (mirrors borrower-side claim in
  // src/app/dashboard/page.tsx). Idempotent.
  const claimRefId = searchParams?.claim
  if (claimRefId) {
    try {
      const invite = await prisma.lenderRequest.findUnique({
        where: { refId: claimRefId },
        select: { id: true, closingId: true, lenderEmail: true },
      })
      if (invite) {
        // Also create / update the TeammateClosing row for this invite if
        // we have a closing on it.
        if (invite.closingId && invite.lenderEmail) {
          // Role is set to 'unknown' here on purpose. The borrower's invite
          // flow is role-agnostic — they invite "their closing team", not a
          // specifically-classified professional. The signed-in professional
          // self-identifies their role from /teammate/dashboard's banner
          // (see RoleSelfIdentifyBanner + RoleSelfIdentifyPicker). On the
          // update path we deliberately don't touch role: a TPS-ingested
          // role or a previously self-identified role wins.
          await prisma.teammateClosing.upsert({
            where: {
              matchedEmail_closingId: {
                matchedEmail: invite.lenderEmail.toLowerCase(),
                closingId: invite.closingId,
              },
            },
            create: {
              userId: user.id,
              closingId: invite.closingId,
              matchedEmail: invite.lenderEmail.toLowerCase(),
              role: 'unknown',
            },
            update: { userId: user.id },
          })
        }
      }
    } catch {
      /* swallow — claim is best-effort */
    }
  }

  // Make sure any orphan rows that match this email get claimed every page
  // load — cheap UPDATE, idempotent.
  await claimTeammateClosingsForUser(user.id, user.email)

  // Resolve professional/broker context once so the tab bar can render
  // broker-only tabs when appropriate. Read-only, no side-effects.
  const professional = await getProfessionalContext(user.id)
  const isBrokerMember = professional?.isBrokerMember ?? false

  const memberships = await prisma.teammateClosing.findMany({
    where: { userId: user.id },
    include: {
      closing: {
        include: {
          milestones: true,
        },
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
  })

  // Build the input for the self-identify banner: every TeammateClosing on
  // this user whose role is still 'unknown'. Borrower-led claims write
  // role='unknown' (the role is genuinely unknown until the professional
  // tells us). The banner only renders when rows.length > 0; user picks a
  // concrete role to clear each row from the banner.
  const unknownRows = memberships
    .filter((m) => m.role === 'unknown')
    .map((m) => {
      const c = m.closing
      const fullAddress =
        [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip]
          .filter(Boolean)
          .join(', ') || null
      return {
        membershipId: m.id,
        closingId: c.id,
        propertyAddress: fullAddress,
        borrowerLabel: c.borrowerEmail ?? null,
      }
    })

  // Sort: active first (anything not closed), then by closing date asc, then
  // pending. Done last.
  const sorted = memberships.slice().sort((a, b) => {
    const aDone = a.closing.status === 'closed' ? 1 : 0
    const bDone = b.closing.status === 'closed' ? 1 : 0
    if (aDone !== bDone) return aDone - bDone
    const aDate = a.closing.closingDate ? new Date(a.closing.closingDate).getTime() : Infinity
    const bDate = b.closing.closingDate ? new Date(b.closing.closingDate).getTime() : Infinity
    return aDate - bDate
  })

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="files" isBrokerMember={isBrokerMember} />
          <div className="mb-8 flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
                Team Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-dark-900">
                Your BetterClose files
              </h1>
              <div className="text-sm text-gray-500 mt-1">
                Every closing where you&apos;re named as lender, broker, or realtor.
              </div>
            </div>
          </div>

          <RoleSelfIdentifyBanner
            rows={unknownRows}
            hasBrokerMembership={isBrokerMember}
          />

          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {sorted.map((m) => (
                <FileRow key={m.id} membership={m} />
              ))}
            </div>
          )}

          <div className="text-center text-xs text-gray-400 pt-8">
            Don&apos;t see a file you expected? Email{' '}
            <a href="mailto:teammates@betterclose.co" className="underline">
              teammates@betterclose.co
            </a>{' '}
            and we&apos;ll get it linked.
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-black text-dark-900 mb-2">No active BetterClose files yet</h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
        Once your first order opens with us, it&apos;ll appear here automatically — we
        match files to your account by your work email. If you expected to see something,
        email{' '}
        <a href="mailto:teammates@betterclose.co" className="text-emerald-700 font-semibold underline">
          teammates@betterclose.co
        </a>
        .
      </p>
    </div>
  )
}

interface MembershipRow {
  id: string
  muted: boolean
  role: string
  closing: {
    id: string
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
    closingDate: Date | string | null
    borrowerEmail: string | null
    status: string
    milestones: { kind: string; status: string }[]
  }
}

function FileRow({ membership }: { membership: MembershipRow }) {
  const c = membership.closing
  const fullAddress = [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip]
    .filter(Boolean)
    .join(', ') || 'Property TBD'

  const doneCount = c.milestones.filter((m) => m.status === 'done').length
  const totalCount = MILESTONE_KINDS.length
  const activeMilestone = c.milestones.find((m) => m.status === 'active')
  const currentLabel = activeMilestone
    ? MILESTONE_LABELS[activeMilestone.kind as MilestoneKind] || activeMilestone.kind
    : c.status === 'closed'
    ? 'Closed'
    : doneCount === 0
    ? 'Awaiting order'
    : `${doneCount} of ${totalCount} done`

  const closingDate = c.closingDate
    ? new Date(c.closingDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD'

  const roleLabel =
    membership.role === 'lender'
      ? 'Lender'
      : membership.role === 'realtor'
      ? 'Real estate agent'
      : membership.role === 'broker'
      ? 'Broker'
      : 'Teammate'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              {roleLabel}
            </span>
            {c.status === 'closed' && (
              <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Closed
              </span>
            )}
          </div>
          <Link
            href={`/teammate/dashboard/${c.id}`}
            className="text-base font-bold text-dark-900 hover:text-emerald-700 transition-colors"
          >
            {fullAddress}
          </Link>
          <div className="text-xs text-gray-500 mt-0.5">
            {c.borrowerEmail || 'Borrower TBD'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</div>
          <div className="text-sm font-bold text-dark-900">{currentLabel}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Target close: {closingDate}</div>
        </div>

        <div className="flex items-center gap-3">
          <MuteToggle membershipId={membership.id} initialMuted={membership.muted} />
          <Link
            href={`/teammate/dashboard/${c.id}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}
