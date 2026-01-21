import { FeeSchedule } from '../types'

export const defaultFeeSchedule: FeeSchedule = {
  // Lender fees
  originationFee: (loanAmount: number) => loanAmount * 0.01, // 1% of loan amount
  underwritingFee: 850,
  processingFee: 500,
  applicationFee: 400,

  // Product-specific add-ons
  productPremiums: {
    basic: 0,
    standard: 250,
    premium: 750,
  },

  // Third-party fees
  appraisalFee: 550,
  creditReportFee: 45,
  floodCertificationFee: 25,
  titleInsuranceRate: 5.5, // per thousand
  titleSearchFee: 300,
  settlementFee: 400,
  surveyFee: 475,
  pestInspectionFee: 125,

  // Prepaids
  prepaidInterestPerDiem: (loanAmount: number, rate: number) => {
    const dailyRate = (rate / 100) / 365
    return loanAmount * dailyRate
  },
  prepaidInterestDays: 15,
  homeownersInsuranceMonths: 12,
  propertyTaxMonths: 6,
}

// Estimated rates and values for prepaid calculations
export const estimatedRates = {
  mortgageInterestRate: 6.5, // percentage
  annualPropertyTaxRate: 1.2, // percentage of home value
  annualHomeownersInsurance: 1500,
}
