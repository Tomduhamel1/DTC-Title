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

// Per-state rate overrides (fraction of combined policy premium). A state
// not listed here uses BUCKS_RATE. Shown per state on /admin/states.
export const BUCKS_RATE_BY_STATE: Record<string, number> = {
  // Tom, 2026-08-11: RI rebate raised to 20%.
  RI: 0.2,
}

// Compliance gate — states where the credit is withheld.
// A credit whose AMOUNT derives from the premium is structurally exposed
// wherever premium rebating/inducement is prohibited, regardless of
// labeling. Verified-strict states are excluded here; bureau-uniform states
// (PA/NJ/OH/DE/NC) and filed states remain ON pending counsel review
// (tracked in ISSUES.md).
//
// FL (Tom, 2026-08-13): promulgated premium + strict anti-rebating law.
//   FL competes through BetterClose's own $195 settlement fee instead
//   (betterCloseFees.ts) — premium always charged in full.
// TX (2026-08-14): promulgated; Ins. Code §2502.051 + TDI Procedural Rule
//   P-53 prohibit rebates/discounts on title business.
// NM (2026-08-14): promulgated regime — same structure as FL/TX; statute
//   cite for counsel to confirm.
// NY (2026-08-14): Ins. Law §6409(d) — no rebate or "any consideration or
//   valuable thing" as inducement for title business, directly or
//   indirectly; DFS reads it broadly.
export const BUCKS_EXCLUDED_STATES: Set<string> = new Set(['FL', 'TX', 'NM', 'NY'])

/** Effective Bucks rate in a state (0 when excluded). */
export function bucksRateFor(stateCode?: string): number {
  const st = stateCode?.toUpperCase()
  if (st && BUCKS_EXCLUDED_STATES.has(st)) return 0
  if (st && BUCKS_RATE_BY_STATE[st] !== undefined) return BUCKS_RATE_BY_STATE[st]
  return BUCKS_RATE
}

// Owner's + lender's policies. Deliberately does NOT match CPL
// ("Closing Protection Letter") or endorsements.
const POLICY_LINE = /title insurance/i

export function betterCloseBucksLine(
  lineItems: FeeLineItem[],
  stateCode?: string,
): FeeLineItem | null {
  const rate = bucksRateFor(stateCode)
  if (rate <= 0) return null
  const policyTotal = lineItems
    .filter((li) => !li.isCredit && POLICY_LINE.test(li.label))
    .reduce((sum, li) => sum + li.ourCost, 0)
  const amount = Math.round(policyTotal * rate)
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
