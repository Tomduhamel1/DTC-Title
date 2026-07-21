// Per-state basis for the "typical market" comparison shown next to our fees.
//
// The load-bearing fact: in some states, title insurance PREMIUMS cannot vary
// between providers, so we must not claim savings on them there.
//
//   promulgated   — the state insurance regulator sets the premium; every
//                   title company charges the identical amount by law.
//                   States: TX (TDI, tdi.texas.gov/title/titlerates2026.html),
//                   FL (OIR, promulgated per-$1,000 schedule), NM.
//   rating-bureau — a state-approved rating bureau files a uniform rate
//                   manual adopted by the writers in the state; premiums are
//                   effectively identical across providers.
//                   States: PA (TIRBOP — note its rate is ALL-INCLUSIVE of
//                   search/exam/settlement services), NY (TIRSA), NJ, OH
//                   (OTIRB), DE (DTIRB), NC (NCTIRB — uniform rates approved
//                   by NC DOI, new schedule effective 2025-10-01; surfaced by
//                   the nightly market-fee research, verified July 2026).
//   filed         — every other state: insurers file their own rates, which
//                   genuinely differ between providers; comparison is fair.
//
// Verified July 2026. Sources: tdi.texas.gov, patitleratingbureau.org,
// tirsa.org, netsheetcalc.com/articles/promulgated-rate-title-insurance.
//
// For 'filed' states the comparison ranges below are CONSERVATIVE INTERIM
// multipliers on our own price — a placeholder until per-state published rate
// cards are curated into this module (follow-up to the July 2026 pricing
// audit). They are deliberately tighter than the ranges they replaced, and
// identical for purchase and refinance (the old refi ranges were inflated
// for effect — see the audit).

export type PremiumRateRegime = 'promulgated' | 'rating-bureau' | 'filed'

const PREMIUM_REGIME: Record<string, PremiumRateRegime> = {
  TX: 'promulgated',
  FL: 'promulgated',
  NM: 'promulgated',
  PA: 'rating-bureau',
  NY: 'rating-bureau',
  NJ: 'rating-bureau',
  OH: 'rating-bureau',
  DE: 'rating-bureau',
  NC: 'rating-bureau',
}

export function premiumRegimeFor(stateCode: string | undefined | null): PremiumRateRegime {
  if (!stateCode) return 'filed'
  return PREMIUM_REGIME[stateCode.toUpperCase()] ?? 'filed'
}

/**
 * True when title insurance premiums in this state are identical across
 * providers (promulgated or bureau-uniform) — no premium savings may be
 * claimed there; only service fees are comparable.
 */
export function premiumsAreUniform(stateCode: string | undefined | null): boolean {
  return premiumRegimeFor(stateCode) !== 'filed'
}

export interface ComparisonRange {
  low: number
  high: number
}

// Interim comparison multipliers for fee lines we can fairly compare.
// Applied to our cost; the LOW end drives every claimed savings number
// (see feeReport.conservativeLineSavings).
export const PREMIUM_RANGE_FILED: ComparisonRange = { low: 1.25, high: 1.9 }
export const SERVICE_FEE_RANGE: ComparisonRange = { low: 1.3, high: 2.0 }
export const OTHER_FEE_RANGE: ComparisonRange = { low: 1.15, high: 1.6 }
