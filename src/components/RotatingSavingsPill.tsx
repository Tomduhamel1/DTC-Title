'use client'

import { useEffect, useState } from 'react'

// A rotating "That's enough for [emoji] [thing]" pill. Anchors are computed
// from the actual savings amount so they stay honest as the number changes
// (homepage slider, different states, purchase vs refi). Used on the homepage
// hero and the broker page.
//
// Each anchor's count is derived from a realistic unit price, so e.g. $410
// shows "68 coffees" while $1,180 shows "196 coffees" — always truthful.

type Anchor = { emoji: string; build: (amount: number) => string | null }

// Unit prices tuned to be believable. Items return null when the savings are
// too small to make a sensible count (so we never say "0 dinners").
const ANCHORS: Anchor[] = [
  { emoji: '☕', build: (a) => `${Math.floor(a / 6)} coffees` },
  { emoji: '⛽', build: (a) => `${Math.floor(a / 50)} tanks of gas` },
  { emoji: '🍽️', build: (a) => `${Math.floor(a / 40)} dinners out` },
  { emoji: '🍕', build: (a) => `${Math.floor(a / 25)} pizza nights` },
  { emoji: '🎬', build: (a) => `${Math.floor(a / 35)} movie nights` },
  { emoji: '⛳', build: (a) => `${Math.floor(a / 45)} rounds of golf` },
  { emoji: '💆', build: (a) => `${Math.floor(a / 100)} spa massages` },
  { emoji: '🎟️', build: (a) => (a >= 130 ? `${Math.floor(a / 130)} concert tickets` : null) },
  { emoji: '📺', build: (a) => (a >= 180 ? 'a year of streaming' : null) },
  { emoji: '💪', build: (a) => (a >= 240 ? 'a year of the gym' : null) },
  { emoji: '🛒', build: (a) => (a >= 400 ? 'a month of groceries' : null) },
  { emoji: '✈️', build: (a) => (a >= 1000 ? 'a flight anywhere in the US' : null) },
  { emoji: '🏖️', build: (a) => (a >= 1500 ? 'a beach getaway for two' : null) },
]

const ROTATE_MS = 3000

export default function RotatingSavingsPill({
  savings,
  tail = 'back in your pocket',
  className = '',
}: {
  savings: number
  // Trailing phrase after the anchor. Homepage = "in your pocket"; broker page
  // = "back in your borrower's pocket".
  tail?: string
  className?: string
}) {
  // Resolve the anchors that make sense for this savings amount.
  const items = ANCHORS.map((a) => ({ emoji: a.emoji, text: a.build(savings) })).filter(
    (a): a is { emoji: string; text: string } => !!a.text,
  )

  const [index, setIndex] = useState(0)

  // Keep the index in range if the item list shrinks (e.g. slider lowered).
  const safeIndex = items.length > 0 ? index % items.length : 0

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [items.length])

  if (items.length === 0) return null
  const current = items[safeIndex]

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="inline-flex items-center gap-2 bg-emerald-50/60 rounded-full shadow-md border border-emerald-100 px-5 py-2.5">
        <span key={`e${safeIndex}`} className="text-lg inline-block animate-[fadeIn_400ms_ease-out]">
          {current.emoji}
        </span>
        <span className="text-sm text-gray-700">
          That&apos;s enough for{' '}
          <span
            key={safeIndex}
            className="font-bold text-emerald-700 inline-block animate-[fadeIn_400ms_ease-out]"
          >
            {current.text}
          </span>{' '}
          — {tail}.
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
