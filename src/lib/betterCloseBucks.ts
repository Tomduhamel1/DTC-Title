// BetterClose Bucks — introductory promotional credit applied to every quote.
//
// Amount: BUCKS_RATE × the combined title policy premium on the quote
// (owner's + lender's title insurance; CPL and all other lines excluded).
// Rendered as its own credit line ("BetterClose Bucks"), NOT as a change to
// any policy premium: premiums always display at their full filed amounts.
// The credit lowers the quote total and counts dollar-for-dollar toward
// "save at closing" (computeTotals) — the market comparison range is never
// reduced by it, since other providers don't offer the credit.
//
// COMPLIANCE (flagged to Tom 2026-07-30): because the amount is derived from
// premium, state insurance regulators may treat this as premium rebating
// regardless of labeling. Rebate rules vary by state — counsel should confirm
// permissibility per state. BUCKS_EXCLUDED_STATES is the gate: add state
// codes there to withhold the credit in those states (empty per Tom's
// instruction to apply it to every quote).

import type { FeeLineItem } from './feeReport'

export const BUCKS_RATE = 0.15
export const BUCKS_LABEL = 'BetterClose Bucks'
export const BUCKS_LINE_ID = 'betterclose-bucks'

// Compliance gate — states where the credit is withheld. Empty = everywhere.
export const BUCKS_EXCLUDED_STATES: Set<string> = new Set()

// Owner's + lender's policies. Deliberately does NOT match CPL
// ("Closing Protection Letter") or endorsements.
const POLICY_LINE = /title insurance/i

export function betterCloseBucksLine(
  lineItems: FeeLineItem[],
  stateCode?: string,
): FeeLineItem | null {
  if (stateCode && BUCKS_EXCLUDED_STATES.has(stateCode.toUpperCase())) return null
  const policyTotal = lineItems
    .filter((li) => !li.isCredit && POLICY_LINE.test(li.label))
    .reduce((sum, li) => sum + li.ourCost, 0)
  const amount = Math.round(policyTotal * BUCKS_RATE)
  if (amount <= 0) return null
  return {
    id: BUCKS_LINE_ID,
    label: BUCKS_LABEL,
    category: 'other',
    ourCost: -amount,
    isFixed: false,
    isCredit: true,
    description: 'Introductory BetterClose credit, applied at closing.',
  }
}
