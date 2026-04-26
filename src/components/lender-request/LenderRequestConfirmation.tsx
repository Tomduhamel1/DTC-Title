'use client'

interface LenderRequestConfirmationProps {
  lenderEmail: string
  clientEmail?: string
}

export default function LenderRequestConfirmation({
  lenderEmail,
  clientEmail,
}: LenderRequestConfirmationProps) {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-dark-900 mb-2">Email sent</h3>
      <p className="text-gray-600 mb-1">
        We sent an introduction to <strong className="text-dark-900">{lenderEmail}</strong>.
      </p>
      {clientEmail && (
        <p className="text-gray-600 mb-1">
          You're CC'd at <strong className="text-dark-900">{clientEmail}</strong>.
        </p>
      )}
      <p className="text-sm text-gray-500 mt-4">
        Your lender should reach out within 1 business day. If they have any questions, they can reply directly.
      </p>

      <div className="mt-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
        <strong>Prototype:</strong> No email was actually sent. Check your browser console for the payload.
      </div>
    </div>
  )
}
