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
// Comparison provenance lives on the bands themselves
// (marketBaseline.ts ServiceBand.lowSource) — one source of truth.
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
  AK: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  AL: { offer: { purchase: true, refinance: true } },
  AR: { offer: { purchase: true, refinance: true } },
  AZ: { offer: { purchase: true, refinance: true } },
  CA: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  CO: { offer: { purchase: true, refinance: true } },
  CT: { offer: { purchase: true, refinance: true } },
  DC: { offer: { purchase: false, refinance: false }, availabilityNote: 'Not on the license page (direct or workshare) — confirm before enabling' },
  DE: { offer: { purchase: true, refinance: true } },
  FL: { offer: { purchase: true, refinance: true } },
  GA: { offer: { purchase: true, refinance: true } },
  HI: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  IA: { offer: { purchase: true, refinance: true } },
  ID: { offer: { purchase: true, refinance: true } },
  IL: { offer: { purchase: true, refinance: true } },
  IN: { offer: { purchase: true, refinance: true } },
  KS: { offer: { purchase: true, refinance: true } },
  KY: { offer: { purchase: true, refinance: true } },
  LA: { offer: { purchase: true, refinance: true } },
  MA: { offer: { purchase: true, refinance: true } },
  MD: { offer: { purchase: true, refinance: true } },
  ME: { offer: { purchase: true, refinance: true } },
  MI: { offer: { purchase: true, refinance: true } },
  MN: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  MO: { offer: { purchase: true, refinance: true } },
  MS: { offer: { purchase: true, refinance: true } },
  MT: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NC: { offer: { purchase: true, refinance: true } },
  ND: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NE: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NH: { offer: { purchase: true, refinance: true } },
  NJ: { offer: { purchase: true, refinance: true } },
  NM: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NV: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  NY: { offer: { purchase: true, refinance: true } },
  OH: { offer: { purchase: true, refinance: true } },
  OK: { offer: { purchase: true, refinance: true } },
  OR: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  PA: { offer: { purchase: true, refinance: true } },
  RI: { offer: { purchase: true, refinance: true } },
  SC: { offer: { purchase: true, refinance: true } },
  SD: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  TN: { offer: { purchase: true, refinance: true } },
  TX: { offer: { purchase: true, refinance: true } },
  UT: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  VA: { offer: { purchase: true, refinance: true } },
  VT: { offer: { purchase: true, refinance: true } },
  WA: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  WI: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  WV: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
  WY: { offer: { purchase: false, refinance: false }, availabilityNote: 'Workshare state — OFF pending review (Tom, 2026-08-10)' },
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
