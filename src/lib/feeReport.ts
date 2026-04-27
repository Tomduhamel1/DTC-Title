// Fee report schema. This is the shape we expect the API to return.
// Keep this file dependency-free so it can be imported on server or client.

export type FeeCategory = 'title-settlement' | 'recording' | 'taxes' | 'endorsements' | 'lender' | 'other'

export type FeeSource = 'state' | 'county' | 'service' | 'underwriter' | 'lender'

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
}

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
}

export interface FeeReportTotals {
  ourTotal: number
  marketLow: number
  marketHigh: number
  estimatedSavingsLow: number
  estimatedSavingsHigh: number
  // Lifetime cost of financing the closing-cost savings. Reflects what users
  // would actually pay over their loan if they rolled closing costs in.
  lifetimeSavingsLow: number
  lifetimeSavingsHigh: number
}

// Default assumptions for financed-closing-cost lifetime calc.
export const LIFETIME_RATE_PCT = 7
export const LIFETIME_TERM_YEARS = 30

/**
 * Total amount paid on `principal` if financed at `ratePct` (annual %) over
 * `years`. Standard amortization. Used to project the lifetime impact of
 * rolling closing-cost savings into the loan.
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

export const CATEGORY_LABELS: Record<FeeCategory, string> = {
  'title-settlement': 'Title & Settlement',
  recording: 'Recording Fees',
  taxes: 'Taxes',
  endorsements: 'Endorsements',
  lender: 'Lender Fees',
  other: 'Other',
}

export function computeTotals(report: FeeReport): FeeReportTotals {
  let ourTotal = 0
  let marketLow = 0
  let marketHigh = 0

  for (const item of report.lineItems) {
    ourTotal += item.ourCost
    if (item.isFixed || !item.typicalRange) {
      marketLow += item.ourCost
      marketHigh += item.ourCost
    } else {
      marketLow += item.typicalRange.low
      marketHigh += item.typicalRange.high
    }
  }

  const estimatedSavingsLow = Math.max(0, marketLow - ourTotal)
  const estimatedSavingsHigh = Math.max(0, marketHigh - ourTotal)

  return {
    ourTotal,
    marketLow,
    marketHigh,
    estimatedSavingsLow,
    estimatedSavingsHigh,
    lifetimeSavingsLow: lifetimeFinancedAmount(estimatedSavingsLow),
    lifetimeSavingsHigh: lifetimeFinancedAmount(estimatedSavingsHigh),
  }
}

// Sample report shown on the homepage as a teaser. Clearly labeled as sample.
export function getSampleFeeReport(): FeeReport {
  return {
    state: 'Texas',
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
        typicalRange: { low: 1100, high: 1800 },
        feeSource: 'underwriter',
        description: 'A-rated underwriter coverage',
      },
      {
        id: 'settlement-fee',
        label: 'Settlement Fee',
        category: 'title-settlement',
        ourCost: 350,
        isFixed: false,
        typicalRange: { low: 500, high: 950 },
        feeSource: 'service',
      },
      {
        id: 'notary-fee',
        label: 'Notary Fee',
        category: 'title-settlement',
        ourCost: 150,
        isFixed: false,
        typicalRange: { low: 150, high: 300 },
        feeSource: 'service',
      },
      {
        id: 'mortgage-recording',
        label: 'Mortgage Recording Fee',
        category: 'recording',
        ourCost: 101,
        isFixed: true,
        feeSource: 'county',
      },
      {
        id: 'satisfaction-recording',
        label: 'Satisfaction (Release) Recording Fee',
        category: 'recording',
        ourCost: 22,
        isFixed: true,
        feeSource: 'county',
      },
    ],
  }
}

// Mock generator used in dev/preview before the API is wired in.
// Scales numbers off home value so different inputs produce different outputs.
export function getMockFeeReport(input: {
  state: string
  homeValue: number
  loanAmount?: number
  transactionType: 'purchase' | 'refinance'
}): FeeReport {
  const loan = input.loanAmount ?? Math.round(input.homeValue * 0.8)
  // Title insurance scales loosely with loan size.
  const lenderTitleOurs = Math.round(loan * 0.0019)
  const lenderTitleMarketLow = Math.round(loan * 0.0028)
  const lenderTitleMarketHigh = Math.round(loan * 0.0045)

  const items: FeeLineItem[] = [
    {
      id: 'lenders-title',
      label: "Lender's Title Insurance",
      category: 'title-settlement',
      ourCost: lenderTitleOurs,
      isFixed: false,
      typicalRange: { low: lenderTitleMarketLow, high: lenderTitleMarketHigh },
      feeSource: 'underwriter',
      description: 'A-rated underwriter coverage',
    },
    {
      id: 'settlement-fee',
      label: 'Settlement Fee',
      category: 'title-settlement',
      ourCost: 350,
      isFixed: false,
      typicalRange: { low: 500, high: 950 },
      feeSource: 'service',
    },
    {
      id: 'notary-fee',
      label: 'Notary Fee',
      category: 'title-settlement',
      ourCost: 150,
      isFixed: false,
      typicalRange: { low: 150, high: 300 },
      feeSource: 'service',
    },
    {
      id: 'wire-fee',
      label: 'Wire Transfer Fee',
      category: 'title-settlement',
      ourCost: 25,
      isFixed: false,
      typicalRange: { low: 25, high: 75 },
      feeSource: 'service',
    },
    {
      id: 'mortgage-recording',
      label: 'Mortgage Recording Fee',
      category: 'recording',
      ourCost: 101,
      isFixed: true,
      feeSource: 'county',
    },
    {
      id: 'affordable-housing',
      label: 'Affordable Housing Fee',
      category: 'recording',
      ourCost: 225,
      isFixed: true,
      feeSource: 'state',
    },
    {
      id: 'satisfaction-recording',
      label: 'Satisfaction (Release) Recording Fee',
      category: 'recording',
      ourCost: 22,
      isFixed: true,
      feeSource: 'county',
    },
    {
      id: 'recording-service',
      label: 'Recording Service Fee',
      category: 'recording',
      ourCost: 25,
      isFixed: true,
      feeSource: 'service',
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
        low: Math.round(input.homeValue * 0.0035),
        high: Math.round(input.homeValue * 0.006),
      },
      feeSource: 'underwriter',
      description: 'Optional but strongly recommended',
    })
    items.push({
      id: 'deed-recording',
      label: 'Deed Recording Fee',
      category: 'recording',
      ourCost: 65,
      isFixed: true,
      feeSource: 'county',
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
