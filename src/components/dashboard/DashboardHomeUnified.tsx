'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import MilestoneTimeline from './MilestoneTimeline'
import SectionShell from './SectionShell'
import StatusNode, { type StepStatus } from './StatusNode'
import {
  ProgressIcon,
  PropertyIcon,
  LoanIcon,
  TitleIcon,
  SettlementIcon,
  ContactsIcon,
} from './SectionIcons'
import EditableFields from './EditableFields'
import LineItemList, { LineItem } from './LineItemList'
import ContactRail from './ContactRail'
import ShareWithTeamSheet from '@/components/lender-request/ShareWithTeamSheet'
import type { AccountStep } from './AccountSection'

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

interface DashboardHomeUnifiedProps {
  closing: ClosingShape
  userName: string | null
  userEmail: string
  accountSteps: AccountStep[]
}

export default function DashboardHomeUnified({
  closing,
  userName,
  userEmail,
  accountSteps,
}: DashboardHomeUnifiedProps) {
  const [shareOpen, setShareOpen] = useState(false)

  const fullAddress = [closing.propertyAddress, closing.propertyCity, closing.propertyState, closing.propertyZip]
    .filter(Boolean)
    .join(', ')

  const isPurchase = (closing.propertyType || 'purchase') === 'purchase'

  const titleItems: LineItem[] = [
    {
      label: "Lender's Title Insurance",
      description: 'A-rated underwriter coverage required by your lender',
      amount: null,
    },
    ...(isPurchase
      ? [
          {
            label: "Owner's Title Insurance",
            description: 'Optional but strongly recommended — protects you',
            amount: null,
          } as LineItem,
        ]
      : []),
  ]

  const settlementItems: LineItem[] = [
    { label: 'Settlement Fee', description: 'Closing coordination & disbursement', amount: null },
    { label: 'Notary Fee', amount: null },
    { label: 'Wire Transfer Fee', amount: null },
    { label: 'Mortgage Recording Fee', amount: null, isFixed: true },
    { label: 'Satisfaction (Release) Recording Fee', amount: null, isFixed: true },
    ...(isPurchase
      ? [{ label: 'Deed Recording Fee', amount: null, isFixed: true } as LineItem]
      : []),
  ]

  // Lender confirmation status — drives the "Lender" sub-block.
  const hasLenderInfo = Boolean(closing.lenderName || closing.lenderCompany || closing.lenderEmail)
  const orderPlaced = closing.status !== 'pending'
  const lenderStatus: StepStatus = orderPlaced
    ? 'done'
    : hasLenderInfo
    ? 'active'
    : 'pending'

  const inviteStep = accountSteps.find((s) => s.key === 'invite')
  const orderStep = accountSteps.find((s) => s.key === 'order')
  const showPrimaryShareCta = inviteStep?.status === 'active'
  const showResendCtas = inviteStep?.status === 'done' && orderStep?.status === 'active'

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
            Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-900">
            {userName ? `${userName.split(' ')[0]}'s closing` : 'Your closing'}
          </h1>
          {fullAddress && <div className="text-sm text-gray-500 mt-1">{fullAddress}</div>}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
        >
          Sign out
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4 min-w-0">
          {/* 1. Settlement Agent — BetterClose account progression */}
          <SectionShell
            title="Settlement Agent"
            icon={<SettlementIcon />}
            subtitle={orderPlaced ? 'BetterClose Title & Closing' : undefined}
          >
            <ol className="space-y-4">
              {accountSteps.map((step) => (
                <li key={step.key} className="flex gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <StatusNode status={step.status} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[15px] leading-tight ${
                        step.status === 'pending'
                          ? 'text-gray-400'
                          : step.status === 'active'
                          ? 'font-bold text-dark-900'
                          : 'font-semibold text-dark-900'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-[12px] mt-0.5 ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {step.detail}
                    </div>

                    {step.key === 'invite' && showPrimaryShareCta && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShareOpen(true)}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-colors"
                        >
                          Send BetterClose to my team →
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Takes 30 seconds. Text, email, or copy a link — your choice.
                        </p>
                      </div>
                    )}

                    {step.key === 'invite' && showResendCtas && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => setShareOpen(true)}
                          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => setShareOpen(true)}
                          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Send to a different lender
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </SectionShell>

          {/* 2. Lender */}
          <SectionShell
            title="Lender"
            icon={<LoanIcon />}
            subtitle={
              hasLenderInfo
                ? [closing.lenderName, closing.lenderCompany].filter(Boolean).join(' · ') || undefined
                : undefined
            }
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 pt-0.5">
                <StatusNode status={lenderStatus} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[15px] leading-tight ${
                    lenderStatus === 'pending'
                      ? 'text-gray-400'
                      : lenderStatus === 'active'
                      ? 'font-bold text-dark-900'
                      : 'font-semibold text-dark-900'
                  }`}
                >
                  {lenderStatus === 'done'
                    ? 'Lender confirmed'
                    : lenderStatus === 'active'
                    ? 'Lender selected'
                    : 'Lender not yet selected'}
                </div>
                <div
                  className={`text-[12px] mt-0.5 ${
                    lenderStatus === 'pending' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {hasLenderInfo
                    ? 'Loan officer info on file. See Transaction Details to edit.'
                    : "Once your loan officer is identified, they'll appear here."}
                </div>
              </div>
            </div>
          </SectionShell>

          {/* 3. Milestones */}
          <SectionShell title="Closing Progress" icon={<ProgressIcon />}>
            <MilestoneTimeline
              milestones={closing.milestones}
              closingDate={closing.closingDate}
            />
          </SectionShell>

          {/* TRANSACTION DETAILS — everything else collapsed under one umbrella */}
          <SectionShell title="Transaction Details" icon={<PropertyIcon />}>
            <div className="space-y-7">
              {/* Property */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Property
                </div>
                <EditableFields
                  closingId={closing.id}
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
              </div>

              {/* Settlement details */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                    <SettlementIcon />
                  </span>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Settlement
                  </div>
                </div>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Settlement agent
                    </dt>
                    <dd className="text-sm text-dark-900 font-medium mt-0.5">
                      BetterClose Title &amp; Closing
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Closing date
                    </dt>
                    <dd className="text-sm text-dark-900 font-medium mt-0.5">
                      {closing.closingDate ? (
                        new Date(closing.closingDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-gray-400 italic">Pending</span>
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Closing location
                    </dt>
                    <dd className="text-sm text-dark-900 font-medium mt-0.5">
                      {closing.closingLocation || (
                        <span className="text-gray-400 italic">Confirmed closer to your closing date</span>
                      )}
                    </dd>
                  </div>
                </dl>
                <LineItemList title="Settlement & recording fees" items={settlementItems} />
              </div>

              {/* Title */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                    <TitleIcon />
                  </span>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Title
                  </div>
                </div>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Underwriter
                    </dt>
                    <dd className="text-sm text-dark-900 font-medium mt-0.5">
                      {closing.titleUnderwriter || (
                        <span className="text-gray-400 italic">Pending — assigned at title order</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Policy number
                    </dt>
                    <dd className="text-sm text-dark-900 font-medium mt-0.5">
                      {closing.titlePolicyNo || (
                        <span className="text-gray-400 italic">Pending — issued at title</span>
                      )}
                    </dd>
                  </div>
                </dl>
                <LineItemList title="Title fees" items={titleItems} />
              </div>

              {/* Loan details */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                    <LoanIcon />
                  </span>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Loan
                  </div>
                </div>
                <EditableFields
                  closingId={closing.id}
                  emptyHint="Add your loan officer's contact info, or wait — we'll fill this in when your lender places the order."
                  fields={[
                    { key: 'lenderName', label: 'Loan officer', value: closing.lenderName },
                    { key: 'lenderCompany', label: 'Company', value: closing.lenderCompany },
                    { key: 'lenderEmail', label: 'Email', type: 'email', value: closing.lenderEmail },
                    { key: 'lenderPhone', label: 'Phone', type: 'tel', value: closing.lenderPhone },
                    { key: 'lenderNmls', label: 'NMLS', value: closing.lenderNmls },
                  ]}
                  footnote={
                    <p className="text-xs text-gray-500">
                      Want a different lender?{' '}
                      <a href="mailto:hello@betterclose.co" className="text-primary-700 font-semibold underline-offset-2 hover:underline">
                        Email us
                      </a>{' '}
                      — we can recommend partners.
                    </p>
                  }
                />
              </div>

              {/* Contacts */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                    <ContactsIcon />
                  </span>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Contacts
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      You (borrower)
                    </div>
                    <EditableFields
                      closingId={closing.id}
                      emptyHint="Your contact info."
                      fields={[
                        { key: 'borrowerEmail', label: 'Email', type: 'email', value: closing.borrowerEmail || userEmail },
                        { key: 'borrowerPhone', label: 'Phone', type: 'tel', value: closing.borrowerPhone },
                      ]}
                    />
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Real estate agent
                    </div>
                    <EditableFields
                      closingId={closing.id}
                      emptyHint="Add your agent's info — pending until then."
                      fields={[
                        { key: 'agentName', label: 'Agent', value: closing.agentName },
                        { key: 'agentCompany', label: 'Brokerage', value: closing.agentCompany },
                        { key: 'agentEmail', label: 'Email', type: 'email', value: closing.agentEmail },
                        { key: 'agentPhone', label: 'Phone', type: 'tel', value: closing.agentPhone },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>

          <div className="text-center text-xs text-gray-400 pt-4">
            Anything wrong? Email{' '}
            <a href="mailto:hello@betterclose.co" className="underline">
              hello@betterclose.co
            </a>{' '}
            and we'll fix it.
          </div>
        </div>

        <ContactRail />
      </div>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="dashboard_account"
      />
    </div>
  )
}
