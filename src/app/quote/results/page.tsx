'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FeeReportTable from '@/components/FeeReportTable'
import NextStepsPanel from '@/components/lender-request/NextStepsPanel'
import { FeeReport, computeTotals, getMockFeeReport } from '@/lib/feeReport'

export default function QuoteResultsPage() {
  const router = useRouter()
  const [report, setReport] = useState<FeeReport | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('feeReport')
    if (stored) {
      try {
        setReport(JSON.parse(stored))
        return
      } catch {}
    }
    setReport(
      getMockFeeReport({ state: 'Texas', homeValue: 500000, transactionType: 'purchase' })
    )
    setIsFallback(true)
  }, [router])

  if (!report) return null

  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/quote" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            ← Start over
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            BetterClose
          </div>
        </div>

        {isFallback && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-900">
            You're viewing a sample report.{' '}
            <Link href="/quote" className="underline font-semibold">
              Get your real estimate →
            </Link>
          </div>
        )}

        <FeeReportTable report={report} />

        {/* Next steps */}
        <div className="mt-8">
          <NextStepsPanel
            savingsEstimate={Math.round(
              (computeTotals(report).estimatedSavingsLow + computeTotals(report).estimatedSavingsHigh) / 2
            )}
            source="quote_results"
          />
        </div>
      </div>
    </div>
  )
}
