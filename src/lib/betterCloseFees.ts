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
  byState: {},
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
