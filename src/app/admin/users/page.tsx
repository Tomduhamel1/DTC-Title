import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

// Static account-type facets. These are the known TeammateClosing/account
// roles; an unexpected value in the DB simply won't have a pill (harmless).
const ACCOUNT_TYPES = ['borrower', 'lender', 'broker', 'realtor'] as const

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; accountType?: string }>
}) {
  const admin = await requireAdmin()
  const sp = (await searchParams) || {}
  const q = sp.q?.trim() || ''
  const accountType = sp.accountType?.trim() || ''

  // Compose facets with AND; free-text q searches email/name/phone (OR).
  // Blank q is ignored. email/name use case-insensitive contains; phone is
  // matched as-typed (digits).
  const where = {
    AND: [
      accountType ? { accountType } : {},
      q
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' as const } },
              { name: { contains: q, mode: 'insensitive' as const } },
              { phone: { contains: q } },
            ],
          }
        : {},
    ],
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      accountType: true,
      createdAt: true,
      _count: { select: { closings: true, lenderRequests: true } },
    },
  })

  // Build an account-type pill href that preserves the current q.
  const typeHref = (type?: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (type) params.set('accountType', type)
    const qs = params.toString()
    return qs ? `/admin/users?${qs}` : '/admin/users'
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader admin={admin} active="users" />

        <form method="get" className="flex flex-wrap items-center gap-2 mb-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search email, name, or phone…"
            className="flex-1 min-w-[220px] px-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          {/* Preserve the active accountType facet across a text search. */}
          {accountType && <input type="hidden" name="accountType" value={accountType} />}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            Search
          </button>
          {(q || accountType) && (
            <Link
              href="/admin/users"
              className="px-3 py-2 text-sm font-semibold text-gray-500 hover:text-dark-900"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={typeHref(undefined)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
              !accountType
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            All types
          </Link>
          {ACCOUNT_TYPES.map((type) => (
            <Link
              key={type}
              href={typeHref(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border capitalize ${
                accountType === type
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {type}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-dark-900">
              {q || accountType ? `Matching users (${users.length})` : `All users (${users.length})`}
            </h2>
            <span className="text-xs text-gray-500">Most recent first</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-5 py-2.5 font-bold">Email</th>
                  <th className="text-left px-5 py-2.5 font-bold">Name</th>
                  <th className="text-left px-5 py-2.5 font-bold">Type</th>
                  <th className="text-left px-5 py-2.5 font-bold">Phone</th>
                  <th className="text-left px-5 py-2.5 font-bold">Closings</th>
                  <th className="text-left px-5 py-2.5 font-bold">Invites</th>
                  <th className="text-left px-5 py-2.5 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                      {q || accountType ? 'No users match.' : 'No users yet.'}
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
                      <td className="px-5 py-3 text-gray-700 capitalize">{u.accountType}</td>
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
