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
// PREMIUM COMPARISON POLICY (Tom, 2026-08-10): title insurance premiums are
// roughly equal across competitors in EVERY state — filed states included —
// so premium lines are never compared and never counted toward savings,
// anywhere. (The former PREMIUM_RANGE_FILED ×1.25–1.9 interim multiplier is
// retired; it had no evidence behind it.) The regime map below now serves
// one purpose: uniform-rate states label premiums "Set by {state}" in the
// UI, while filed states simply show no comparison.

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
 * True when title insurance premiums in this state are set identically by
 * statute/bureau (promulgated or bureau-uniform). Premiums are never compared
 * or counted toward savings in ANY state (see policy note at top of file) —
 * this now only drives the "Set by {state}" premium label in the UI.
 */
export function premiumsAreUniform(stateCode: string | undefined | null): boolean {
  return premiumRegimeFor(stateCode) !== 'filed'
}

export interface ComparisonRange {
  low: number
  high: number
}

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
  // Evidence class, strongest first:
  //   'published'  — filed/published fee schedules
  //   'calculator' — quotes harvested from providers' public calculators
  //   'quoted'     — actual quotes we obtained from a competing provider
  //   'inferred'   — pooled median band from evidenced states
  basis: 'published' | 'calculator' | 'quoted' | 'inferred'
  // Number of distinct providers behind a non-inferred band.
  providers?: number
  // Human-readable derivation of the LOW end — the number every savings
  // claim is measured against. Shown on /admin/states so each state's
  // comparison can be audited and improved. Absent = pooled inferred band
  // with no in-state evidence.
  lowSource?: string
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
// July 24 boundary audit: every band re-derived under ONE symmetric stack
// convention (provider-controlled service charges; government fees,
// premiums, explicit pass-throughs, recording-service handling, and
// optional add-ons excluded on BOTH sides; per-state search/abstract
// treatment aligned to the state's market convention with the
// lower-savings tiebreak; disclosure gaps recorded as bundlingUnknowns in
// the audit output, silence treated as included = conservative).
// Notable judgment calls, documented:
//  - CA: WFG/PCT filed sale-escrow fees don't publish a buyer/seller split;
//    halved (conservative). FA's explicit buyer-side $1,750 anchors the low.
//  - ID: NOT raised despite nine DOI-filed schedules at $1,650–1,750 — FA's
//    buyer-side $700 implies those filed fees are whole-transaction and
//    split by custom; band stays FA-anchored until the split is resolved
//    (resolution would roughly double ID's claimable savings).
//  - IA: single full-service provider — point band, flagged.
//  - IL: Chicago-metro band; downstate handled separately below.
const SERVICE_BANDS: Record<string, ServiceBand> = {
  CA: { low: 2.19, high: 2.5, basis: 'published', providers: 3, lowSource: 'REAL (split-adjusted): Pacific Coast Title $1,530 = half of filed $2,500 sale escrow + $280 loan fee (side split unpublished)' },
  GA: { low: 1.0, high: 1.2, basis: 'published', providers: 2, lowSource: 'REAL: Wilson Pruitt $1,100 = closing 775 + exam 250 + CPL 75' },
  WA: { low: 1.42, high: 2.17, basis: 'published', providers: 6, lowSource: 'SYNTHETIC P25 of 6; nearest real: Spokane County Title $850 per side' },
  ID: { low: 0.77, high: 0.89, basis: 'published', providers: 9, lowSource: 'REAL: First American (API) $700 buyer-side (DOI-filed schedules held pending split resolution)' },
  IA: { low: 0.74, high: 0.74, basis: 'published', providers: 1, lowSource: 'REAL: Hastings & Gartin $850 = closing 600 + title opinion 250 (single provider)' },
  IL: { low: 2.93, high: 3.15, basis: 'published', providers: 8, lowSource: 'REAL: Greater Illinois Title $1,925 = closing 1,880 + email pkg 45 (Chicago metro; downstate low = TitleStar ~$635)' },
  KS: { low: 0.61, high: 0.93, basis: 'published', providers: 13, lowSource: 'SYNTHETIC P25 of 13; nearest real: Secured Title of KC $450 = closing 375 + coordination 75' },
  MT: { low: 1.14, high: 1.43, basis: 'published', providers: 2, lowSource: 'REAL: First Montana Title $800 explicit buyer side' },
  OK: { low: 0.24, high: 0.94, basis: 'published', providers: 3, lowSource: 'REAL: First American (API) $395 buyer-side (their exam/search treated as included — conservative)' },
  TX: { low: 0.66, high: 1.14, basis: 'published', providers: 5, lowSource: 'SYNTHETIC P25 of 5; nearest real: Texas National Title $450 escrow (per-side proxy from seller worksheet)' },
  FL: { low: 0.88, high: 1.12, basis: 'published', providers: 6, lowSource: 'SYNTHETIC P25 of 6; nearest real: First American $595 bundled closing-services fee' },
  NY: { low: 0.82, high: 2.14, basis: 'published', providers: 2, lowSource: 'REAL: Tier One Settlement $574 = settlement 500 + admin 50 + Encompass 24' },

  // ── July 24 second wave: calculator/API evidence (FA direct API + Old
  // Republic harvest + late-extracted published schedules). n=2 states use
  // min–max of the two observed buyer-side stacks ÷ our service total.
  OH: { low: 0.6, high: 1.26, basis: 'calculator', providers: 3, lowSource: 'REAL: Landmark Title $265 = closing 200 + delivery 50 + CertifID 15' },
  NV: { low: 0.48, high: 0.51, basis: 'calculator', providers: 2, lowSource: 'REAL: First American (API) $695 buyer-side' },
  UT: { low: 0.59, high: 0.6, basis: 'calculator', providers: 2, lowSource: 'REAL: First American (API) $415 buyer-side' },
  MO: { low: 0.54, high: 0.75, basis: 'calculator', providers: 2, lowSource: 'REAL: First American (API) $395 buyer-side' },
  HI: { low: 1.89, high: 2.39, basis: 'published', providers: 3, lowSource: 'REAL: Title Guaranty of Hawaii $1,125 = published buyer half of $2,250 escrow fee' },
  AK: { low: 0.42, high: 0.77, basis: 'published', providers: 2, lowSource: 'REAL: First American (API) $650 buyer-side' },
  DC: { low: 0.61, high: 1.06, basis: 'published', providers: 2, lowSource: 'REAL (range-lows): Avenue Title $730 = published range minimums (settlement 550 + search 150 + CPL 30)' },
  CT: { low: 0.68, high: 1.14, basis: 'published', providers: 3, lowSource: 'REAL: Law Office of Yona Gregory $750 flat attorney fee (their search billed separately, unpriced)' },

  // Single-evidence-point states: basis stays 'inferred' (pooled high), but
  // the LOW is capped at the observed point whenever that point sits below
  // the pooled low — evidence that reduces claimed savings never waits for
  // more providers (anti-inflation rule). Point sources: First American
  // direct API @$500k except OR (FA scaling schedule).
  NM: { low: 0.44, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $834' },
  MN: { low: 0.46, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $325' },
  WY: { low: 0.27, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $225' },
  NJ: { low: 0.7, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $525' },
  MI: { low: 0.85, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $595' },
  CO: { low: 0.94, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $685' },
  OR: { low: 0.8, high: 1.4, basis: 'inferred', lowSource: 'REAL (cap point): First American (API) $1,200' },
  // NC has published evidence (buyer stack $1,175, one provider) but our own
  // NC service denominator couldn't be measured (upstream 500s) — inferred
  // band until the denominator lands and the ratio can be computed.

  // RI: owner-supplied market low (Tom, 2026-07-30; quotes from Liberty
  // Title, RI) — lowest observed RI buyer-side full service stack $690
  // purchase / $590 refi. Ratio vs our RI stack at the anchor scenario incl.
  // the BetterClose $250 settlement fee (betterCloseFees.ts):
  // $690 / $550 = 1.25 (kept at 2dp, conservative).
  // Single evidence point → pooled high, providers: 1. Basis stays
  // 'inferred' until the Liberty Title quote documents are archived under
  // data/market-fees/ (then 'calculator', providers: 1).
  // Full-precision ratio so the quote shows Tom's exact delta: $690 − $550 = $140.
  RI: { low: 690 / 550, high: 1.4, basis: 'quoted', providers: 1, lowSource: 'Liberty Title (RI) purchase quote: $690 full buyer-side stack (incl. their itemized search) vs our $550 stack (incl. our $100 search) — exact $140 delta (Tom 2026-07-30; composition verified 2026-08-12)' },
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
  // RI: owner-supplied market low $590 refi full stack (Liberty Title — see
  // purchase note): $590 / $450 refi stack = 1.31; high bounded at the
  // purchase high.
  // Full stacks both sides (composition verified against Liberty's itemized
  // quote 2026-08-12): $690 − $550 = $140 exact.
  RI: { low: 690 / 550, high: 1.4, basis: 'quoted', providers: 1, lowSource: 'Liberty Title (RI) refi quote 2026-08-12: $495 settlement + $195 itemized search = $690, vs our full $550 stack (settlement $250 + search $100 + notary $150 + attorney $50) — exact $140 delta' },
  CA: { low: 1.37, high: 2.19, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $685' },
  GA: { low: 1.0, high: 1.2, basis: 'published', providers: 1, lowSource: 'REAL: Campbell & Brannon refi $475 + exam 75' },
  IL: { low: 0.57, high: 0.91, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $325' },
  MI: { low: 0.39, high: 0.62, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $195' },
  MO: { low: 0.48, high: 0.75, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $250' },
  OH: { low: 0.5, high: 0.8, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $250' },
  OR: { low: 0.79, high: 1.26, basis: 'calculator', providers: 1, lowSource: 'REAL: First American (API) refi $395' },
}

// Illinois is two markets: the Chicago-metro published floor is ~$1,950–
// $2,400 while downstate closing fees run ~$600 (TitleStar downstate
// schedules). One statewide band would overstate downstate savings or
// understate Chicago. ZIPs 600xx–608xx (city + collar) get the metro band;
// everything else gets a downstate band capped at the single downstate
// observation (anti-inflation, n=1).
const IL_DOWNSTATE_BAND: ServiceBand = { low: 0.85, high: 1.4, basis: 'inferred', providers: 1 }
const IL_METRO_ZIP = /^60[0-8]/

// In states whose market bills search/abstract work as a third-party
// pass-through while we bill it as our own line, the audit aligned both
// sides by EXCLUDING search-type charges. The engine must apply the same
// boundary at quote time: our search/exam/abstract lines in these states
// carry no market comparison (no savings claimed on them).
export const SEARCH_PASSTHROUGH_STATES = new Set(['CA', 'FL', 'HI', 'IL', 'NY', 'TX', 'WA'])
// Oklahoma: only ABSTRACT charges are pass-through; exam/opinion stays
// comparable (both we and the OK market bill exam/opinion as own charges).
export const ABSTRACT_ONLY_PASSTHROUGH_STATES = new Set(['OK'])

export function serviceBandFor(
  state: string | undefined | null,
  mode: 'purchase' | 'refinance' = 'purchase',
  zip?: string,
): ServiceBand {
  const code = resolveStateCode(state)
  if (!code) return INFERRED_SERVICE_BAND
  if (mode === 'refinance' && SERVICE_BANDS_REFI[code]) return SERVICE_BANDS_REFI[code]
  if (code === 'IL' && zip && !IL_METRO_ZIP.test(zip)) return IL_DOWNSTATE_BAND
  return SERVICE_BANDS[code] ?? INFERRED_SERVICE_BAND
}
