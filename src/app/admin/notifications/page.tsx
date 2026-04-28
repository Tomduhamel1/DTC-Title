import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; kind?: string }>
}) {
  const admin = await requireAdmin()
  const sp = (await searchParams) || {}
  const filterStatus = sp.status
  const filterKind = sp.kind

  const where: Record<string, unknown> = {}
  if (filterStatus) where.status = filterStatus
  if (filterKind) where.kind = { startsWith: filterKind }

  const [notifications, statusCounts, kindCounts] = await Promise.all([
    prisma.notificationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        user: { select: { email: true } },
        closing: { select: { id: true, propertyAddress: true, propertyState: true } },
      },
    }),
    prisma.notificationLog.groupBy({ by: ['status'], _count: true }),
    prisma.notificationLog.groupBy({ by: ['kind'], _count: true, orderBy: { _count: { kind: 'desc' } } }),
  ])

  const statusFilters = [
    { key: undefined, label: 'All', count: statusCounts.reduce((a, b) => a + b._count, 0) },
    { key: 'sent', label: 'Sent', count: statusCounts.find((s) => s.status === 'sent')?._count || 0 },
    { key: 'skipped', label: 'Skipped (dry-run)', count: statusCounts.find((s) => s.status === 'skipped')?._count || 0 },
    { key: 'failed', label: 'Failed', count: statusCounts.find((s) => s.status === 'failed')?._count || 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="notifications" />

        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-black text-dark-900">Notifications log</h2>
          <span className="text-xs text-gray-500">
            Showing {notifications.length} most recent
            {filterStatus ? ` · status=${filterStatus}` : ''}
            {filterKind ? ` · kind starts with "${filterKind}"` : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {statusFilters.map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/admin/notifications?status=${f.key}${filterKind ? `&kind=${filterKind}` : ''}` : `/admin/notifications${filterKind ? `?kind=${filterKind}` : ''}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                filterStatus === f.key
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label} <span className="opacity-60">({f.count})</span>
            </Link>
          ))}
          {kindCounts.length > 0 && (
            <span className="ml-3 text-xs text-gray-400">·</span>
          )}
          {kindCounts.slice(0, 6).map((k) => {
            const root = k.kind.split(':')[0]
            const isActive = filterKind === root
            return (
              <Link
                key={k.kind}
                href={isActive ? `/admin/notifications${filterStatus ? `?status=${filterStatus}` : ''}` : `/admin/notifications?kind=${root}${filterStatus ? `&status=${filterStatus}` : ''}`}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-full border ${
                  isActive
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {k.kind}
              </Link>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {notifications.length === 0 ? (
            <p className="px-5 py-12 text-sm text-gray-400 text-center">
              No notifications match this filter.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li key={n.id} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
                        {n.closing && (
                          <Link
                            href={`/admin/closings/${n.closing.id}`}
                            className="text-[11px] text-primary-700 hover:underline truncate max-w-xs"
                          >
                            {n.closing.propertyAddress || '(closing)'}
                            {n.closing.propertyState ? ` · ${n.closing.propertyState}` : ''}
                          </Link>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-dark-900 truncate">{n.subject}</div>
                      <div className="text-xs text-gray-500">
                        to <strong className="text-gray-700">{n.recipient}</strong>
                        {n.user?.email && n.user.email !== n.recipient && (
                          <span> · user: {n.user.email}</span>
                        )}
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
      </div>
    </div>
  )
}
