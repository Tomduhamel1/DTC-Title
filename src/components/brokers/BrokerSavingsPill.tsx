'use client'

import { useState, useEffect } from 'react'

// Rotating "this buys" payoff pill that sits under the example savings card on
// /for-brokers. The anchors are kept honest against the $410 over-the-loan
// example shown in the card (see for-brokers/page.tsx): each is ~$400–410.
// Mirrors the rotation pattern used by the borrower-side StorytellingSection.
const SAVINGS_ANCHORS = [
  'a year of streaming',
  '8 tanks of gas',
  '10 dinners out',
  'a weekend getaway',
  '68 coffees',
] as const

const ROTATE_MS = 3000

export default function BrokerSavingsPill() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SAVINGS_ANCHORS.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex justify-center mt-4">
      <div className="inline-flex items-center gap-2 bg-white rounded-full shadow-md border border-emerald-100 px-5 py-2.5">
        <span className="text-lg">💸</span>
        <span className="text-sm text-gray-700">
          That&apos;s enough for{' '}
          <span
            key={index}
            className="font-bold text-emerald-700 inline-block animate-[fadeIn_400ms_ease-out]"
          >
            {SAVINGS_ANCHORS[index]}
          </span>{' '}
          — back in your borrower&apos;s pocket.
        </span>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
