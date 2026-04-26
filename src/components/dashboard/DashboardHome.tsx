'use client'

import { signOut } from 'next-auth/react'
import MilestoneTimeline from './MilestoneTimeline'
import SectionCard from './SectionCard'

interface ClosingShape {
  id: string
  propertyAddress: string | null
  propertyCity: string | null
  propertyState: string | null
  propertyZip: string | null
  propertyType: string | null
  salePrice: number | null
  loanAmount: number | null
  closingDate: Date | string | null
  borrowerEmail: string | null
  borrowerPhone: string | null
  lenderName: string | null
  lenderCompany: string | null
  lenderEmail: string | null
  lenderPhone: string | null
  lenderNmls: string | null
  agentName: string | null
  agentCompany: string | null
  agentEmail: string | null
  agentPhone: string | null
  titleUnderwriter: string | null
  titlePolicyNo: string | null
  closingLocation: string | null
  status: string
  milestones: { kind: string; status: string; completedAt: Date | string | null; metadata: string | null }[]
}

interface DashboardHomeProps {
  closing: ClosingShape
  userName: string | null
  userEmail: string
}

export default function DashboardHome({ closing, userName, userEmail }: DashboardHomeProps) {
  const fullAddress = [closing.propertyAddress, closing.propertyCity, closing.propertyState, closing.propertyZip]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
            Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-900">
            {userName ? `${userName.split(' ')[0]}'s closing` : 'Your closing'}
          </h1>
          <div className="text-sm text-gray-500 mt-1">{fullAddress || closing.propertyAddress}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
        >
          Sign out
        </button>
      </div>

      {/* Milestone timeline */}
      <MilestoneTimeline milestones={closing.milestones} closingDate={closing.closingDate} />

      {/* Section cards grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SectionCard
          closingId={closing.id}
          title="Property"
          emoji="🏠"
          emptyHint="Tell us about your property."
          fields={[
            { key: 'propertyAddress', label: 'Address', value: closing.propertyAddress, placeholder: '123 Main St' },
            { key: 'propertyCity', label: 'City', value: closing.propertyCity },
            { key: 'propertyState', label: 'State', value: closing.propertyState },
            { key: 'propertyZip', label: 'ZIP', value: closing.propertyZip },
            { key: 'propertyType', label: 'Type', value: closing.propertyType, placeholder: 'purchase or refinance' },
            { key: 'salePrice', label: 'Sale price', value: closing.salePrice ? `$${Math.round(closing.salePrice).toLocaleString()}` : null },
            { key: 'loanAmount', label: 'Loan amount', value: closing.loanAmount ? `$${Math.round(closing.loanAmount).toLocaleString()}` : null },
            { key: 'closingDate', label: 'Closing date', type: 'date', value: closing.closingDate ? new Date(closing.closingDate).toISOString().slice(0, 10) : null },
          ]}
        />

        <SectionCard
          closingId={closing.id}
          title="Lender"
          emoji="🏦"
          emptyHint="We'll fill this in when your lender places the order. Or add it now."
          fields={[
            { key: 'lenderName', label: 'Loan officer', value: closing.lenderName },
            { key: 'lenderCompany', label: 'Company', value: closing.lenderCompany },
            { key: 'lenderEmail', label: 'Email', type: 'email', value: closing.lenderEmail },
            { key: 'lenderPhone', label: 'Phone', type: 'tel', value: closing.lenderPhone },
            { key: 'lenderNmls', label: 'NMLS', value: closing.lenderNmls },
          ]}
        />

        <SectionCard
          closingId={closing.id}
          title="Agent"
          emoji="🏘️"
          emptyHint="Your real estate agent's contact info — pending."
          fields={[
            { key: 'agentName', label: 'Agent', value: closing.agentName },
            { key: 'agentCompany', label: 'Brokerage', value: closing.agentCompany },
            { key: 'agentEmail', label: 'Email', type: 'email', value: closing.agentEmail },
            { key: 'agentPhone', label: 'Phone', type: 'tel', value: closing.agentPhone },
          ]}
        />

        <SectionCard
          closingId={closing.id}
          title="Contacts"
          emoji="👤"
          emptyHint="Your contact info on this closing."
          fields={[
            { key: 'borrowerEmail', label: 'Email', type: 'email', value: closing.borrowerEmail || userEmail },
            { key: 'borrowerPhone', label: 'Phone', type: 'tel', value: closing.borrowerPhone },
          ]}
        />

        <ReadOnlySection
          title="Title"
          emoji="📜"
          emptyHint="Underwriter and policy number will appear when title is issued."
          fields={[
            { label: 'Underwriter', value: closing.titleUnderwriter },
            { label: 'Policy number', value: closing.titlePolicyNo },
          ]}
        />

        <ReadOnlySection
          title="Settlement"
          emoji="🤝"
          emptyHint="BetterClose handles settlement. Closing details appear closer to your date."
          fields={[
            { label: 'Settlement agent', value: 'BetterClose Title & Closing' },
            { label: 'Closing date', value: closing.closingDate ? new Date(closing.closingDate).toLocaleDateString() : null },
            { label: 'Closing location', value: closing.closingLocation },
          ]}
        />
      </div>

      <div className="text-center text-xs text-gray-500 pt-4">
        Anything missing? Email <a href="mailto:hello@betterclose.co" className="underline font-semibold">hello@betterclose.co</a> and we'll fix it.
      </div>
    </div>
  )
}

function ReadOnlySection({
  title,
  emoji,
  emptyHint,
  fields,
}: {
  title: string
  emoji: string
  emptyHint: string
  fields: { label: string; value: string | null }[]
}) {
  const allEmpty = fields.every((f) => !f.value)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl" aria-hidden="true">{emoji}</span>
          <h3 className="text-base font-bold text-dark-900">{title}</h3>
        </div>
        {allEmpty && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
            Pending
          </span>
        )}
      </div>
      <div className="px-5 py-4">
        {allEmpty ? (
          <p className="text-xs text-gray-500">{emptyHint}</p>
        ) : (
          <dl className="space-y-2">
            {fields.map((f) =>
              f.value ? (
                <div key={f.label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-gray-500">{f.label}</dt>
                  <dd className="text-sm text-dark-900 font-medium text-right">{f.value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        )}
      </div>
    </div>
  )
}
