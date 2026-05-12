import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader } from '@/components/admin/AdminChrome'
import BrokerCompanyEditor from '@/components/admin/BrokerCompanyEditor'

export const dynamic = 'force-dynamic'

export default async function AdminBrokerCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await requireAdmin()
  const { id } = await params

  const company = await prisma.brokerCompany.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, email: true, name: true, accountType: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  if (!company) notFound()

  const editorCompany = {
    id: company.id,
    name: company.name,
    slug: company.slug,
    primaryDomain: company.primaryDomain,
    notes: company.notes,
    verifiedAt: company.verifiedAt ? company.verifiedAt.toISOString() : null,
  }
  const editorMembers = company.members.map((m) => ({
    id: m.id,
    role: m.role,
    createdAt: m.createdAt.toISOString(),
    user: m.user,
  }))

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <AdminHeader admin={admin} active="broker-companies" />

        <Link
          href="/admin/broker-companies"
          className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-4"
        >
          ← All broker companies
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-black text-dark-900">{company.name}</h2>
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-mono">{company.slug}</span>
                {company.primaryDomain && <span> · {company.primaryDomain}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Created
              </div>
              <div className="text-sm text-gray-700">
                {new Date(company.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <BrokerCompanyEditor company={editorCompany} members={editorMembers} />
      </div>
    </div>
  )
}
