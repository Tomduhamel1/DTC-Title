import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, StatusPill } from '@/components/admin/AdminChrome'
import ClosingEditor from '@/components/admin/ClosingEditor'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'

export const dynamic = 'force-dynamic'

export default async function AdminClosingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  const { id } = await params

  const closing = await prisma.closing.findUnique({
    where: { id },
    include: {
      milestones: { orderBy: { kind: 'asc' } },
      user: { select: { email: true, name: true, id: true } },
      lenderRequests: { orderBy: { createdAt: 'desc' }, take: 5 },
      notifications: { orderBy: { createdAt: 'desc' }, take: 25 },
    },
  })
  if (!closing) notFound()

  const editorClosing = {
    ...closing,
    milestones: closing.milestones.map((m) => ({
      id: m.id,
      kind: m.kind,
      status: m.status,
      completedAt: m.completedAt ? m.completedAt.toISOString() : null,
      notifiedAt: m.notifiedAt ? m.notifiedAt.toISOString() : null,
    })),
    closingDate: closing.closingDate ? closing.closingDate.toISOString() : null,
  }

  const snapshot = closing.snapshotFeeReport as FeeReport | null
  const totals = snapshot ? computeTotals(snapshot) : null

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <AdminHeader admin={admin} active="closings" />

        <Link href="/admin/closings" className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-4">
          ← All closings
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-black text-dark-900">
                {closing.propertyAddress || '(no address yet)'}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                {closing.user ? (
                  <Link href={`/admin/users/${closing.user.id}`} className="hover:text-primary-600 font-semibold">
                    {closing.user.email}
                  </Link>
                ) : (
                  <span className="italic">No linked user</span>
                )}
                {closing.propertyState ? <span> · {closing.propertyState}</span> : null}
              </div>
            </div>
            <StatusPill status={closing.status} />
          </div>
          {closing.closedAt && (
            <div className="mt-3 text-xs text-emerald-700 font-semibold">
              ✓ Closed {new Date(closing.closedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {snapshot && totals && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Fee report snapshot (frozen at closing)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
              <Stat label="They paid" value={formatCurrency(totals.ourTotal)} />
              <Stat label="Typical low" value={formatCurrency(totals.marketLow)} />
              <Stat label="Typical high" value={formatCurrency(totals.marketHigh)} />
              <Stat label="Closing savings (avg)" value={formatCurrency(Math.round((totals.estimatedSavingsLow + totals.estimatedSavingsHigh) / 2))} accent="emerald" />
              <Stat label="Lifetime savings (avg)" value={formatCurrency(Math.round((totals.lifetimeSavingsLow + totals.lifetimeSavingsHigh) / 2))} accent="emerald" />
              <Stat label="Line items" value={String(snapshot.lineItems.length)} />
              <Stat label="Generated at" value={new Date(snapshot.generatedAt).toLocaleString()} />
            </div>
          </div>
        )}

        <ClosingEditor closing={editorClosing} />

        <div className="bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-baseline justify-between">
            <h3 className="text-sm font-bold text-dark-900">
              Notifications ({closing.notifications.length})
            </h3>
            <span className="text-xs text-gray-500">Most recent first</span>
          </div>
          {closing.notifications.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">
              No notifications sent for this closing yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {closing.notifications.map((n) => (
                <li key={n.id} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            n.status === 'sent'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.status === 'skipped'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {n.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{n.kind}</span>
                      </div>
                      <div className="text-sm font-semibold text-dark-900 truncate">{n.subject}</div>
                      <div className="text-xs text-gray-500">
                        to <strong className="text-gray-700">{n.recipient}</strong>
                        {n.providerMessageId && (
                          <span className="ml-2 font-mono text-[10px]">id: {n.providerMessageId.slice(0, 24)}…</span>
                        )}
                      </div>
                      {n.error && (
                        <div className="text-xs text-red-700 mt-1 font-mono">{n.error}</div>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {closing.lenderRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-dark-900">Recent invites</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {closing.lenderRequests.map((r) => (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold text-dark-900">{r.channel}</span>
                    <span className="text-gray-500 ml-2">{r.source}</span>
                    {r.lenderEmail && <span className="text-gray-700 ml-2">→ {r.lenderEmail}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'emerald' }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`text-base font-bold tabular-nums ${accent === 'emerald' ? 'text-emerald-700' : 'text-dark-900'}`}>{value}</div>
    </div>
  )
}
