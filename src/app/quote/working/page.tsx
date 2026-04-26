'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FeeReportProgress from '@/components/FeeReportProgress'
import { getMockFeeReport } from '@/lib/feeReport'

export default function QuoteWorkingPage() {
  const router = useRouter()

  useEffect(() => {
    // If a user lands here directly with no inputs in session, fabricate a
    // sample so the screen is still walkable. Real flow comes from /quote.
    if (typeof window === 'undefined') return
    if (!sessionStorage.getItem('feeReport')) {
      const report = getMockFeeReport({
        state: 'Texas',
        homeValue: 500000,
        transactionType: 'purchase',
      })
      sessionStorage.setItem('feeReport', JSON.stringify(report))
    }
  }, [])

  const handleComplete = () => {
    router.replace('/quote/results')
  }

  return <FeeReportProgress onComplete={handleComplete} ready />
}
