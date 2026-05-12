import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader } from '@/components/admin/AdminChrome'
import BrokerCompanyCreateForm from '@/components/admin/BrokerCompanyCreateForm'

export const dynamic = 'force-dynamic'

export default async function AdminBrokerCompaniesPage() {
  const admin = await requireAdmin()

  const companies = await prisma.brokerCompany.findMany({
    orderBy: [{ verifiedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { members: true, feeQuotes: true } },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <AdminHeader admin={admin} active="broker-companies" />

        <BrokerCompanyCreateForm />

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-dark-900">
              All broker companies ({companies.length})
            </h3>
          </div>
          {companies.length === 0 ? (
            <p className="px-5 py-12 text-sm text-gray-400 text-center">
              No broker companies yet. Use the form above to create the first one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="text-left px-5 py-2.5 font-bold">Name</th>
                    <th className="text-left px-5 py-2.5 font-bold">Slug</th>
                    <th className="text-left px-5 py-2.5 font-bold">Verified</th>
                    <th className="text-left px-5 py-2.5 font-bold">Members</th>
                    <th className="text-left px-5 py-2.5 font-bold">Quotes</th>
                    <th className="text-left px-5 py-2.5 font-bold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/broker-companies/${c.id}`}
                          className="font-semibold text-dark-900 hover:text-primary-600"
                        >
                          {c.name}
                        </Link>
                        {c.primaryDomain && (
                          <div className="text-xs text-gray-500">{c.primaryDomain}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">{c.slug}</td>
                      <td className="px-5 py-3">
                        {c.verifiedAt ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                            unverified
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-700 tabular-nums">{c._count.members}</td>
                      <td className="px-5 py-3 text-gray-700 tabular-nums">{c._count.feeQuotes}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
