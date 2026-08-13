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
  // RI refi search $100 — same as the purchase-quote line the upstream
  // already returns (assumption flagged to Tom; correct here if the master
  // schedule prices refi search differently).
  RI: { refinance: [{ label: 'Abstractor Title Search', amount: 100 }] },
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
