import Link from 'next/link'
import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import {
  MILESTONE_KINDS,
  MILESTONE_LABELS,
  type MilestoneKind,
} from '@/lib/closing'

// Broker pipeline view — read-only.
//
// Lists every Closing the current user is attached to with role='broker' via
// TeammateClosing. This includes:
//   1. Closings created by broker-quote conversion (PR 7), which inserts a
//      TeammateClosing(role='broker') for the converting broker.
//   2. TPS-ingested Closings where the order arrived with teammateRole='broker'
//      (the existing /api/orders/ingest path, PR 1).
//
// Scope is deliberately user-scoped (userId + role='broker'), NOT company-
// wide. Company-wide broker visibility is reserved for a future PR after
// broker-admin/team permissions are defined.

export const dynamic = 'force-dynamic'

type Status = 'active' | 'pending' | 'closed' | 'other'

export default async function TeammatePipelinePage() {
  const sessionUser = await requireUser()
  if (!sessionUser) {
    redirect('/login?callbackUrl=/teammate/pipeline')
  }

  const ctx = await requireBrokerMember()
  if (!ctx) {
    redirect('/teammate/dashboard')
  }

  const memberships = await prisma.teammateClosing.findMany({
    where: { userId: ctx.userId, role: 'broker' },
    include: {
      closing: {
        include: {
          milestones: { orderBy: { kind: 'asc' } },
          feeQuote: {
            select: {
              id: true,
              borrowerName: true,
              borrowerEmail: true,
            },
          },
        },
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
  })

  // Pre-bucket the rows by Closing.status so empty buckets can be hidden.
  // Status values come from the existing Closing model: 'pending' (default),
  // 'active' (set by /api/orders/ingest), 'closed' (set by milestone closed).
  // Any other value falls into 'other' as a forward-compat catch-all.
  const buckets: Record<Status, typeof memberships> = {
    active: [],
    pending: [],
    closed: [],
    other: [],
  }
  for (const m of memberships) {
    const s = m.closing.status as Status
    if (s === 'active' || s === 'pending' || s === 'closed') {
      buckets[s].push(m)
    } else {
      buckets.other.push(m)
    }
  }

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="pipeline" isBrokerMember={true} />

          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
              Broker Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark-900">Pipeline</h1>
            <div className="text-sm text-gray-500 mt-1">
              Closings where you&apos;re the placing broker, grouped by stage.
            </div>
          </div>

          {memberships.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              <Bucket title="Active" rows={buckets.active} accent="emerald" />
              <Bucket title="Pending" rows={buckets.pending} accent="amber" />
              <Bucket title="Closed" rows={buckets.closed} accent="gray" />
              <Bucket title="Other" rows={buckets.other} accent="gray" />
            </div>
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

// ─── Bucket ────────────────────────────────────────────────────────────────

function Bucket({
  title,
  rows,
  accent,
}: {
  title: string
  rows: Array<{
    id: string
    closing: {
      id: string
      status: string
      propertyAddress: string | null
      propertyCity: string | null
      propertyState: string | null
      propertyZip: string | null
      closingDate: Date | string | null
      borrowerEmail: string | null
      milestones: Array<{ kind: string; status: string }>
      feeQuote: {
        id: string
        borrowerName: string | null
        borrowerEmail: string | null
      } | null
    }
  }>
  accent: 'emerald' | 'amber' | 'gray'
}) {
  if (rows.length === 0) return null

  const badgeClass =
    accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-700'
      : accent === 'amber'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-gray-100 text-gray-700'

  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-600">
          {title}
        </h2>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${badgeClass}`}
        >
          {rows.length}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((m) => (
          <PipelineRow key={m.id} closing={m.closing} />
        ))}
      </div>
    </section>
  )
}

// ─── Row ───────────────────────────────────────────────────────────────────

function PipelineRow({
  closing,
}: {
  closing: {
    id: string
    status: string
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
    closingDate: Date | string | null
    borrowerEmail: string | null
    milestones: Array<{ kind: string; status: string }>
    feeQuote: {
      id: string
      borrowerName: string | null
      borrowerEmail: string | null
    } | null
  }
}) {
  const fullAddress =
    [
      closing.propertyAddress,
      closing.propertyCity,
      closing.propertyState,
      closing.propertyZip,
    ]
      .filter(Boolean)
      .join(', ') || 'Property TBD'

  const doneCount = closing.milestones.filter((m) => m.status === 'done').length
  const totalCount = MILESTONE_KINDS.length
  const activeMilestone = closing.milestones.find((m) => m.status === 'active')
  const stageLabel = activeMilestone
    ? MILESTONE_LABELS[activeMilestone.kind as MilestoneKind] ||
      activeMilestone.kind
    : closing.status === 'closed'
    ? 'Closed'
    : doneCount === 0
    ? 'Awaiting order'
    : doneCount === totalCount
    ? 'Closed'
    : 'In progress'

  const closingDateLabel = closing.closingDate
    ? new Date(closing.closingDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const borrowerLabel =
    closing.feeQuote?.borrowerName ||
    closing.feeQuote?.borrowerEmail ||
    closing.borrowerEmail ||
    '(no borrower yet)'

  const progressPct = Math.round((doneCount / totalCount) * 100)

  return (
    <Link
      href={`/teammate/dashboard/${closing.id}`}
      className="block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow p-5"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Broker
            </span>
            <StatusPill status={closing.status} />
            {closing.feeQuote && (
              <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                From quote
              </span>
            )}
          </div>
          <div className="font-bold text-dark-900 truncate">{borrowerLabel}</div>
          <div className="text-sm text-gray-600 truncate">{fullAddress}</div>
        </div>

        <div className="text-right text-xs text-gray-500 whitespace-nowrap">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Closes
          </div>
          <div className="text-gray-700">{closingDateLabel || 'TBD'}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <div className="text-xs font-semibold text-dark-900">{stageLabel}</div>
          <div className="text-[10px] font-bold tabular-nums text-gray-500">
            {doneCount} of {totalCount} done
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full transition-[width] ${
              closing.status === 'closed' ? 'bg-emerald-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {closing.feeQuote && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
          Source quote{' '}
          <span className="font-mono text-gray-700">
            {closing.feeQuote.id.slice(0, 8)}…
          </span>
        </div>
      )}
    </Link>
  )
}

// ─── Bits ──────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const palette: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    active: 'bg-blue-100 text-blue-800',
    closed: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        palette[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-2a4 4 0 014-4h4m-4 4l4-4-4-4m0 8h-7a4 4 0 01-4-4V5"
          />
        </svg>
      </div>
      <h2 className="text-xl font-black text-dark-900 mb-2">
        Your pipeline will appear here
      </h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
        When you convert a quote into a closing — or when a TPS-ingested order
        attributes you as the broker — it&apos;ll show up here, grouped by
        stage.
      </p>
      <p className="text-xs text-gray-500 mt-4">
        In the meantime, every file you&apos;re named on (lender, realtor, or
        broker) is visible under{' '}
        <Link href="/teammate/dashboard" className="underline text-emerald-700">
          Files
        </Link>
        .
      </p>
    </div>
  )
}
