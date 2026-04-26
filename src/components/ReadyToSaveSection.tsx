'use client'

import NextStepsPanel from './lender-request/NextStepsPanel'

export default function ReadyToSaveSection() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-3 leading-tight">
            Make BetterClose your closing company.
          </h2>
          <p className="text-xl text-gray-600">
            Takes 30 seconds. No quote needed.
          </p>
        </div>

        <NextStepsPanel mode="pre-quote" source="ready_to_save" />
      </div>
    </section>
  )
}
