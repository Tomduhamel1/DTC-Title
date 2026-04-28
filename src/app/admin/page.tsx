import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, Stat, StatusPill } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminLandingPage() {
  const admin = await requireAdmin()

  const [userCount, closingCount, activeCount, closedCount, leadCount, notifCount, latestUsers, latestClosings, latestNotifs] = await Promise.all([
    prisma.user.count(),
    prisma.closing.count(),
    prisma.closing.count({ where: { status: 'active' } }),
    prisma.closing.count({ where: { status: 'closed' } }),
    prisma.lead.count(),
    prisma.notificationLog.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, email: true, createdAt: true },
    }),
    prisma.closing.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { user: { select: { email: true } } },
    }),
    prisma.notificationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, kind: true, recipient: true, status: true, createdAt: true },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="overview" />

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <Stat label="Users" value={userCount} />
          <Stat label="Closings" value={closingCount} />
          <Stat label="Active" value={activeCount} accent="emerald" />
          <Stat label="Closed" value={closedCount} accent="emerald" />
          <Stat label="Notifications" value={notifCount} />
          <Stat label="Legacy leads" value={leadCount} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Panel title="Newest users" href="/admin/users">
            {latestUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No users yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {latestUsers.map((u) => (
                  <li key={u.id} className="py-2.5 flex items-center justify-between">
                    <Link href={`/admin/users/${u.id}`} className="text-sm font-semibold text-dark-900 hover:text-primary-600">
                      {u.email}
                    </Link>
                    <span className="text-xs text-gray-500">{formatDate(u.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Recently updated closings" href="/admin/closings">
            {latestClosings.length === 0 ? (
              <p className="text-sm text-gray-500">No closings yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {latestClosings.map((c) => (
                  <li key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                    <Link href={`/admin/closings/${c.id}`} className="text-sm font-semibold text-dark-900 hover:text-primary-600 truncate">
                      {c.user?.email || '—'}{c.propertyAddress ? ` · ${c.propertyAddress}` : ''}
                    </Link>
                    <StatusPill status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Recent notifications" href="/admin/notifications">
          {latestNotifs.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications sent yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {latestNotifs.map((n) => (
                <li key={n.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
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
                    <span className="text-gray-700 truncate">{n.recipient}</span>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-dark-900">{title}</h2>
        {href && <Link href={href} className="text-xs text-primary-700 font-semibold hover:underline">View all →</Link>}
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  )
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}
