// MASTER STATES DOCUMENT — service availability + comp provenance + notes.
//
// This is the single source of truth for WHERE BetterClose offers service.
// The quote engine enforces it (elendCalc backstop + pre-flight route gates):
// a customer in an OFF state/mode gets "BetterClose doesn't currently offer
// closings in {State}" instead of a quote. Marketing surfaces (hero,
// calculators) fall back to national numbers for OFF states.
//
// Seeded 2026-08-10 per Tom's allowlist decision:
//   - 34 direct-license states (src/app/licenses/page.tsx): ON
//   - 16 workshare states: OFF pending Tom's review
//   - DC: on neither license list — OFF until confirmed
// marketLowSource strings converted from docs/STATE_MASTER_VS_FNTE.csv
// (REAL vs SYNTHETIC provenance); RI from Liberty Title (Tom, 2026-07-30).
//
// Numeric levers live elsewhere (this module holds none of them):
//   comparison bands  -> src/lib/marketBaseline.ts
//   fee overrides     -> src/lib/betterCloseFees.ts
//   Bucks rate/gate   -> src/lib/betterCloseBucks.ts
//   underwriter splits-> src/lib/underwriterSplits.ts
// The /admin/states console aggregates all of them.
//
// Keep this module dependency-free (client+server safe, no cycles).

export interface StateOffer {
  purchase: boolean
  refinance: boolean
}

export interface StateMasterEntry {
  offer: StateOffer
  // County names (as the upstream calculator spells them) where service is
  // withheld even though the state is ON. Case-insensitive match.
  excludedCounties?: string[]
  // Internal note — never shown to customers.
  availabilityNote?: string
  // Provenance of the market-low comparison (REAL provider vs SYNTHETIC).
  marketLowSource?: string
  notes?: string
}

export class ServiceNotOfferedError extends Error {
  readonly notOffered = true
  constructor(
    readonly stateCode: string,
    readonly mode: 'purchase' | 'refinance',
    readonly county?: string,
  ) {
    super(
      `BetterClose doesn't currently offer ${
        mode === 'refinance' ? 'refinance closings' : 'closings'
      } in ${STATE_NAMES[stateCode] ?? stateCode}${county ? ` (${county} County)` : ''}.`,
    )
    this.name = 'ServiceNotOfferedError'
  }
}

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington, D.C.',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

export const STATE_MASTER: Record<string, StateMasterEntry> = {
  AK: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL: First American (API) $650 buyer-side' },
  AL: { offer: { purchase: true, refinance: true } },
  AR: { offer: { purchase: true, refinance: true } },
  AZ: { offer: { purchase: true, refinance: true } },
  CA: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'P: REAL (split-adjusted): Pacific Coast Title $1,530 = half of filed $2,500 sale escrow + $280 loan fee (side split unpublished) | R: REAL: First American (API) refi $685' },
  CO: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL (cap point): First American (API) $685' },
  CT: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL: Law Office of Yona Gregory $750 flat attorney fee (their search billed separately, unpriced)' },
  DC: { offer: { purchase: false, refinance: false }, availabilityNote: 'Not on the license page (direct or workshare) — confirm before enabling', marketLowSource: 'REAL (range-lows): Avenue Title $730 = published range minimums (settlement 550 + search 150 + CPL 30)' },
  DE: { offer: { purchase: true, refinance: true } },
  FL: { offer: { purchase: true, refinance: true }, marketLowSource: 'SYNTHETIC P25 of 6; nearest real: First American $595 bundled closing-services fee' },
  GA: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: REAL: Wilson Pruitt $1,100 = closing 775 + exam 250 + CPL 75 | R: REAL: Campbell & Brannon refi $475 + exam 75' },
  HI: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL: Title Guaranty of Hawaii $1,125 = published buyer half of $2,250 escrow fee' },
  IA: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL: Hastings & Gartin $850 = closing 600 + title opinion 250 (single provider)' },
  ID: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL: First American (API) $700 buyer-side (DOI-filed schedules held pending split resolution)' },
  IL: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: REAL: Greater Illinois Title $1,925 = closing 1,880 + email pkg 45 (Chicago metro; downstate low = TitleStar ~$635) | R: REAL: First American (API) refi $325' },
  IN: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: n/a | R: n/a' },
  KS: { offer: { purchase: true, refinance: true }, marketLowSource: 'SYNTHETIC P25 of 13; nearest real: Secured Title of KC $450 = closing 375 + coordination 75' },
  KY: { offer: { purchase: true, refinance: true } },
  LA: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: none — no in-state provider observed (pooled band) | R: n/a' },
  MA: { offer: { purchase: true, refinance: true } },
  MD: { offer: { purchase: true, refinance: true } },
  ME: { offer: { purchase: true, refinance: true } },
  MI: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: REAL (cap point): First American (API) $595 | R: REAL: First American (API) refi $195' },
  MN: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL (cap point): First American (API) $325' },
  MO: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: REAL: First American (API) $395 buyer-side | R: REAL: First American (API) refi $250' },
  MS: { offer: { purchase: true, refinance: true } },
  MT: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL: First Montana Title $800 explicit buyer side' },
  NC: { offer: { purchase: true, refinance: true }, marketLowSource: 'n/a' },
  ND: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NE: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NH: { offer: { purchase: true, refinance: true } },
  NJ: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL (cap point): First American (API) $525' },
  NM: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL (cap point): First American (API) $834' },
  NV: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL: First American (API) $695 buyer-side' },
  NY: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL: Tier One Settlement $574 = settlement 500 + admin 50 + Encompass 24' },
  OH: { offer: { purchase: true, refinance: true }, marketLowSource: 'P: REAL: Landmark Title $265 = closing 200 + delivery 50 + CertifID 15 | R: REAL: First American (API) refi $250' },
  OK: { offer: { purchase: true, refinance: true }, marketLowSource: 'REAL: First American (API) $395 buyer-side (their exam/search treated as included — conservative)' },
  OR: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'P: REAL (cap point): First American (API) $1,200 | R: REAL: First American (API) refi $395' },
  PA: { offer: { purchase: true, refinance: true } },
  RI: { offer: { purchase: true, refinance: true }, marketLowSource: 'Liberty Title (RI) quotes via Tom, 2026-07-30 — lowest full stack $690 purchase / $590 refi' },
  SC: { offer: { purchase: true, refinance: true } },
  SD: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  TN: { offer: { purchase: true, refinance: true } },
  TX: { offer: { purchase: true, refinance: true }, marketLowSource: 'SYNTHETIC P25 of 5; nearest real: Texas National Title $450 escrow (per-side proxy from seller worksheet)' },
  UT: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL: First American (API) $415 buyer-side' },
  VA: { offer: { purchase: true, refinance: true } },
  VT: { offer: { purchase: true, refinance: true } },
  WA: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'SYNTHETIC P25 of 6; nearest real: Spokane County Title $850 per side' },
  WI: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  WV: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  WY: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)', marketLowSource: 'REAL (cap point): First American (API) $225' },
}

// Unknown/unlisted state codes are NOT offered (allowlist posture).
export function stateOffered(
  stateCode: string | undefined | null,
  mode: 'purchase' | 'refinance',
): boolean {
  if (!stateCode) return true // unknown state: fail open, backstop re-checks with real data
  const entry = STATE_MASTER[stateCode.toUpperCase()]
  if (!entry) return false
  return entry.offer[mode]
}

export function countyExcluded(
  stateCode: string | undefined | null,
  county: string | undefined | null,
): boolean {
  if (!stateCode || !county) return false
  const entry = STATE_MASTER[stateCode.toUpperCase()]
  if (!entry?.excludedCounties?.length) return false
  const c = county.toLowerCase().replace(/\s+county$/i, '').trim()
  return entry.excludedCounties.some(
    (x) => x.toLowerCase().replace(/\s+county$/i, '').trim() === c,
  )
}

// Throwing variant used by the engine backstop.
export function assertServiceOffered(
  stateCode: string | undefined | null,
  mode: 'purchase' | 'refinance',
  county?: string | null,
): void {
  if (!stateCode) return // upstream omitted state — don't block the quote
  const code = stateCode.toUpperCase()
  if (!stateOffered(code, mode)) throw new ServiceNotOfferedError(code, mode)
  if (countyExcluded(code, county)) throw new ServiceNotOfferedError(code, mode, county ?? undefined)
}
