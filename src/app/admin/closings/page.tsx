import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, StatusPill } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminClosingsPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const admin = await requireAdmin()
  const sp = (await searchParams) || {}
  const filter = sp.status

  const closings = await prisma.closing.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { updatedAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  })

  const filters = [
    { key: undefined, label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'closed', label: 'Closed' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="closings" />

        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/admin/closings?status=${f.key}` : '/admin/closings'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                filter === f.key
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-5 py-2.5 font-bold">Borrower</th>
                  <th className="text-left px-5 py-2.5 font-bold">Property</th>
                  <th className="text-left px-5 py-2.5 font-bold">Type</th>
                  <th className="text-left px-5 py-2.5 font-bold">Status</th>
                  <th className="text-left px-5 py-2.5 font-bold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {closings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                      No closings match.
                    </td>
                  </tr>
                ) : (
                  closings.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link href={`/admin/closings/${c.id}`} className="font-semibold text-dark-900 hover:text-primary-600">
                          {c.user?.email || c.borrowerEmail || '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-700 truncate max-w-[280px]">
                        {c.propertyAddress || <span className="text-gray-400 italic">none yet</span>}
                        {c.propertyState ? ` · ${c.propertyState}` : ''}
                      </td>
                      <td className="px-5 py-3 text-gray-700 capitalize">{c.propertyType || '—'}</td>
                      <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(c.updatedAt).toLocaleDateString()}</td>
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
