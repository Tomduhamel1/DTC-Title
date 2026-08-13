'use client'

import { useState } from 'react'
import { SUPPORT_PHONE_DISPLAY } from '@/lib/contact'

const COMPANY_INFO = `BetterClose Title & Closing
[Legal entity name]
[Street address]
[City, State Zip]
NPN: [NPN]
State licenses: [list]
Settlement agent contact: orders@betterclose.co  ·  ${SUPPORT_PHONE_DISPLAY}`

const ORDER_BODY_TEMPLATE = `Hi BetterClose team,

Please open a new title file:

Borrower(s):
Property address:
City, State, Zip:
Estimated closing date:
Loan amount:
Transaction type: (purchase / refinance)
Sale price (if purchase):

Lender / loan officer name:
Company:
Phone:
NMLS:

Anything else we should know:

Thanks,`

interface OrderByEmailCardProps {
  refId?: string
  // Pre-built subject and body (already filled with borrower/closing data
  // from the server when /for-my-team has a known refId). When omitted we
  // fall back to the generic blank template.
  prefilledSubject?: string
  prefilledBody?: string
  // Hint that the body already contains borrower-side data, so the
  // helper copy under the button changes from "pre-filled order template"
  // to "pre-filled with your client's details".
  isPersonalized?: boolean
}

export default function OrderByEmailCard({
  refId,
  prefilledSubject,
  prefilledBody,
  isPersonalized,
}: OrderByEmailCardProps) {
  const [toast, setToast] = useState<string | null>(null)

  const handleCopyInfo = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_INFO)
      setToast('Company info copied to clipboard.')
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast('Could not copy — please select and copy manually.')
      setTimeout(() => setToast(null), 3000)
    }
  }

  const subject = encodeURIComponent(
    prefilledSubject || `New title order${refId ? ` — ref ${refId}` : ''}`
  )
  const body = encodeURIComponent(prefilledBody || ORDER_BODY_TEMPLATE)
  const mailtoHref = `mailto:orders@betterclose.co?subject=${subject}&body=${body}`

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-7 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-dark-900">Place an order — two ways</h2>
        <p className="text-sm text-gray-500 mt-1">
          Most lenders just email us. Or find us in your existing platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Email it */}
        <div className="p-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">✉️</span>
            <h3 className="text-base font-bold text-dark-900">Email it</h3>
          </div>
          <p className="text-sm text-gray-600 mb-5">
            Send your order to{' '}
            <a
              href={mailtoHref}
              className="font-semibold text-primary-700 underline-offset-2 hover:underline"
            >
              orders@betterclose.co
            </a>
            . We'll confirm within 1 business day.
          </p>
          <a
            href={mailtoHref}
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow transition-colors"
          >
            Email your order →
          </a>
          <p className="text-[11px] text-gray-400 mt-3">
            {isPersonalized
              ? "Opens your mail app — pre-filled with your client's details."
              : 'Opens your mail app with a pre-filled order template.'}
          </p>
        </div>

        {/* Use your tool */}
        <div className="p-7 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">🔧</span>
            <h3 className="text-base font-bold text-dark-900">Use your existing tool</h3>
          </div>
          <p className="text-sm text-gray-600 mb-5">
            Find <strong>BetterClose</strong> in Encompass (SmartFees, Qualia, and ResWare coming soon). Need our info to add us or for closing instructions? Copy below.
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-700 font-mono leading-relaxed mb-3 whitespace-pre-line">
            {COMPANY_INFO}
          </div>

          <button
            onClick={handleCopyInfo}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
          >
            Copy our company info
          </button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg z-50"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
