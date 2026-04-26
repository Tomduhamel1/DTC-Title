'use client'

import { useState } from 'react'
import { submitLenderRequest } from '@/lib/lender-request-stub'
import LenderEmailPreview from './LenderEmailPreview'
import LenderRequestConfirmation from './LenderRequestConfirmation'

interface LenderRequestFormProps {
  refId: string
  source: string
  savingsEstimate?: number
}

type Step = 'form' | 'preview' | 'confirmed'

export default function LenderRequestForm({
  refId,
  source,
  savingsEstimate,
}: LenderRequestFormProps) {
  const [step, setStep] = useState<Step>('form')
  const [submitting, setSubmitting] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const [data, setData] = useState({
    lenderEmail: '',
    lenderFirstName: '',
    clientName: '',
    clientEmail: '',
    note: '',
  })

  const valid = data.lenderEmail.includes('@')

  const handleSubmit = async () => {
    setSubmitting(true)
    await submitLenderRequest({
      ...data,
      savingsEstimate,
      source,
      refId,
    })
    setSubmitting(false)
    setStep('confirmed')
  }

  if (step === 'confirmed') {
    return <LenderRequestConfirmation lenderEmail={data.lenderEmail} clientEmail={data.clientEmail} />
  }

  if (step === 'preview') {
    return (
      <>
        <LenderEmailPreview
          lenderFirstName={data.lenderFirstName}
          clientName={data.clientName}
          clientEmail={data.clientEmail}
          note={data.note}
          savingsEstimate={savingsEstimate}
          refId={refId}
        />
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setStep('form')}
            className="flex-1 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-[2] py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send email'}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Lender's email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={data.lenderEmail}
          onChange={(e) => setData({ ...data, lenderEmail: e.target.value })}
          placeholder="loanofficer@example.com"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          autoFocus
        />
      </div>

      {!showOptional ? (
        <button
          onClick={() => setShowOptional(true)}
          className="text-sm text-primary-700 font-semibold hover:text-primary-800"
        >
          + Add details (optional)
        </button>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Lender's first name
              </label>
              <input
                type="text"
                value={data.lenderFirstName}
                onChange={(e) => setData({ ...data, lenderFirstName: e.target.value })}
                placeholder="Sarah"
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Your name
              </label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
                placeholder="Alex"
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Your email (so we can CC you)
            </label>
            <input
              type="email"
              value={data.clientEmail}
              onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Add a one-line note (optional)
            </label>
            <textarea
              value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })}
              placeholder="e.g. Closing on Aug 15, would love to use BetterClose."
              rows={2}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setStep('preview')}
        disabled={!valid}
        className="w-full mt-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Preview email →
      </button>
      <p className="text-xs text-gray-500 text-center">
        We'll show you exactly what we'll send before anything goes out.
      </p>
    </div>
  )
}
