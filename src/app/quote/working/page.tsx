'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FeeReportProgress from '@/components/FeeReportProgress'
import { getMockFeeReport } from '@/lib/feeReport'

export default function QuoteWorkingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const inputsRaw = sessionStorage.getItem('feeReportInputs')

    // Direct landing with no inputs — show a sample so the screen is walkable.
    if (!inputsRaw) {
      if (!sessionStorage.getItem('feeReport')) {
        const sample = getMockFeeReport({
          state: 'TX',
          homeValue: 500000,
          transactionType: 'purchase',
        })
        sessionStorage.setItem('feeReport', JSON.stringify(sample))
      }
      setReady(true)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/fee-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.parse(inputsRaw)),
        })
        const json = await res.json()
        if (cancelled) return
        if (!res.ok || !json.ok) {
          throw new Error(json.error || `Request failed (${res.status})`)
        }
        sessionStorage.setItem('feeReport', JSON.stringify(json.report))
        setReady(true)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Something went wrong'
        sessionStorage.setItem('feeReportError', message)
        router.replace('/quote')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  const handleComplete = () => {
    router.replace('/quote/results')
  }

  return <FeeReportProgress onComplete={handleComplete} ready={ready} />
}
