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

// July 24 update: First American's buyer-side settlement fees folded in from
// a direct LVIS-API recon (data/market-fees/api-firstam/FA-SETTLEMENT.json;
// method + caveats in docs/SETTLEMENT_FEE_MASTER.md). Notables:
//  - The API's authoritative buyer-side figures corrected earlier 50/50
//    split assumptions (CA: FA buyer-side is $1,750 at $500k, not ~$945) —
//    CA's band rises accordingly.
//  - FA prices scale with deal size in CA/WA/HI/IL/AK/NM/NV/OR ("value-based
//    escrow"). These bands are anchored at the $500k scenario, so quotes on
//    much larger deals UNDERSTATE savings in those states. Price-aware bands
//    are the planned fix; understating is the acceptable failure direction.
//  - FA's PA figure ($0) is a product-selection quirk — excluded.
const SERVICE_BANDS: Record<string, ServiceBand> = {
  CA: { low: 1.8, high: 2.5, basis: 'published', providers: 2 },
  GA: { low: 1.09, high: 1.2, basis: 'published', providers: 2 },
  WA: { low: 1.23, high: 1.88, basis: 'published', providers: 7 },
  ID: { low: 0.77, high: 0.89, basis: 'published', providers: 9 },
  IA: { low: 0.36, high: 1.3, basis: 'published', providers: 4 },
  IL: { low: 2.87, high: 3.35, basis: 'published', providers: 11 },
  KS: { low: 0.64, high: 1.14, basis: 'published', providers: 13 },
  MT: { low: 1.14, high: 1.43, basis: 'published', providers: 2 },
  OK: { low: 0.22, high: 0.46, basis: 'published', providers: 3 },
  TX: { low: 0.57, high: 0.94, basis: 'published', providers: 5 },
  FL: { low: 0.88, high: 1.35, basis: 'published', providers: 6 },
  NY: { low: 0.58, high: 1.36, basis: 'published', providers: 2 },

  // ── July 24 second wave: calculator/API evidence (FA direct API + Old
  // Republic harvest + late-extracted published schedules). n=2 states use
  // min–max of the two observed buyer-side stacks ÷ our service total.
  OH: { low: 0.67, high: 1.73, basis: 'calculator', providers: 2 },
  NV: { low: 0.48, high: 0.55, basis: 'calculator', providers: 2 },
  UT: { low: 0.59, high: 0.61, basis: 'calculator', providers: 2 },
  MO: { low: 0.54, high: 0.75, basis: 'calculator', providers: 2 },
  HI: { low: 1.89, high: 2.39, basis: 'published', providers: 2 },
  AK: { low: 0.39, high: 0.77, basis: 'published', providers: 2 },
  DC: { low: 0.71, high: 1.06, basis: 'published', providers: 2 },
  CT: { low: 0.77, high: 1.64, basis: 'published', providers: 2 },

  // Single-evidence-point states: basis stays 'inferred' (pooled high), but
  // the LOW is capped at the observed point whenever that point sits below
  // the pooled low — evidence that reduces claimed savings never waits for
  // more providers (anti-inflation rule). Point sources: First American
  // direct API @$500k except OR (FA scaling schedule).
  NM: { low: 0.44, high: 1.4, basis: 'inferred' },
  MN: { low: 0.46, high: 1.4, basis: 'inferred' },
  WY: { low: 0.27, high: 1.4, basis: 'inferred' },
  NJ: { low: 0.7, high: 1.4, basis: 'inferred' },
  MI: { low: 0.85, high: 1.4, basis: 'inferred' },
  CO: { low: 0.94, high: 1.4, basis: 'inferred' },
  OR: { low: 0.8, high: 1.4, basis: 'inferred' },
  // NC has published evidence (buyer stack $1,175, one provider) but our own
  // NC service denominator couldn't be measured (upstream 500s) — inferred
  // band until the denominator lands and the ratio can be computed.
}

// Refinance-specific overrides. Refi service fees are a different market
// than purchase (FA's schedules run lower and flatter on refi), and our own
// refi fees differ too — so refi ratios are computed from refi evidence
// against our refi service stacks, never assumed equal to purchase.
// A state without a refi override falls back to its purchase band.
//
// July 24: single-point refi evidence (FA direct API @$400k loan; GA from
// Campbell & Brannon's published refi schedule) mandates DOWNWARD overrides
// wherever the refi ratio sits below the purchase band's low — refi is a
// cheaper, flatter market and the purchase band would overstate savings
// (IL: Chicago refi closing $325 vs $2,200 purchase). Single points never
// push a band UP (CT/ID/WA refi evidence above purchase band is parked
// until a second provider corroborates). Highs bounded at min(purchase
// high, 1.6 × the observed point).
const SERVICE_BANDS_REFI: Record<string, ServiceBand> = {
  CA: { low: 1.37, high: 2.19, basis: 'calculator', providers: 1 },
  GA: { low: 1.0, high: 1.2, basis: 'published', providers: 1 },
  IL: { low: 0.57, high: 0.91, basis: 'calculator', providers: 1 },
  MI: { low: 0.39, high: 0.62, basis: 'calculator', providers: 1 },
  MO: { low: 0.48, high: 0.75, basis: 'calculator', providers: 1 },
  OH: { low: 0.5, high: 0.8, basis: 'calculator', providers: 1 },
  OR: { low: 0.79, high: 1.26, basis: 'calculator', providers: 1 },
}

export function serviceBandFor(
  state: string | undefined | null,
  mode: 'purchase' | 'refinance' = 'purchase',
): ServiceBand {
  const code = resolveStateCode(state)
  if (!code) return INFERRED_SERVICE_BAND
  if (mode === 'refinance' && SERVICE_BANDS_REFI[code]) return SERVICE_BANDS_REFI[code]
  return SERVICE_BANDS[code] ?? INFERRED_SERVICE_BAND
}
