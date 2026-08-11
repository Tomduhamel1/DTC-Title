'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { representativeZipForState } from '@/lib/representativeZip'
import {
  writeBrokerEstimateContext,
  type BrokerEstimateContext,
} from '@/lib/brokerEstimateContext'

// 50 states + DC.
const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]
const STATE_SET = new Set(STATES)

type TransactionType = 'purchase' | 'refinance'

// Broker estimate form — Garden-style compact calculator.
//
// Two distinct location concepts intentionally kept separate:
//
//   pricingLocation (top row "ZIP or State") — input to the calculator only.
//     If a ZIP is typed, that's a real ZIP and gets carried into the property
//     fields if the optional ZIP isn't set. If a state is typed, we substitute
//     a representative ZIP for the calc but DO NOT treat it as a property ZIP.
//
//   property fields (optional section) — what the file/order actually uses.
//     Includes a separate property ZIP field. This is what carries into
//     brokerEstimateContext.propertyZip and never gets polluted by the
//     representative ZIP substitution.
export default function BrokerEstimateForm() {
  const router = useRouter()

  // ── Calculator row (above the fold) ─────────────────────────────────────
  const [transactionType, setTransactionType] = useState<TransactionType>('purchase')
  // Top row "ZIP or State" — pricing input. Not a property field.
  const [pricingLocation, setPricingLocation] = useState('')
  const [homeValue, setHomeValue] = useState('')
  const [loanAmount, setLoanAmount] = useState('')

  // ── Optional file details (open by default) — order prefill ────────────
  // Visible inline below the calculator row so brokers can see everything at
  // once; no accordion.
  const [borrowerName, setBorrowerName] = useState('')
  const [borrowerEmail, setBorrowerEmail] = useState('')
  const [borrowerPhone, setBorrowerPhone] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyCity, setPropertyCity] = useState('')
  const [propertyState, setPropertyState] = useState('')
  // Actual property ZIP — distinct from pricingLocation. May be blank.
  const [propertyZip, setPropertyZip] = useState('')
  const [targetClosingDate, setTargetClosingDate] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 'unavailable' renders as an amber informational notice (service-area), not a red error.
  const [errorKind, setErrorKind] = useState<'error' | 'unavailable'>('error')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stashed = sessionStorage.getItem('feeReportError')
    if (stashed) {
      setError(stashed)
      setErrorKind(sessionStorage.getItem('feeReportErrorKind') === 'unavailable' ? 'unavailable' : 'error')
      sessionStorage.removeItem('feeReportError')
      sessionStorage.removeItem('feeReportErrorKind')
    }
    sessionStorage.setItem('quoteSource', 'broker')
  }, [])

  // Mirror the top-row "ZIP or state" pricing input into the corresponding
  // Optional field. We only fill blanks — anything the broker typed manually
  // in the Optional section stays put. Runs whenever pricingLocation changes.
  useEffect(() => {
    const t = pricingLocation.trim().toUpperCase()
    if (/^\d{5}$/.test(t)) {
      setPropertyZip((cur) => (cur ? cur : t))
    } else if (STATE_SET.has(t)) {
      setPropertyState((cur) => (cur ? cur : t))
    }
  }, [pricingLocation])

  const isPurchase = transactionType === 'purchase'
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 0
  const loanAmountNum = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0
  const amountOk = isPurchase ? homeValueNum > 0 : loanAmountNum > 0

  // Parse the pricing-location input.
  const pricingTrim = pricingLocation.trim().toUpperCase()
  const pricingIsZip = /^\d{5}$/.test(pricingTrim)
  const pricingIsState = STATE_SET.has(pricingTrim)

  // State picker on the optional row is a fallback for the pricing state.
  const resolvedStateCode = pricingIsState
    ? pricingTrim
    : propertyState || ''

  // Calc-time ZIP that gets sent to elend. Order of precedence:
  //   1. ZIP in the pricing field — real, taken straight.
  //   2. ZIP from the optional property section — also real.
  //   3. Representative ZIP derived from state — substituted only for calc.
  //
  // Precision is 'detailed' only when (1) or (2) wins. When the
  // representative substitution kicks in, precision is 'state'.
  const propertyZipValid = /^\d{5}$/.test(propertyZip)
  const calcZipFromRealInput = pricingIsZip
    ? pricingTrim
    : propertyZipValid
    ? propertyZip
    : undefined
  const calcZip =
    calcZipFromRealInput ?? (resolvedStateCode ? representativeZipForState(resolvedStateCode) : undefined)
  const precision: 'state' | 'detailed' = calcZipFromRealInput ? 'detailed' : 'state'

  const hasUsableLocation = !!calcZip
  const valid = hasUsableLocation && amountOk

  // The ACTUAL property ZIP for the file. Never the representative ZIP.
  //   - if optional ZIP is filled, use it.
  //   - else if pricing was a real ZIP, carry that as the property ZIP.
  //   - else blank — broker will add it later before sending or opening.
  const resolvedPropertyZip = propertyZipValid
    ? propertyZip
    : pricingIsZip
    ? pricingTrim
    : undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || submitting || !calcZip) return
    setSubmitting(true)
    setError(null)

    // Calc payload — feeds elend / state-level synth. Uses calcZip, which
    // may be a representative substitution. That's fine here because this
    // payload is for the calculator only.
    const calcPayload = {
      transactionType,
      zip: calcZip,
      homeValue: isPurchase ? homeValueNum : undefined,
      loanAmount: loanAmountNum > 0 ? loanAmountNum : undefined,
      stateCode: resolvedStateCode || undefined,
      precision,
    }
    sessionStorage.setItem('feeReportInputs', JSON.stringify(calcPayload))
    sessionStorage.removeItem('feeReport')
    sessionStorage.removeItem('feeReportError')

    // Lead/file context — what gets carried into the order/file. Uses
    // resolvedPropertyZip, which is NEVER the representative substitution.
    const ctx: BrokerEstimateContext = {}
    if (propertyAddress.trim()) ctx.propertyAddress = propertyAddress.trim()
    if (propertyCity.trim()) ctx.propertyCity = propertyCity.trim()
    if (resolvedStateCode) ctx.propertyState = resolvedStateCode
    if (resolvedPropertyZip) ctx.propertyZip = resolvedPropertyZip
    if (borrowerName.trim()) ctx.borrowerName = borrowerName.trim()
    if (borrowerEmail.trim()) ctx.borrowerEmail = borrowerEmail.trim()
    if (borrowerPhone.trim()) ctx.borrowerPhone = borrowerPhone.trim()
    if (targetClosingDate) ctx.targetClosingDate = targetClosingDate
    writeBrokerEstimateContext(ctx)

    router.push('/quote/working?source=broker')
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white pt-16 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5 flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900">
            Get estimate
          </h1>
          <p className="text-sm text-gray-500">
            Price it now. Added details will carry forward.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-7"
        >
          {/* ───── Calculator row: 5 cells on desktop ───── */}
          <div className="grid grid-cols-2 sm:grid-cols-[144px_204px_156px_156px_auto] gap-4 items-end">
            <CompactField label="Type">
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className="w-full h-[52px] px-3.5 rounded-lg text-base font-semibold text-dark-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              >
                <option value="purchase">Purchase</option>
                <option value="refinance">Refinance</option>
              </select>
            </CompactField>

            <CompactField label="ZIP (best) or state">
              <input
                type="text"
                value={pricingLocation}
                onChange={(e) =>
                  setPricingLocation(e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 5))
                }
                placeholder="78701 or TX"
                maxLength={5}
                className={baseInput + ' uppercase placeholder:text-gray-400'}
              />
            </CompactField>

            <CompactField label="Purchase price" dim={!isPurchase}>
              <CurrencyInput
                value={homeValue}
                onChange={setHomeValue}
                disabled={!isPurchase}
              />
            </CompactField>

            <CompactField label="Loan amount">
              <CurrencyInput value={loanAmount} onChange={setLoanAmount} />
            </CompactField>

            <button
              type="submit"
              disabled={!valid || submitting}
              className="h-[52px] inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold px-6 rounded-lg shadow-sm transition-colors disabled:opacity-50 col-span-2 sm:col-span-1"
            >
              {submitting ? 'Building…' : 'Calculate'}
            </button>
          </div>

          {error && (
            <div
              className={
                errorKind === 'unavailable'
                  ? 'mt-4 bg-amber-50 border border-amber-200 rounded-md px-3.5 py-2.5 text-sm text-amber-900'
                  : 'mt-4 bg-red-50 border border-red-200 rounded-md px-3.5 py-2.5 text-sm text-red-800'
              }
            >
              {error}
            </div>
          )}

          {/* ───── Optional file details — open by default ───── */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h2 className="text-base font-bold text-dark-900 mb-4">
              Optional <span className="font-normal text-gray-400">(You can also add later)</span>
            </h2>
            {/* 6-column grid so each field can claim only the width it
                needs. Wide free-text fields (name, email, address) span 2;
                short fields (state, zip, target close) span 1–2. */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div className="sm:col-span-2">
                <SmallField label="Borrower name">
                  <input
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className={smallInput}
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-2">
                <SmallField label="Borrower email">
                  <input
                    type="email"
                    value={borrowerEmail}
                    onChange={(e) => setBorrowerEmail(e.target.value)}
                    className={smallInput}
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-2">
                <SmallField label="Borrower phone">
                  <input
                    type="tel"
                    value={borrowerPhone}
                    onChange={(e) => setBorrowerPhone(e.target.value)}
                    className={smallInput}
                  />
                </SmallField>
              </div>

              <div className="sm:col-span-3">
                <SmallField label="Street address">
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className={smallInput}
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-2">
                <SmallField label="City">
                  <input
                    type="text"
                    value={propertyCity}
                    onChange={(e) => setPropertyCity(e.target.value)}
                    className={smallInput}
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-1" aria-hidden="true" />

              <div className="sm:col-span-1">
                <SmallField label="State">
                  <select
                    value={propertyState}
                    onChange={(e) => setPropertyState(e.target.value)}
                    className={smallInput + ' bg-white'}
                  >
                    <option value="">—</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </SmallField>
              </div>
              <div className="sm:col-span-1">
                <SmallField label="ZIP">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={propertyZip}
                    onChange={(e) =>
                      setPropertyZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))
                    }
                    placeholder="ZIP"
                    maxLength={5}
                    className={smallInput + ' placeholder:text-gray-400'}
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-2">
                <SmallField label="Target close">
                  <input
                    type="date"
                    value={targetClosingDate}
                    onChange={(e) => setTargetClosingDate(e.target.value)}
                    className={
                      smallInput +
                      (targetClosingDate ? ' text-dark-900' : ' text-gray-400')
                    }
                  />
                </SmallField>
              </div>
              <div className="sm:col-span-2" aria-hidden="true" />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Shared field/input styling — kept inline so the form is one file. ──────

// Required-row and Optional-row inputs share the SAME styling so the field
// containers match in height and shape across both sections. Sized ~20% larger
// than the prior compact form.
const baseInput =
  'w-full h-[52px] px-3.5 border border-gray-300 rounded-lg text-base focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none'
const smallInput = baseInput

function CompactField({
  label,
  hint,
  dim,
  children,
}: {
  label: React.ReactNode
  hint?: string
  dim?: boolean
  children: React.ReactNode
}) {
  return (
    <label className={`block ${dim ? 'opacity-50' : ''}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {hint && (
          <span className="text-[11px] text-gray-400 truncate ml-2">{hint}</span>
        )}
      </div>
      {children}
    </label>
  )
}

function SmallField({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  )
}

// Formats a raw digit-only value with thousands separators for display.
// "1500000" → "1,500,000". State stays digits-only; only the rendered input
// value is comma-grouped.
function groupThousands(digits: string): string {
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function CurrencyInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">$</span>
      <input
        type="text"
        inputMode="numeric"
        value={groupThousands(value)}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        disabled={disabled}
        className={baseInput + ' pl-8 disabled:bg-gray-50'}
      />
    </div>
  )
}
