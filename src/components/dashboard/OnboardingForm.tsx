'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '@/lib/phone'

interface OnboardingFormProps {
  closingId: string
  userName: string | null
  userEmail: string
}

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

export default function OnboardingForm({ closingId, userName, userEmail }: OnboardingFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: 'purchase' as 'purchase' | 'refinance',
    closingDate: '',
    borrowerPhone: '',
  })

  const valid = data.propertyAddress.trim().length > 5 && data.propertyState

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setSubmitting(true)
    const res = await fetch('/api/closing/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ closingId, ...data, borrowerEmail: userEmail }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">
          Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-dark-900 mb-2">
          Let's set up your dashboard
        </h1>
        <p className="text-gray-600">
          Tell us about your closing so we can match it when your lender sends the order. Takes 30 seconds.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Transaction type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['purchase', 'refinance'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setData({ ...data, propertyType: t })}
                className={`py-3 rounded-lg border-2 font-semibold capitalize transition-colors ${
                  data.propertyType === t
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Property address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.propertyAddress}
            onChange={(e) => setData({ ...data, propertyAddress: e.target.value })}
            placeholder="123 Main St, Apt 4"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              City
            </label>
            <input
              type="text"
              value={data.propertyCity}
              onChange={(e) => setData({ ...data, propertyCity: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={data.propertyState}
              onChange={(e) => setData({ ...data, propertyState: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            >
              <option value="">—</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              ZIP
            </label>
            <input
              type="text"
              value={data.propertyZip}
              onChange={(e) => setData({ ...data, propertyZip: e.target.value })}
              maxLength={10}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Estimated closing date
          </label>
          <input
            type="date"
            value={data.closingDate}
            onChange={(e) => setData({ ...data, closingDate: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={data.borrowerPhone}
            onChange={(e) => setData({ ...data, borrowerPhone: formatPhoneInput(e.target.value) })}
            placeholder="555-555-5555"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            We'll only use this to match your closing when your lender places the order. We never spam.
          </p>
        </div>

        <button
          type="submit"
          disabled={!valid || submitting}
          className="w-full py-3.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Setting up…' : 'Open my dashboard →'}
        </button>
      </form>
    </div>
  )
}
