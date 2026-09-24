'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import BorrowerQuoteForm from '@/components/quote/BorrowerQuoteForm'
import BrokerEstimateForm from '@/components/quote/BrokerEstimateForm'

// Top-level /quote router.
//   ?source=broker — broker estimate (file-oriented, lead capture)
//   anything else  — ordinary borrower fee estimate (unchanged)
//
// Each form lives in its own component file so broker iterations cannot
// regress the borrower flow.
export default function QuotePage() {
  return <Suspense fallback={<div className="min-h-screen" />}><QuoteContent /></Suspense>
}

function QuoteContent() {
  const sourceParam = useSearchParams().get('source')
  if (sourceParam === 'broker') return <BrokerEstimateForm />
  return <BorrowerQuoteForm />
}
