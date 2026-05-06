'use client'

// Tiny client island for the hero CTAs — the rest of /for-my-team is server-
// rendered so it can hydrate the LenderRequest + Closing for prefill. Only
// the smooth-scroll behaviour needs window/document.

interface HeroCtasProps {
  primaryLabel: string
  primaryTarget: string
  secondaryLabel: string
  secondaryTarget: string
}

export default function HeroCtas({
  primaryLabel,
  primaryTarget,
  secondaryLabel,
  secondaryTarget,
}: HeroCtasProps) {
  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <button
        onClick={scrollTo(primaryTarget)}
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {primaryLabel}
      </button>
      <button
        onClick={scrollTo(secondaryTarget)}
        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-bold text-lg px-8 py-4 rounded-lg transition-colors"
      >
        {secondaryLabel}
      </button>
    </div>
  )
}
