'use client'

import TrackThisClosingPrompt from './TrackThisClosingPrompt'

interface LenderRequestConfirmationProps {
  lenderEmail: string
  clientEmail?: string
}

export default function LenderRequestConfirmation({
  lenderEmail,
  clientEmail,
}: LenderRequestConfirmationProps) {
  return (
    <div>
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-dark-900 mb-1">Email sent</h3>
        <p className="text-sm text-gray-600">
          We introduced you to <strong className="text-dark-900">{lenderEmail}</strong>.
          {clientEmail && <> You're CC'd at <strong className="text-dark-900">{clientEmail}</strong>.</>}
        </p>
      </div>

      <TrackThisClosingPrompt prefilledEmail={clientEmail} />
    </div>
  )
}
