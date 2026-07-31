// Fee report schema. This is the shape we expect the API to return.
// Keep this file dependency-free so it can be imported on server or client.

export type FeeCategory = 'title-settlement' | 'recording' | 'taxes' | 'endorsements' | 'lender' | 'other'

export type FeeSource = 'state' | 'county' | 'service' | 'underwriter' | 'lender'

// Classifies *where* a line's savings (or non-savings) come from. Used by
// computeTotals to produce a breakdown of total savings by source — so the
// quote/report can show that pass-through fees don't drive savings, and that
// title-related and settlement-fee savings are accounted for separately.
//   title_related      — title-policy-side charges we can reduce where permitted
//   settlement_fee     — settlement/processing/wire/notary; operational efficiency
//   other_controllable — anything else BetterClose sets
//   pass_through       — recording, taxes, lender-required 3rd party; never count as savings
export type SavingsSource =
  | 'title_related'
  | 'settlement_fee'
  | 'other_controllable'
  | 'pass_through'

export interface FeeLineItem {
  id: string
  label: string
  category: FeeCategory
  ourCost: number
  // typicalRange and isFixed together describe variability:
  //   isFixed=true  -> set by state/county; no comparison to show
  //   isFixed=false -> typicalRange describes what the rest of the market charges
  isFixed: boolean
  typicalRange?: { low: number; high: number }
  feeSource?: FeeSource
  description?: string
  // Optional — when present, computeTotals classifies this line's savings into
  // the breakdown. When absent, falls back to category-based inference.
  savingsSource?: SavingsSource
  // Promotional credit line (negative ourCost), e.g. BetterClose Bucks.
  // Lowers ourTotal and counts toward estimatedSavings dollar-for-dollar;
  // never affects the market comparison range (the market doesn't offer it).
  isCredit?: boolean
}

// Location precision of this report. Drives result-page UX only — at every
// precision the fees come from the real upstream calc:
//   'state'    — broker entered state only; priced on a representative ZIP
//                (disclosed via representativeZip*); shown as summary cards,
//                not line items
//   'county'   — state + county supplied, but no ZIP yet (same treatment)
//   'detailed' — the actual property ZIP; full per-fee breakdown
// Optional so legacy reports without the field continue to work as detailed.
export type FeeReportPrecision = 'state' | 'county' | 'detailed'

export interface FeeReport {
  state: string
  zip?: string
  county?: string
  homeValue: number
  loanAmount?: number
  transactionType: 'purchase' | 'refinance'
  generatedAt: string // ISO
  lineItems: FeeLineItem[]
  isSample?: boolean
  precision?: FeeReportPrecision
  // When the calc was driven by a representative ZIP (state-only entry on the
  // broker estimate), these fields surface the substitution so the result
  // page can disclose it. They describe the pricing input only — they must
  // NEVER be confused with the actual property ZIP, which lives separately on
  // sessionStorage.brokerEstimateContext.propertyZip.
  representativeZipUsed?: boolean
  representativeZip?: string
  // Totals frozen at issuance. Stamped by the quote-persisting routes so an
  // already-issued quote keeps displaying the numbers it was sent with, even
  // if the savings constants/formulas change later. computeTotals returns
  // this verbatim when present.
  frozenTotals?: FeeReportTotals
}

// All service charges (settlement, notary, wire, doc/processing/courier if
// any) compared AS A PACKAGE rather than line-by-line. Providers itemize
// services differently — one bundles everything into a settlement fee,
// another splits it across doc-prep/processing/courier/e-doc lines — so
// line-to-line comparison silently assumes the market shares our line
// structure. The bucket comparison is robust to that itemization game and
// strictly more conservative (offsetting is allowed inside the bucket).
export interface ServiceStackTotals {
  ourTotal: number
  typicalLow: number
  typicalHigh: number
  // max(0, typicalLow − ourTotal), floored at the bucket level.
  savings: number
  comparableCount: number
}

export interface FeeReportTotals {
  ourTotal: number
  // marketLow/marketHigh describe the local typical range (kept so the report
  // can still show "typical $A–$B" next to "you pay") but they do NOT drive
  // the claimed savings number.
  marketLow: number
  marketHigh: number
  // The canonical claimed savings figures — single conservative numbers, not
  // a range. estimatedSavings = per-line premium savings (title_related) +
  // the service-stack bucket savings.
  estimatedSavings: number
  // Optional so totals frozen before this field existed still type-check;
  // the table falls back to per-line service badges when absent.
  serviceStack?: ServiceStackTotals
  // "Save over the loan": at-closing savings + interest avoided over 30 yrs
  // at LIFETIME_RATE_PCT. principal + interest = total paid avoided.
  lifetimeSavings: number
  // Where the savings come from. Sums by SavingsSource. pass_through is the
  // total of all pass-through fees (NOT savings — they don't generate any).
  breakdown: {
    title_related: number
    settlement_fee: number
    other_controllable: number
    pass_through_total: number
    // Promotional credits (BetterClose Bucks). Optional so totals frozen
    // before the feature existed still type-check.
    promotional_credit?: number
  }
  // Backwards-compatibility — every component reading the old range fields now
  // gets the same conservative number for low and high. Removes the "low–high
  // savings range" framing from the UI without forcing a sweep of design files.
  estimatedSavingsLow: number
  estimatedSavingsHigh: number
  lifetimeSavingsLow: number
  lifetimeSavingsHigh: number
}

// Default assumptions for the "save over the loan" projection.
export const LIFETIME_RATE_PCT = 6.5
export const LIFETIME_TERM_YEARS = 30

/**
 * Total amount paid on `principal` if financed at `ratePct` (annual %) over
 * `years`. Standard amortization. principal + interest.
 */
export function lifetimeFinancedAmount(
  principal: number,
  ratePct: number = LIFETIME_RATE_PCT,
  years: number = LIFETIME_TERM_YEARS,
): number {
  if (principal <= 0) return 0
  const monthlyRate = ratePct / 100 / 12
  const n = years * 12
  if (monthlyRate === 0) return principal
  const monthly =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  return Math.round(monthly * n)
}

/**
 * Interest-only portion avoided over the loan term — i.e. lifetimeFinancedAmount
 * minus the principal itself. "Save over the loan" = principal + this.
 */
export function loanInterestAvoided(
  principal: number,
  ratePct: number = LIFETIME_RATE_PCT,
  years: number = LIFETIME_TERM_YEARS,
): number {
  if (principal <= 0) return 0
  return lifetimeFinancedAmount(principal, ratePct, years) - principal
}

export const CATEGORY_LABELS: Record<FeeCategory, string> = {
  'title-settlement': 'Title & Settlement',
  recording: 'Recording Fees',
  taxes: 'Taxes',
  endorsements: 'Endorsements',
  lender: 'Lender Fees',
  other: 'Other',
}

/**
 * The one place per-line savings is defined: max(0, typicalRange.low − ourCost),
 * i.e. compared against the LOW end of typical local pricing. Used by both
 * computeTotals and the per-line "save $X" badges so the visible line badges
 * always sum exactly to the headline "Save at closing" number.
 */
export function conservativeLineSavings(item: FeeLineItem): number {
  if (item.isFixed || !item.typicalRange) return 0
  return Math.max(0, item.typicalRange.low - item.ourCost)
}

// When a line has no explicit savingsSource we fall back to category +
// isFixed to classify it. Keeps older quote data working.
// Exported (as savingsSourceOf) so the report table can tell premium lines
// (compared per-line) from service lines (compared as a package).
function inferSavingsSource(item: FeeLineItem): SavingsSource {
  if (item.savingsSource) return item.savingsSource
  if (item.isFixed) return 'pass_through'
  if (item.category === 'recording' || item.category === 'taxes') return 'pass_through'
  if (item.category === 'lender') return 'pass_through'
  if (item.feeSource === 'underwriter') return 'title_related'
  if (item.category === 'title-settlement') return 'settlement_fee'
  return 'other_controllable'
}

export function savingsSourceOf(item: FeeLineItem): SavingsSource {
  return inferSavingsSource(item)
}

export function computeTotals(report: FeeReport): FeeReportTotals {
  // Issued quotes carry totals frozen at creation — display those verbatim so
  // later formula/constant changes never retroactively alter a sent quote.
  if (report.frozenTotals) return report.frozenTotals

  // State/county-precision reports carry real line items too (priced on a
  // representative ZIP, disclosed on the report) — totals are computed the
  // same way at every precision; only the display granularity differs.
  let ourTotal = 0
  let marketLow = 0
  let marketHigh = 0

  // Per-line conservative savings = max(0, line.marketLow - line.ourCost).
  // We compare against the LOW end of typical local pricing, never the high
  // end or midpoint — this is the "no inflated comparisons" guarantee.
  const breakdown = {
    title_related: 0,
    settlement_fee: 0,
    other_controllable: 0,
    pass_through_total: 0,
    promotional_credit: 0,
  }

  const serviceStack: ServiceStackTotals = {
    ourTotal: 0,
    typicalLow: 0,
    typicalHigh: 0,
    savings: 0,
    comparableCount: 0,
  }

  for (const item of report.lineItems) {
    // Promotional credits (BetterClose Bucks): lower what the borrower pays
    // and widen savings dollar-for-dollar. The market range is untouched —
    // other providers don't offer the credit, so marketLow/High describe the
    // market's own stack only.
    if (item.isCredit) {
      ourTotal += item.ourCost
      breakdown.promotional_credit += Math.max(0, -item.ourCost)
      continue
    }
    ourTotal += item.ourCost
    const source = inferSavingsSource(item)

    if (item.isFixed || !item.typicalRange) {
      // No comparison — pass-through, set by state/county, or unknown range.
      marketLow += item.ourCost
      marketHigh += item.ourCost
      if (source === 'pass_through') breakdown.pass_through_total += item.ourCost
      continue
    }

    marketLow += item.typicalRange.low
    marketHigh += item.typicalRange.high

    if (source === 'title_related') {
      // Premiums are a like-for-like product — compared per line.
      breakdown.title_related += conservativeLineSavings(item)
    } else if (source === 'pass_through') {
      breakdown.pass_through_total += item.ourCost
    } else {
      // Service charges are compared as one package (see ServiceStackTotals).
      serviceStack.ourTotal += item.ourCost
      serviceStack.typicalLow += item.typicalRange.low
      serviceStack.typicalHigh += item.typicalRange.high
      serviceStack.comparableCount += 1
    }
  }

  // Bucket-level flooring: offsetting inside the stack is allowed, so this is
  // ≤ the sum of per-line floors — never less conservative.
  serviceStack.savings = Math.max(0, serviceStack.typicalLow - serviceStack.ourTotal)
  breakdown.settlement_fee = serviceStack.savings
  breakdown.other_controllable = 0

  const estimatedSavings =
    breakdown.title_related + serviceStack.savings + breakdown.promotional_credit
  const lifetimeSavings = lifetimeFinancedAmount(estimatedSavings)

  return {
    ourTotal,
    marketLow,
    marketHigh,
    estimatedSavings,
    serviceStack,
    lifetimeSavings,
    breakdown,
    // Back-compat: identical low/high so legacy range UIs collapse to one number.
    estimatedSavingsLow: estimatedSavings,
    estimatedSavingsHigh: estimatedSavings,
    lifetimeSavingsLow: lifetimeSavings,
    lifetimeSavingsHigh: lifetimeSavings,
  }
}

// Sample report shown on the homepage as a teaser. Clearly labeled as sample.
// Uses a filed-rate state (Georgia) — in promulgated/uniform-rate states like
// Texas, premiums are identical across providers and no premium comparison
// may be shown (src/lib/marketBaseline.ts). Premium ranges follow the interim
// PREMIUM_RANGE_FILED multipliers; service ranges follow GA's evidence-derived
// band (1.09–1.2 — see SERVICE_BANDS in marketBaseline).
export function getSampleFeeReport(): FeeReport {
  return {
    state: 'GA',
    homeValue: 500000,
    loanAmount: 400000,
    transactionType: 'purchase',
    generatedAt: new Date().toISOString(),
    isSample: true,
    lineItems: [
      {
        id: 'lenders-title',
        label: "Lender's Title Insurance",
        category: 'title-settlement',
        ourCost: 760,
        isFixed: false,
        typicalRange: { low: 950, high: 1444 },
        feeSource: 'underwriter',
        savingsSource: 'title_related',
        description: 'A-rated underwriter coverage',
      },
      {
        id: 'settlement-fee',
        label: 'Settlement Fee',
        category: 'title-settlement',
        ourCost: 350,
        isFixed: false,
        typicalRange: { low: 382, high: 420 },
        feeSource: 'service',
        savingsSource: 'settlement_fee',
      },
      {
        id: 'notary-fee',
        label: 'Notary Fee',
        category: 'title-settlement',
        ourCost: 150,
        isFixed: false,
        typicalRange: { low: 164, high: 180 },
        feeSource: 'service',
        savingsSource: 'settlement_fee',
      },
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
      {
        // BetterClose Bucks (betterCloseBucks.ts): 15% of the sample's
        // combined policy premium ($760 lender's) = $114.
        id: 'betterclose-bucks',
        label: 'BetterClose Bucks',
        category: 'other',
        ourCost: -114,
        isFixed: false,
        isCredit: true,
        description: 'Introductory BetterClose credit, applied at closing.',
      },
    ],
  }
}

// Mock generator used in dev/preview before the API is wired in.
// Scales numbers off home value so different inputs produce different
// outputs. Comparison ranges track marketBaseline: premium ×1.25–1.9
// (interim filed-state multipliers) and GA's evidence-derived service band
// (1.09–1.2); callers should pass 'GA' (see getSampleFeeReport).
export function getMockFeeReport(input: {
  state: string
  homeValue: number
  loanAmount?: number
  transactionType: 'purchase' | 'refinance'
}): FeeReport {
  const loan = input.loanAmount ?? Math.round(input.homeValue * 0.8)
  // Title insurance scales loosely with loan size.
  const lenderTitleOurs = Math.round(loan * 0.0019)
  const lenderTitleMarketLow = Math.round(lenderTitleOurs * 1.25)
  const lenderTitleMarketHigh = Math.round(lenderTitleOurs * 1.9)

  const items: FeeLineItem[] = [
    {
      id: 'lenders-title',
      label: "Lender's Title Insurance",
      category: 'title-settlement',
      ourCost: lenderTitleOurs,
      isFixed: false,
      typicalRange: { low: lenderTitleMarketLow, high: lenderTitleMarketHigh },
      feeSource: 'underwriter',
      savingsSource: 'title_related',
      description: 'A-rated underwriter coverage',
    },
    {
      id: 'settlement-fee',
      label: 'Settlement Fee',
      category: 'title-settlement',
      ourCost: 350,
      isFixed: false,
      typicalRange: { low: 382, high: 420 },
      feeSource: 'service',
      savingsSource: 'settlement_fee',
    },
    {
      id: 'notary-fee',
      label: 'Notary Fee',
      category: 'title-settlement',
      ourCost: 150,
      isFixed: false,
      typicalRange: { low: 164, high: 180 },
      feeSource: 'service',
      savingsSource: 'settlement_fee',
    },
    {
      id: 'wire-fee',
      label: 'Wire Transfer Fee',
      category: 'title-settlement',
      ourCost: 25,
      isFixed: false,
      typicalRange: { low: 27, high: 30 },
      feeSource: 'service',
      savingsSource: 'settlement_fee',
    },
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
      id: 'affordable-housing',
      label: 'Affordable Housing Fee',
      category: 'recording',
      ourCost: 225,
      isFixed: true,
      feeSource: 'state',
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
    {
      id: 'recording-service',
      label: 'Recording Service Fee',
      category: 'recording',
      ourCost: 25,
      isFixed: true,
      feeSource: 'service',
      savingsSource: 'pass_through',
    },
  ]

  if (input.transactionType === 'purchase') {
    items.push({
      id: 'owners-title',
      label: "Owner's Title Insurance",
      category: 'title-settlement',
      ourCost: Math.round(input.homeValue * 0.0024),
      isFixed: false,
      typicalRange: {
        low: Math.round(input.homeValue * 0.0024 * 1.25),
        high: Math.round(input.homeValue * 0.0024 * 1.9),
      },
      feeSource: 'underwriter',
      savingsSource: 'title_related',
      description: 'Optional but strongly recommended',
    })
    items.push({
      id: 'deed-recording',
      label: 'Deed Recording Fee',
      category: 'recording',
      ourCost: 65,
      isFixed: true,
      feeSource: 'county',
      savingsSource: 'pass_through',
    })
  }

  // BetterClose Bucks: 15% of combined policy premium (mirrors
  // betterCloseBucks.ts; hand-rolled here to keep this file dependency-free).
  const policyTotal = items
    .filter((li) => /title insurance/i.test(li.label))
    .reduce((sum, li) => sum + li.ourCost, 0)
  const bucks = Math.round(policyTotal * 0.15)
  if (bucks > 0) {
    items.push({
      id: 'betterclose-bucks',
      label: 'BetterClose Bucks',
      category: 'other',
      ourCost: -bucks,
      isFixed: false,
      isCredit: true,
      description: 'Introductory BetterClose credit, applied at closing.',
    })
  }

  return {
    state: input.state,
    homeValue: input.homeValue,
    loanAmount: loan,
    transactionType: input.transactionType,
    generatedAt: new Date().toISOString(),
    lineItems: items,
  }
}

export function groupByCategory(items: FeeLineItem[]): Map<FeeCategory, FeeLineItem[]> {
  const map = new Map<FeeCategory, FeeLineItem[]>()
  const order: FeeCategory[] = ['title-settlement', 'recording', 'taxes', 'endorsements', 'lender', 'other']
  for (const cat of order) map.set(cat, [])
  for (const item of items) {
    const arr = map.get(item.category) ?? []
    arr.push(item)
    map.set(item.category, arr)
  }
  for (const [k, v] of map) if (v.length === 0) map.delete(k)
  return map
}

export function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatRange(low: number, high: number): string {
  return `${formatCurrency(low)}–${formatCurrency(high)}`
}
