'use client'

import { useSavings } from '@/contexts/SavingsContext'
import NextStepsPanel from './lender-request/NextStepsPanel'

export default function ReadyToSaveSection() {
  const { savings } = useSavings()

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
            Saving <span className="text-green-600">${savings.totalSavings.toLocaleString()}</span> Takes 2 Min
          </h2>
          <p className="text-xl text-gray-600">Choose the option that works best for you</p>
        </div>

        <NextStepsPanel
          savingsEstimate={savings.totalSavings}
          source="ready_to_save"
        />
      </div>
    </section>
  )
}
