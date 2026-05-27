import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, StatusPill } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminClosingsPage({ searchParams }: { searchParams?: Promise<{ status?: string; q?: string }> }) {
  const admin = await requireAdmin()
  const sp = (await searchParams) || {}
  const filter = sp.status
  const q = sp.q?.trim() || ''

  // Compose status + free-text with AND. Free-text q searches borrower and
  // property fields (OR) plus an exact Closing id match so an id pasted from
  // a URL/log jumps straight to its row. Blank q is ignored.
  const where = {
    AND: [
      filter ? { status: filter } : {},
      q
        ? {
            OR: [
              { borrowerEmail: { contains: q, mode: 'insensitive' as const } },
              { borrowerPhone: { contains: q } },
              { propertyAddress: { contains: q, mode: 'insensitive' as const } },
              { propertyCity: { contains: q, mode: 'insensitive' as const } },
              { propertyZip: { contains: q } },
              { id: q },
            ],
          }
        : {},
    ],
  }

  const closings = await prisma.closing.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  })

  const filters = [
    { key: undefined, label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'closed', label: 'Closed' },
  ]

  // Build a status-pill href that preserves the current q.
  const statusHref = (key?: string) => {
    const params = new URLSearchParams()
    if (key) params.set('status', key)
    if (q) params.set('q', q)
    const qs = params.toString()
    return qs ? `/admin/closings?${qs}` : '/admin/closings'
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="closings" />

        <form method="get" className="flex flex-wrap items-center gap-2 mb-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search borrower, property, or closing id…"
            className="flex-1 min-w-[220px] px-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          {/* Preserve the active status facet across a text search. */}
          {filter && <input type="hidden" name="status" value={filter} />}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            Search
          </button>
          {(q || filter) && (
            <Link
              href="/admin/closings"
              className="px-3 py-2 text-sm font-semibold text-gray-500 hover:text-dark-900"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={statusHref(f.key)}
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
