import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import MilestoneTimeline from '@/components/dashboard/MilestoneTimeline'
import EscrowOfficerCard from '@/components/dashboard/EscrowOfficerCard'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { getProfessionalContext } from '@/lib/professional'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import MuteToggle from '../MuteToggle'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { closingId: string }
}

// Read-only view of a Closing for a teammate (lender / broker / realtor).
// Only renders if the signed-in user has a TeammateClosing row pointing
// at this closing — otherwise 404. No edit affordances on the borrower's
// fields; the mute toggle is the only interactive control.

export default async function TeammateClosingDetailPage({ params }: PageProps) {
  const user = await requireUser()
  if (!user) {
    redirect(`/login?callbackUrl=/teammate/dashboard/${params.closingId}`)
  }

  const membership = await prisma.teammateClosing.findFirst({
    where: { userId: user.id, closingId: params.closingId },
    include: {
      closing: { include: { milestones: true } },
    },
  })

  if (!membership || !membership.closing) {
    notFound()
  }

  // Read-only: drives whether the broker-only tabs render in the bar above.
  const professional = await getProfessionalContext(user.id)
  const isBrokerMember = professional?.isBrokerMember ?? false

  const c = membership.closing
  const fullAddress = [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip]
    .filter(Boolean)
    .join(', ') || 'Property TBD'

  const escrowOfficer = {
    name: c.escrowOfficerName,
    title: c.escrowOfficerTitle,
    email: c.escrowOfficerEmail,
    phone: c.escrowOfficerPhone,
    nmls: c.escrowOfficerNmls,
    photoUrl: c.escrowOfficerPhotoUrl,
  }

  const fmtMoney = (n: number | null) =>
    n != null ? `$${Math.round(n).toLocaleString()}` : '—'
  const fmtDate = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—'

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="files" isBrokerMember={isBrokerMember} />
          <Link
            href="/teammate/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 mb-4"
          >
            ← All files
          </Link>

          <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
                File
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-dark-900 leading-tight">
                {fullAddress}
              </h1>
              <div className="text-sm text-gray-500 mt-1">
                Borrower: {c.borrowerEmail || 'TBD'}
              </div>
            </div>
            <MuteToggle membershipId={membership.id} initialMuted={membership.muted} />
          </div>

          <div className="space-y-4">
            {/* Closing Progress */}
            <MilestoneTimeline milestones={c.milestones} closingDate={c.closingDate} />

            {/* Escrow Officer */}
            <EscrowOfficerCard officer={escrowOfficer} variant="main" />

            {/* Transaction snapshot */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-dark-900 mb-3">Transaction</h3>
              <dl className="grid sm:grid-cols-3 gap-x-6 gap-y-3">
                <Field label="Sale price" value={fmtMoney(c.salePrice)} />
                <Field label="Loan amount" value={fmtMoney(c.loanAmount)} />
                <Field label="Closing date" value={fmtDate(c.closingDate)} />
                <Field label="Type" value={c.propertyType || '—'} />
                <Field label="Underwriter" value={c.titleUnderwriter || 'Pending'} />
                <Field label="Policy #" value={c.titlePolicyNo || 'Pending'} />
              </dl>
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-dark-900 mb-3">Contacts</h3>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <ContactBlock
                  label="Borrower"
                  name={null}
                  email={c.borrowerEmail}
                  phone={c.borrowerPhone}
                />
                <ContactBlock
                  label="Lender / Loan officer"
                  name={c.lenderName}
                  company={c.lenderCompany}
                  email={c.lenderEmail}
                  phone={c.lenderPhone}
                />
                <ContactBlock
                  label="Real estate agent"
                  name={c.agentName}
                  company={c.agentCompany}
                  email={c.agentEmail}
                  phone={c.agentPhone}
                />
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 pt-8">
            Need to make a change? Email{' '}
            <a href="mailto:teammates@betterclose.co" className="underline">
              teammates@betterclose.co
            </a>
            .
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-sm text-dark-900 font-medium mt-0.5">{value}</dd>
    </div>
  )
}

function ContactBlock({
  label,
  name,
  company,
  email,
  phone,
}: {
  label: string
  name?: string | null
  company?: string | null
  email?: string | null
  phone?: string | null
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </div>
      {name ? (
        <div className="text-sm font-semibold text-dark-900">{name}</div>
      ) : null}
      {company ? <div className="text-xs text-gray-600">{company}</div> : null}
      {email ? (
        <a className="block text-xs text-emerald-700 hover:underline truncate" href={`mailto:${email}`}>
          {email}
        </a>
      ) : null}
      {phone ? (
        <a className="block text-xs text-gray-700 hover:text-emerald-700" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
          {phone}
        </a>
      ) : null}
      {!name && !company && !email && !phone && (
        <div className="text-xs text-gray-400 italic">Not on file yet</div>
      )}
    </div>
  )
}
