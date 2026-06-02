'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompanyOption {
  id: string
  name: string
}

type TransactionType = 'purchase' | 'refinance'

// Prefill payload imported from the public /quote flow when a broker arrives
// via /teammate/quotes/new?prefillFromPublic=1.
//   - Calc fields (transactionType, zip, amounts, propertyState) come from the
//     public FeeReport.
//   - Lead-capture fields (borrower contact, street address, city) come from
//     the broker estimate's sessionStorage `brokerEstimateContext` — they
//     were never on the public FeeReport. Hydrated by BrokerQuoteNewClient.
export interface BrokerQuoteFormPrefill {
  transactionType?: TransactionType
  zip?: string
  homeValue?: number
  loanAmount?: number
  propertyState?: string // 2-letter, already normalized
  // Lead-capture fields (from brokerEstimateContext):
  borrowerName?: string
  borrowerEmail?: string
  borrowerPhone?: string
  propertyAddress?: string
  propertyCity?: string
}

export type BrokerQuoteIntent = 'send' | 'convert'

interface Props {
  // When the broker belongs to multiple companies, the form renders a
  // company picker. When they belong to exactly one, the parent omits
  // companies and the form submits without a companyId (the server picks
  // the only one).
  companies: CompanyOption[]
  // Optional — when present, hydrates form state from a previously-run
  // public quote so the broker doesn't re-key anything. See
  // BrokerQuoteNewWrapper for where this comes from.
  initialPrefill?: BrokerQuoteFormPrefill
  // Orients the CTA copy after the form submits. 'send' = primary action is
  // share with borrower; 'convert' = primary action is open a closing.
  intent?: BrokerQuoteIntent
}

export default function BrokerQuoteForm({ companies, initialPrefill, intent }: Props) {
  const router = useRouter()
  const multipleCompanies = companies.length > 1

  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialPrefill?.transactionType ?? 'purchase',
  )
  const [zip, setZip] = useState(initialPrefill?.zip ?? '')
  const [homeValue, setHomeValue] = useState(
    initialPrefill?.homeValue ? String(initialPrefill.homeValue) : '',
  )
  const [loanAmount, setLoanAmount] = useState(
    initialPrefill?.loanAmount ? String(initialPrefill.loanAmount) : '',
  )

  const [borrowerName, setBorrowerName] = useState(initialPrefill?.borrowerName ?? '')
  const [borrowerEmail, setBorrowerEmail] = useState(initialPrefill?.borrowerEmail ?? '')
  const [borrowerPhone, setBorrowerPhone] = useState(initialPrefill?.borrowerPhone ?? '')

  const [propertyAddress, setPropertyAddress] = useState(initialPrefill?.propertyAddress ?? '')
  const [propertyCity, setPropertyCity] = useState(initialPrefill?.propertyCity ?? '')
  const [propertyState, setPropertyState] = useState(initialPrefill?.propertyState ?? '')
  // propertyZip is omitted as a separate field — we reuse `zip` as the property zip.

  const [companyId, setCompanyId] = useState(multipleCompanies ? '' : companies[0]?.id ?? '')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPurchase = transactionType === 'purchase'
  const zipValid = /^\d{5}$/.test(zip)
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 0
  const loanAmountNum = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0

  const ready =
    zipValid &&
    (isPurchase ? homeValueNum > 0 : loanAmountNum > 0) &&
    (!multipleCompanies || !!companyId)

  // Human-readable reasons the Generate button is disabled, so it can never be
  // a silent mystery. Order mirrors the form top-to-bottom.
  const disabledReasons: string[] = []
  if (multipleCompanies && !companyId) disabledReasons.push('Select a company')
  if (!zipValid) disabledReasons.push('Enter a valid 5-digit property ZIP')
  if (isPurchase && homeValueNum <= 0) disabledReasons.push('Enter a purchase price')
  if (!isPurchase && loanAmountNum <= 0) disabledReasons.push('Enter a loan amount')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const body: Record<string, unknown> = {
        transactionType,
        zip,
        homeValue: homeValueNum > 0 ? homeValueNum : undefined,
        loanAmount: loanAmountNum > 0 ? loanAmountNum : undefined,
        borrowerName: borrowerName.trim() || null,
        borrowerEmail: borrowerEmail.trim() || null,
        borrowerPhone: borrowerPhone.trim() || null,
        propertyAddress: propertyAddress.trim() || null,
        propertyCity: propertyCity.trim() || null,
        propertyState: propertyState.trim() || null,
        propertyZip: zip,
      }
      if (multipleCompanies) body.companyId = companyId

      const res = await fetch('/api/broker/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || `Failed (${res.status})`)
        return
      }
      router.push(`/teammate/quotes/${json.quoteId}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {multipleCompanies && (
        <Section title="Company">
          <Field label="Choose the company this quote is for" required>
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 bg-white"
            >
              <option value="">— Select —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Section>
      )}

      <Section title="Transaction">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Type" required>
            <div className="flex gap-2">
              {(['purchase', 'refinance'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransactionType(t)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                    transactionType === t
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {t === 'purchase' ? 'Purchase' : 'Refinance'}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Property ZIP" required>
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 font-mono"
            />
          </Field>
          {isPurchase && (
            <Field label="Purchase price" required>
              <input
                type="text"
                inputMode="numeric"
                value={homeValue}
                onChange={(e) => setHomeValue(e.target.value)}
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
              />
            </Field>
          )}
          <Field label={isPurchase ? 'Loan amount (defaults to 80% LTV)' : 'Loan amount'} required={!isPurchase}>
            <input
              type="text"
              inputMode="numeric"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
        </div>
      </Section>

      <Section title="Borrower">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name">
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={borrowerEmail}
              onChange={(e) => setBorrowerEmail(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={borrowerPhone}
              onChange={(e) => setBorrowerPhone(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
        </div>
      </Section>

      <Section title="Property">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Street address">
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="City">
            <input
              type="text"
              value={propertyCity}
              onChange={(e) => setPropertyCity(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="State (2-letter)">
            <input
              type="text"
              maxLength={2}
              value={propertyState}
              onChange={(e) => setPropertyState(e.target.value.toUpperCase().slice(0, 2))}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 font-mono uppercase"
            />
          </Field>
        </div>
      </Section>

      <div className="pt-2">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!ready || submitting}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-50 hover:bg-emerald-700"
          >
            {submitting
              ? 'Generating quote…'
              : intent === 'send'
              ? 'Generate & prepare to send'
              : intent === 'convert'
              ? 'Generate & open closing'
              : 'Generate quote'}
          </button>
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
        {/* Always explain WHY the button is disabled, so it can't fail silently. */}
        {!ready && !submitting && disabledReasons.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            To generate a quote: {disabledReasons.join(' · ')}.
          </p>
        )}
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  )
}
