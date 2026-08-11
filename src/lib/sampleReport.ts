// State-aware SAMPLE fee report for marketing previews (homepage "See every
// fee, line by line"). Separate module because it needs both feeReport and
// marketBaseline (feeReport itself cannot import marketBaseline — cycle via
// stateSavings).
//
// The line items and our-cost dollars are ILLUSTRATIVE (labeled "Sample
// report" in the UI); what IS state-accurate is the comparison logic:
//  - premium lines are never compared in any state (roughly equal across
//    providers — policy note in marketBaseline.ts); uniform-rate states
//    additionally show "Set by {state}";
//  - service lines use the state's evidence-derived service band
//    (published / calculator / inferred — same bands as real quotes).

import type { FeeLineItem, FeeReport } from './feeReport'
import { premiumsAreUniform, serviceBandFor } from './marketBaseline'
import { resolveStateCode } from './stateSavings'

const round = Math.round

export function buildSampleFeeReport(state?: string | null): FeeReport {
  const code = resolveStateCode(state) ?? 'GA'
  const uniform = premiumsAreUniform(code)
  const band = serviceBandFor(code)

  // Premiums are never compared (roughly equal across providers everywhere);
  // uniform-rate states get the "Set by {state}" label.
  const premium = (id: string, label: string, ourCost: number): FeeLineItem =>
    uniform
      ? {
          id,
          label,
          category: 'title-settlement',
          ourCost,
          isFixed: true,
          feeSource: 'state',
          savingsSource: 'pass_through',
        }
      : {
          id,
          label,
          category: 'title-settlement',
          ourCost,
          isFixed: true,
          feeSource: 'underwriter',
          savingsSource: 'title_related',
          description: 'A-rated underwriter coverage',
        }

  // Market-comparison model (2026-08-11): the whole verified package delta
  // sits on the settlement line; other service lines are shown at parity
  // (typical low = our price, no claimed savings). Mirrors elendCalc's
  // applyMarketComparison for the sample's two service lines.
  const SETTLEMENT = 350
  const NOTARY = 150
  const stackTotal = SETTLEMENT + NOTARY
  const lowExtra = Math.max(0, round(stackTotal * band.low) - stackTotal)
  const highExtra = Math.max(0, round(stackTotal * band.high) - stackTotal)
  const service = (
    id: string,
    label: string,
    ourCost: number,
    isAnchor: boolean,
  ): FeeLineItem => ({
    id,
    label,
    category: 'title-settlement',
    ourCost,
    isFixed: false,
    typicalRange: isAnchor
      ? { low: ourCost + lowExtra, high: ourCost + highExtra }
      : { low: ourCost, high: round(ourCost * band.high) },
    feeSource: 'service',
    savingsSource: 'settlement_fee',
  })

  return {
    state: code,
    homeValue: 500000,
    loanAmount: 400000,
    transactionType: 'purchase',
    generatedAt: new Date().toISOString(),
    isSample: true,
    lineItems: [
      premium('lenders-title', "Lender's Title Insurance", 760),
      service('settlement-fee', 'Settlement Fee', SETTLEMENT, true),
      service('notary-fee', 'Notary Fee', NOTARY, false),
      {
        id: 'mortgage-recording',
        label: 'Mortgage Recording Fee',
        category: 'recording',
        ourCost: 101,
        isFixed: true,
        feeSource: 'county',
        savingsSource: 'pass_through',
      },
      {
        id: 'satisfaction-recording',
        label: 'Satisfaction (Release) Recording Fee',
        category: 'recording',
        ourCost: 22,
        isFixed: true,
        feeSource: 'county',
        savingsSource: 'pass_through',
      },
    ],
  }
}
