export type TransactionType = 'purchase' | 'refinance'
export type ProductChoice = 'standard' | 'premium' | 'basic'

export interface QuoteEngineInput {
  state: string
  county: string
  purchasePrice: number
  loanAmount: number
  transactionType: TransactionType
  productChoice: ProductChoice
  competitorQuoteTotal?: number
}

export interface LineItem {
  category: string
  name: string
  amount: number
  description?: string
  isOptional?: boolean
  isThirdParty?: boolean
}

export interface LineItemGroup {
  title: string
  items: LineItem[]
  subtotal: number
}

export interface QuoteTotals {
  lenderFees: number
  thirdPartyFees: number
  governmentFees: number
  prepaidItems: number
  totalClosingCosts: number
  totalLoanAmount: number
  cashToClose: number
}

export interface SavingsSummary {
  hasSavings: boolean
  competitorTotal?: number
  ourTotal: number
  savings?: number
  savingsPercentage?: number
}

export interface QuoteOutput {
  quoteId: string
  timestamp: Date
  input: QuoteEngineInput
  lineItemGroups: LineItemGroup[]
  totals: QuoteTotals
  savingsSummary: SavingsSummary
  disclaimers: string[]
  expiresAt: Date
}

export interface StateConfig {
  state: string
  stateName: string

  // Tax rates
  recordingTaxRate: number // percentage or per-thousand
  recordingTaxType: 'percentage' | 'per_thousand'
  transferTaxRate: number
  transferTaxType: 'percentage' | 'per_thousand'

  // Fixed fees
  recordingFeeBase: number
  recordingFeePerPage?: number

  // County-specific overrides
  countyOverrides?: {
    [county: string]: {
      recordingTaxRate?: number
      transferTaxRate?: number
      recordingFeeBase?: number
    }
  }

  // Required disclosures
  stateSpecificDisclosures?: string[]
}

export interface FeeSchedule {
  // Lender fees
  originationFee: number | ((loanAmount: number) => number)
  underwritingFee: number
  processingFee: number
  applicationFee: number

  // Product-specific add-ons
  productPremiums: {
    basic: number
    standard: number
    premium: number
  }

  // Third-party fees
  appraisalFee: number
  creditReportFee: number
  floodCertificationFee: number
  titleInsuranceRate: number // per thousand
  titleSearchFee: number
  settlementFee: number
  surveyFee: number
  pestInspectionFee: number

  // Prepaids
  prepaidInterestPerDiem: number | ((loanAmount: number, rate: number) => number)
  prepaidInterestDays: number
  homeownersInsuranceMonths: number
  propertyTaxMonths: number
}
