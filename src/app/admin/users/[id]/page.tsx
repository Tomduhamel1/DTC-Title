import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, StatusPill } from '@/components/admin/AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      closings: { orderBy: { createdAt: 'desc' } },
      lenderRequests: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!user) notFound()

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <AdminHeader admin={admin} active="users" />

        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-4">
          ← All users
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-black text-dark-900">{user.email}</h2>
          <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm">
            <Field label="Name" value={user.name} />
            <Field label="Phone" value={user.phone} />
            <Field label="Joined" value={new Date(user.createdAt).toLocaleString()} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-dark-900">Closings ({user.closings.length})</h3>
          </div>
          {user.closings.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No closings yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {user.closings.map((c) => (
                <li key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <Link href={`/admin/closings/${c.id}`} className="font-semibold text-dark-900 hover:text-primary-600 truncate">
                    {c.propertyAddress || '(no address yet)'}
                    {c.propertyState ? ` · ${c.propertyState}` : ''}
                  </Link>
                  <StatusPill status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-dark-900">Lender invites sent ({user.lenderRequests.length})</h3>
          </div>
          {user.lenderRequests.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No invites yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {user.lenderRequests.map((r) => (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-dark-900">{r.channel}</span>
                    <span className="text-gray-500 ml-2">{r.source}</span>
                    {r.lenderEmail && <span className="text-gray-700 ml-2">→ {r.lenderEmail}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-dark-900 mt-0.5">{value || '—'}</div>
    </div>
  )
}
