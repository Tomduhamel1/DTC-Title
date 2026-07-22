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

import { resolveStateCode } from './stateSavings'

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

// Interim comparison multipliers for PREMIUM lines in filed-rate states.
// Applied to our cost; the LOW end drives every claimed savings number
// (see feeReport.conservativeLineSavings). Premium-manual evidence exists in
// data/market-fees (research branch) for a future per-state premium fold-in.
export const PREMIUM_RANGE_FILED: ComparisonRange = { low: 1.25, high: 1.9 }

// ── Service-fee comparison bands (July 2026 market-fee survey) ────────────
//
// Derived from the 51-state survey of PUBLISHED competitor fee schedules
// (data/market-fees on branch research/market-fees — 241 verified sources,
// per-state search logs). Method:
//   1. For each state with published service-fee evidence, every provider's
//      all-in buyer-side service stack (settlement/closing/escrow + search/
//      exam + admin/processing + doc prep + mandatory small fees) was
//      normalized to a standard $400–500k financed purchase. Full-fee
//      schedules that split between buyer and seller were HALVED
//      (conservative). REO/institutional-only and premium-only sources
//      excluded.
//   2. "Typical" = the interquartile range of provider stacks (not min–max:
//      the record-cheapest outlier is not what a broker recognizes as
//      typical, and the max would inflate).
//   3. Each state's band = typical range ÷ our own engine's service-stack
//      total for the same scenario (measured July 2026).
//   4. States whose competitors publish nothing ("scarce" in the survey)
//      get the POOLED band: median of the published states' ratios, shaded
//      down on the low end — {1.05, 1.4}. This is deliberately conservative:
//      in published markets our service price sits near the typical LOW end,
//      so scarce states claim little-to-no service savings rather than
//      inflated ones.
//
// Notable and intentional: TX and OK bands are BELOW 1.0 — published
// competitors there price escrow/service work under our current fees, and
// the quote page will show that honestly (savings clamp to $0; flagged for
// internal pricing review). IL reflects its Chicago-metro-dominated
// published market; IA's band reflects partial (abstract-state) stacks.
// Evidence hierarchy for a state's band, strongest first:
//   'published'  — static filed/published fee schedules (rate cards, manuals)
//   'calculator' — itemized quotes harvested from providers' own public
//                  quote calculators at the standard scenario ($500k
//                  purchase / $400k loan / major county), dated at retrieval.
//                  Never collected through lead-gated forms — no fabricated
//                  contact info, ever; gated calculators are logged, not used.
//   'inferred'   — pooled median band from evidenced states (see above).
export interface ServiceBand extends ComparisonRange {
  basis: 'published' | 'calculator' | 'inferred'
  // Number of distinct providers behind a 'published'/'calculator' band.
  providers?: number
}

export const INFERRED_SERVICE_BAND: ServiceBand = { low: 1.05, high: 1.4, basis: 'inferred' }

const SERVICE_BANDS: Record<string, ServiceBand> = {
  CA: { low: 1.31, high: 1.9, basis: 'published', providers: 3 },
  GA: { low: 1.09, high: 1.2, basis: 'published', providers: 2 },
  WA: { low: 1.23, high: 1.77, basis: 'published', providers: 6 },
  ID: { low: 0.77, high: 0.89, basis: 'published', providers: 8 },
  IA: { low: 0.36, high: 1.3, basis: 'published', providers: 4 },
  IL: { low: 2.87, high: 3.37, basis: 'published', providers: 10 },
  KS: { low: 0.68, high: 1.08, basis: 'published', providers: 12 },
  MT: { low: 1.14, high: 1.43, basis: 'published', providers: 2 },
  OK: { low: 0.27, high: 0.65, basis: 'published', providers: 2 },
  TX: { low: 0.56, high: 0.73, basis: 'published', providers: 4 },
  FL: { low: 0.96, high: 1.36, basis: 'published', providers: 5 },
  NY: { low: 0.58, high: 1.36, basis: 'published', providers: 2 },
  // NC has published evidence (buyer stack $1,175, one provider) but our own
  // NC service denominator couldn't be measured (upstream 500s) — inferred
  // band until the denominator lands and the ratio can be computed.
}

export function serviceBandFor(state: string | undefined | null): ServiceBand {
  const code = resolveStateCode(state)
  if (!code) return INFERRED_SERVICE_BAND
  return SERVICE_BANDS[code] ?? INFERRED_SERVICE_BAND
}
