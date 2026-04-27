'use client'

import { useEffect, useState } from 'react'

export interface ProgressStep {
  label: string
  // approximate seconds this step appears to take
  durationMs: number
}

interface FeeReportProgressProps {
  steps?: ProgressStep[]
  onComplete?: () => void
  // If provided, the progress will pause at the last step (showing "..." instead
  // of completing) until this is true. Use when waiting on a real API.
  ready?: boolean
}

const DEFAULT_STEPS: ProgressStep[] = [
  { label: 'Pulling underwriter rates', durationMs: 2200 },
  { label: 'Fetching county recording fees', durationMs: 2400 },
  { label: 'Comparing to local market range', durationMs: 2600 },
  { label: 'Building your fee estimate', durationMs: 2200 },
]

export default function FeeReportProgress({
  steps = DEFAULT_STEPS,
  onComplete,
  ready = true,
}: FeeReportProgressProps) {
  // Index of the currently-active step. When index === steps.length, all done.
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= steps.length) return
    const isLast = currentIndex === steps.length - 1
    // If we're on the last step and the API isn't ready, hold here.
    if (isLast && !ready) return

    const timeout = setTimeout(() => {
      setCurrentIndex((i) => i + 1)
    }, steps[currentIndex].durationMs)

    return () => clearTimeout(timeout)
  }, [currentIndex, ready, steps])

  useEffect(() => {
    if (currentIndex >= steps.length) {
      onComplete?.()
    }
  }, [currentIndex, steps.length, onComplete])

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 mb-4">
              <Spinner />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 mb-1">Building your fee estimate</h2>
            <p className="text-sm text-gray-500">This usually takes about 10 seconds.</p>
          </div>

          {/* Steps */}
          <ol className="space-y-3" aria-label="Progress">
            {steps.map((step, idx) => {
              const status: 'done' | 'active' | 'pending' =
                idx < currentIndex ? 'done' : idx === currentIndex ? 'active' : 'pending'
              return <StepRow key={step.label} label={step.label} status={status} />
            })}
          </ol>
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-500 mt-6">
          We're pulling live data — hang tight.
        </p>
      </div>
    </div>
  )
}

function StepRow({
  label,
  status,
}: {
  label: string
  status: 'done' | 'active' | 'pending'
}) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {status === 'done' && <CheckIcon />}
        {status === 'active' && <ActiveDot />}
        {status === 'pending' && <PendingDot />}
      </div>
      <span
        className={`text-sm transition-colors ${
          status === 'done'
            ? 'text-dark-900 font-medium'
            : status === 'active'
            ? 'text-dark-900 font-semibold'
            : 'text-gray-400'
        }`}
      >
        {label}
        {status === 'active' && <AnimatedEllipsis />}
      </span>
    </li>
  )
}

function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-[pop_300ms_ease-out]">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function ActiveDot() {
  return (
    <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
    </div>
  )
}

function PendingDot() {
  return <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
}

function Spinner() {
  return (
    <svg className="w-7 h-7 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function AnimatedEllipsis() {
  return (
    <span className="inline-block ml-1">
      <span className="animate-[blink_1.4s_infinite_both]">.</span>
      <span className="animate-[blink_1.4s_infinite_both] [animation-delay:0.2s]">.</span>
      <span className="animate-[blink_1.4s_infinite_both] [animation-delay:0.4s]">.</span>
      <style jsx>{`
        @keyframes blink {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
