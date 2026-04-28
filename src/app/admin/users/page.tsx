import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const admin = await requireAdmin()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      createdAt: true,
      _count: { select: { closings: true, lenderRequests: true } },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="users" />

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-dark-900">All users ({users.length})</h2>
            <span className="text-xs text-gray-500">Most recent first</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-5 py-2.5 font-bold">Email</th>
                  <th className="text-left px-5 py-2.5 font-bold">Name</th>
                  <th className="text-left px-5 py-2.5 font-bold">Phone</th>
                  <th className="text-left px-5 py-2.5 font-bold">Closings</th>
                  <th className="text-left px-5 py-2.5 font-bold">Invites</th>
                  <th className="text-left px-5 py-2.5 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link href={`/admin/users/${u.id}`} className="font-semibold text-dark-900 hover:text-primary-600">
                          {u.email}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{u.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-700">{u.phone || '—'}</td>
                      <td className="px-5 py-3 tabular-nums">{u._count.closings}</td>
                      <td className="px-5 py-3 tabular-nums">{u._count.lenderRequests}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}
