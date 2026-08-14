// BetterClose's own service-charge schedule.
//
// The upstream FNTE calculator (elendCalc.ts) returns FNTE's fee schedule.
// Entries here replace the amount on matching SERVICE lines only — title
// premiums, CPL, endorsements, recording fees, and transfer taxes are never
// overridden (filed rates / government pass-throughs), enforced at the call
// site in elendCalc.ts.
//
// Matching is by normalized fee label (the label after elendCalc's
// cleanDescription), case-insensitive. State entries win over `default`.
// A value may be a flat number, or split by transaction type.
// An override of 0 removes the line entirely (BetterClose doesn't charge it).
//
// The table ships empty: until fees are entered, quotes show FNTE's amounts
// unchanged. Example:
//
//   default: {
//     'Settlement Fee': 350,
//     'Notary Fee': { purchase: 150, refinance: 100 },
//   },
//   byState: {
//     FL: { 'Settlement Fee': 425 },
//   },

export type FeeAmount = number | { purchase?: number; refinance?: number }

export interface BetterCloseFeeTable {
  default: Record<string, FeeAmount>
  byState: Record<string, Record<string, FeeAmount>>
}

export const BETTERCLOSE_SERVICE_FEES: BetterCloseFeeTable = {
  default: {},
  byState: {
    // Tom, 2026-07-30: BetterClose RI settlement fee $250 (purchase and refi).
    RI: { 'Settlement Fee': 250 },
    // Tom, 2026-08-13: FL settlement fee $195 (purchase and refi). Part of
    // the FL compliance posture: full promulgated premium always charged;
    // we compete on our own service fee instead of any premium-derived
    // credit (FL is in BUCKS_EXCLUDED_STATES — see betterCloseBucks.ts).
    // $195 was chosen to stay clear of below-cost-inducement territory
    // (blended direct vendor costs ~$85–135/file per the FL actuals recon);
    // counsel confirmation of the number remains the launch gate for
    // FL-specific advertising claims.
    FL: { 'Settlement Fee': 195 },
    // Tom, 2026-08-14: FL treatment extended "relatively speaking" to the
    // other Bucks-excluded states. Calibration rule (documented for team
    // review, ISSUES.md): target our comparable service stack at ~56% of
    // the state's evidenced market low (FL's landing: $345/$615), with
    // $195 as the floor — the same counsel-gated below-cost basis as FL.
    // TX: floor binds ($345 stack vs $462 market low). NY: floor binds
    // ($345 vs Tier One's real $574). NM: rule gives $295 ($475 stack vs
    // First American's $834; NM evidence is a single point — flagged).
    TX: { 'Settlement Fee': 195 },
    NY: { 'Settlement Fee': 195 },
    NM: { 'Settlement Fee': 295 },
  },
}

function resolveAmount(
  value: FeeAmount | undefined,
  transactionType: 'purchase' | 'refinance',
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return value[transactionType]
}

function lookupLabel(
  table: Record<string, FeeAmount> | undefined,
  label: string,
): FeeAmount | undefined {
  if (!table) return undefined
  const wanted = label.toLowerCase()
  for (const [key, value] of Object.entries(table)) {
    if (key.toLowerCase() === wanted) return value
  }
  return undefined
}

// ── Lines the upstream calculator OMITS but we actually bill ──────────────
// Discovered 2026-08-12 (Tom, via a Liberty Title side-by-side): the FNTE
// calculator returns the title-search line on PURCHASE quotes but silently
// drops it on REFINANCE quotes in every probed state — while the search IS
// billed separately at closing. An estimate must never hide a real charge,
// so these lines are ADDED to the quote when the upstream omits them.
// Fill per state as Tom/FNTE confirm the refi search amounts from the
// master fee schedule; states not listed keep the (incomplete) upstream
// response and are flagged on /admin/states.
export interface EnsuredLine {
  label: string
  amount: number
}

export const ENSURE_LINES: Record<
  string,
  Partial<Record<'purchase' | 'refinance', EnsuredLine[]>>
> = {
  // Filled 2026-08-12 from the master schedule itself (DynamoDB table
  // eLEND_public_calc, scanned read-only): AbstractorTitleSearchREFI is
  // unpopulated for EVERY state, and the Lambda suppresses the purchase-side
  // AbstractorTitleSearch on refis with no fallback — so each state's refi
  // search line is restored here at the schedule's own purchase amount
  // (pattern confirmed by Tom for RI: refi search = purchase search = $100).
  // Empty entries mean VERIFIED: the schedule defines no search-type fee for
  // that state, nothing is missing. When FNTE populates the REFI column
  // upstream, the dedupe in elendCalc makes these entries harmless no-ops.
  AK: { refinance: [{ label: 'Abstractor Title Search', amount: 180 }] },
  AL: { refinance: [{ label: 'Abstractor Title Search', amount: 295 }] },
  AR: { refinance: [{ label: 'Abstractor Title Search', amount: 295 }] },
  AZ: { refinance: [{ label: 'Abstractor Title Search', amount: 250 }] },
  CA: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  CO: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  CT: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  DC: { refinance: [{ label: 'Abstractor Title Search', amount: 250 }] },
  DE: { refinance: [{ label: 'Abstractor Title Search', amount: 150 }] },
  FL: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  GA: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  HI: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  IA: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  ID: { refinance: [{ label: 'Abstractor Title Search', amount: 375 }] },
  IL: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  IN: { refinance: [{ label: 'Abstractor Title Search', amount: 150 }] },
  KS: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  KY: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  LA: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  MA: { refinance: [{ label: 'Abstractor Title Search', amount: 300 }] },
  MD: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
  ME: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
  MI: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  MN: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  MO: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  MS: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  MT: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  NC: { refinance: [{ label: 'Abstractor Title Search', amount: 50 }] },
  ND: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  NE: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  NH: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  NJ: { refinance: [{ label: 'Abstractor Title Search', amount: 250 }] },
  NM: { refinance: [{ label: 'Abstractor Title Search', amount: 30 }] },
  NV: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  NY: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  OH: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  OK: { refinance: [{ label: 'Abstractor Title Search', amount: 725 }] },
  OR: { refinance: [{ label: 'Abstractor Title Search', amount: 150 }] },
  PA: { refinance: [{ label: 'Abstractor Title Search', amount: 50 }] },
  RI: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
  SC: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  SD: { refinance: [{ label: 'Abstractor Title Search', amount: 18 }] },
  TN: { refinance: [{ label: 'Abstractor Title Search', amount: 350 }] },
  TX: { refinance: [{ label: 'Abstractor Title Search', amount: 150 }] },
  UT: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  VA: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
  VT: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  WA: { refinance: [{ label: 'Abstractor Title Search', amount: 50 }] },
  WI: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
  WV: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
  WY: { refinance: [] }, // schedule has no search-type refi gap — verified vs eLEND_public_calc 2026-08-12
}

export function ensuredLinesFor(
  stateCode: string | undefined,
  mode: 'purchase' | 'refinance',
): EnsuredLine[] {
  if (!stateCode) return []
  return ENSURE_LINES[stateCode.toUpperCase()]?.[mode] ?? []
}

export function betterCloseServiceFee(
  label: string,
  stateCode: string | undefined,
  transactionType: 'purchase' | 'refinance',
): number | undefined {
  const st = stateCode?.toUpperCase()
  const stateHit = st
    ? resolveAmount(lookupLabel(BETTERCLOSE_SERVICE_FEES.byState[st], label), transactionType)
    : undefined
  if (stateHit !== undefined) return stateHit
  return resolveAmount(lookupLabel(BETTERCLOSE_SERVICE_FEES.default, label), transactionType)
}
