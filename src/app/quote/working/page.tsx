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

    // Where to send the user if the estimate fails. A broker who started from
    // /quote?source=broker must land back on the BROKER calculator, not the
    // borrower one. Source comes from the URL (?source=broker), falling back to
    // the quoteSource we stashed when the broker form submitted.
    const sourceParam = new URLSearchParams(window.location.search).get('source')
    const source = sourceParam || sessionStorage.getItem('quoteSource')
    const failureHref = source === 'broker' ? '/quote?source=broker' : '/quote'

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
    // Bound the request from the client too. The route already times the
    // upstream out (~25s), but this guards against the route itself stalling
    // and gives the user a clean message instead of an indefinite spinner.
    const controller = new AbortController()
    const clientTimeout = setTimeout(() => controller.abort(), 30_000)
    ;(async () => {
      try {
        const res = await fetch('/api/fee-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.parse(inputsRaw)),
          signal: controller.signal,
        })
        // Read the body as text first and parse defensively. A gateway 504
        // can return an empty body, and `res.json()` on empty/non-JSON throws
        // an opaque "Unexpected end of JSON input" — so derive a real message
        // from the status instead.
        const raw = await res.text()
        if (cancelled) return
        let json: { ok?: boolean; error?: string; report?: unknown } | null = null
        if (raw) {
          try {
            json = JSON.parse(raw)
          } catch {
            json = null
          }
        }
        if (!res.ok || !json || !json.ok) {
          throw new Error(
            json?.error ||
              (res.status === 504 || res.status === 502
                ? 'The fee calculator is taking too long right now. Please try again in a moment.'
                : `Request failed (${res.status})`),
          )
        }
        sessionStorage.setItem('feeReport', JSON.stringify(json.report))
        setReady(true)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error && err.name === 'AbortError'
            ? 'The fee calculator took too long to respond. Please try again.'
            : err instanceof Error
              ? err.message
              : 'Something went wrong'
        sessionStorage.setItem('feeReportError', message)
        router.replace(failureHref)
      }
    })()

    return () => {
      cancelled = true
      clearTimeout(clientTimeout)
    }
  }, [router])

  const handleComplete = () => {
    router.replace('/quote/results')
  }

  return <FeeReportProgress onComplete={handleComplete} ready={ready} />
}
