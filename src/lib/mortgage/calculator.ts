/**
 * Calculate monthly principal and interest payment
 */
export function calculateMonthlyPI(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) {
    return loanAmount / termMonths
  }

  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  return Math.round(payment * 100) / 100
}

/**
 * Calculate total monthly payment (PITI - Principal, Interest, Taxes, Insurance)
 */
export function calculateMonthlyPITI(
  principalInterest: number,
  propertyTaxes?: number,
  homeInsurance?: number,
  hoaFees?: number,
  pmi?: number
): number {
  const total =
    principalInterest +
    (propertyTaxes || 0) +
    (homeInsurance || 0) +
    (hoaFees || 0) +
    (pmi || 0)

  return Math.round(total * 100) / 100
}

/**
 * Calculate upfront costs (points + lender fees)
 */
export function calculateUpfrontCosts(
  loanAmount: number,
  points?: number,
  lenderFees?: number,
  closingCosts?: number
): number {
  const pointsCost = points ? (loanAmount * points) / 100 : 0
  const total = pointsCost + (lenderFees || 0) + (closingCosts || 0)

  return Math.round(total * 100) / 100
}

/**
 * Calculate total interest paid over life of loan
 */
export function calculateTotalInterest(
  monthlyPayment: number,
  loanAmount: number,
  termMonths: number
): number {
  const totalPaid = monthlyPayment * termMonths
  const totalInterest = totalPaid - loanAmount

  return Math.round(totalInterest * 100) / 100
}

/**
 * Calculate APR (simplified - actual APR calculation is more complex)
 */
export function calculateAPR(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  upfrontCosts: number
): number {
  // Simplified APR calculation
  // For accurate APR, would need to solve for the rate that makes NPV = 0
  const totalInterest = calculateTotalInterest(
    calculateMonthlyPI(loanAmount, annualRate, termMonths),
    loanAmount,
    termMonths
  )

  const totalCost = totalInterest + upfrontCosts
  const apr = (totalCost / loanAmount / (termMonths / 12)) * 100

  return Math.round(apr * 100) / 100
}

/**
 * Estimate PMI (Private Mortgage Insurance) if LTV > 80%
 */
export function estimatePMI(
  loanAmount: number,
  homeValue: number,
  annualPMIRate: number = 0.5 // 0.5% default
): number {
  const ltv = (loanAmount / homeValue) * 100

  if (ltv <= 80) {
    return 0
  }

  const annualPMI = loanAmount * (annualPMIRate / 100)
  const monthlyPMI = annualPMI / 12

  return Math.round(monthlyPMI * 100) / 100
}

/**
 * Convert term to months
 */
export function termToMonths(term: string): number {
  switch (term) {
    case '30_year':
      return 360
    case '15_year':
      return 180
    case '20_year':
      return 240
    case '10_year':
      return 120
    case '7_1_arm':
    case '5_1_arm':
      return 360 // ARMs typically have 30-year amortization
    default:
      return 360
  }
}
