// Savings calculation logic for the AI/Story calculator surfaces.
//
// Base savings come from the shared per-state model (src/lib/stateSavings.ts,
// generated from the production quote engine) so these calculators, the
// homepage hero, and the /quote flow all tell one story. The bonus credits
// (remote signing, docs ready, title complexity) are product incentives
// layered on top — keep their dollar values in sync with what we actually
// offer.

import {
  LIFETIME_RATE_PCT,
  LIFETIME_TERM_YEARS,
  lifetimeFinancedAmount,
} from './feeReport'
import { estimateCostBasis } from './stateSavings'

export interface SavingsFactors {
  remoteSigning: boolean | null
  docsReady: boolean | null
  hasCD: boolean | null
  titleComplexity: 'simple' | 'moderate' | 'complex' | null
  lenderSwitch: boolean | null
}

export interface SavingsBreakdown {
  baseSavings: number
  remoteSavings: number
  docsSavings: number
  titleSavings: number
  totalSavings: number
  estimatedClosingCost: number
  averageClosingCost: number
  estimatedMonthlyImpact: number
  averageMonthlyImpact: number
  lifetimeSavings: number
}

// Illustrative non-title closing costs used ONLY for the "typical closing
// cost" context number in the chat calculators (lender, appraisal, credit,
// flood, search, recording, survey). Not part of the savings claim itself.
function otherClosingCosts(transactionType: 'purchase' | 'refinance'): number {
  const lenderFees = transactionType === 'purchase' ? 1500 : 1200
  const appraisalFee = 500
  const creditReportFee = 50
  const floodCertFee = 25
  const titleSearchFee = 300
  const recordingFees = 150
  const surveyFee = transactionType === 'purchase' ? 400 : 0
  return lenderFees + appraisalFee + creditReportFee + floodCertFee + titleSearchFee + recordingFees + surveyFee
}

// Monthly payment if `amount` were financed at the shared long-term
// assumptions (6.5% over 30 years — same constants as feeReport).
function monthlyIfFinanced(amount: number): number {
  const monthlyRate = LIFETIME_RATE_PCT / 100 / 12
  const n = LIFETIME_TERM_YEARS * 12
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
}

export function calculateSavings(
  transactionType: 'purchase' | 'refinance',
  homeValue: number,
  state: string,
  factors: SavingsFactors
): SavingsBreakdown {
  // Base savings: the shared per-state model — the same "save at closing"
  // anchor the homepage hero shows, scaled to this home value.
  const basis = estimateCostBasis(homeValue, transactionType, state)
  const baseSavings = basis.saveAtClosing

  // Remote signing bonus
  const remoteSavings = factors.remoteSigning === true ? 150 : 0

  // Documents ready bonus
  const docsSavings = factors.docsReady === true ? 100 : 0

  // Title complexity adjustment
  let titleSavings = 0
  if (factors.titleComplexity === 'simple') {
    titleSavings = 200 // Less research needed
  } else if (factors.titleComplexity === 'complex') {
    titleSavings = -100 // More research needed
  }

  // Total savings
  const totalSavings = Math.max(0, baseSavings + remoteSavings + docsSavings + titleSavings)

  // Closing-cost context numbers. "Average" = illustrative non-title costs
  // plus the engine-derived typical market total for title/settlement/
  // recording; "estimated" swaps in the BetterClose total minus the bonuses.
  const averageClosingCost = otherClosingCosts(transactionType) + basis.typicalTotal
  const estimatedClosingCost = averageClosingCost - totalSavings

  // Monthly payment impact at the shared financing assumptions.
  const averageMonthlyImpact = monthlyIfFinanced(averageClosingCost)
  const estimatedMonthlyImpact = monthlyIfFinanced(estimatedClosingCost)

  // Lifetime savings: total 30-year cost of financing the savings amount —
  // identical definition to the quote flow's "Save over the loan"
  // (feeReport.lifetimeFinancedAmount).
  const lifetimeSavings = lifetimeFinancedAmount(totalSavings)

  return {
    baseSavings,
    remoteSavings,
    docsSavings,
    titleSavings,
    totalSavings,
    estimatedClosingCost: Math.round(estimatedClosingCost),
    averageClosingCost: Math.round(averageClosingCost),
    estimatedMonthlyImpact: Math.round(estimatedMonthlyImpact),
    averageMonthlyImpact: Math.round(averageMonthlyImpact),
    lifetimeSavings,
  }
}

// Get initial savings (just base, no factors applied yet)
export function getInitialSavings(
  transactionType: 'purchase' | 'refinance',
  homeValue: number,
  state: string
): SavingsBreakdown {
  return calculateSavings(transactionType, homeValue, state, {
    remoteSigning: null,
    docsReady: null,
    hasCD: null,
    titleComplexity: null,
    lenderSwitch: null
  })
}
