export interface QuoteInput {
  homeValue: number
  mortgageBalance: number
  currentRate: number
  newRate: number
  creditScore: string
  loanTerm?: number
}

export interface QuoteResult {
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number
  totalInterestCurrent: number
  totalInterestNew: number
  lifetimeSavings: number
  closingCosts: number
  breakEvenMonths: number
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const loanTerm = input.loanTerm || 360 // 30 years default

  // Calculate current monthly payment
  const currentMonthlyRate = input.currentRate / 100 / 12
  const currentMonthlyPayment = calculateMonthlyPayment(
    input.mortgageBalance,
    currentMonthlyRate,
    loanTerm
  )

  // Calculate new monthly payment
  const newMonthlyRate = input.newRate / 100 / 12
  const newMonthlyPayment = calculateMonthlyPayment(
    input.mortgageBalance,
    newMonthlyRate,
    loanTerm
  )

  // Calculate total interest paid
  const totalInterestCurrent = currentMonthlyPayment * loanTerm - input.mortgageBalance
  const totalInterestNew = newMonthlyPayment * loanTerm - input.mortgageBalance

  // Calculate savings
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment
  const lifetimeSavings = totalInterestCurrent - totalInterestNew

  // Estimate closing costs (typically 2-5% of loan amount)
  const closingCosts = input.mortgageBalance * 0.03

  // Calculate break-even point
  const breakEvenMonths = Math.ceil(closingCosts / monthlySavings)

  return {
    currentMonthlyPayment: Math.round(currentMonthlyPayment * 100) / 100,
    newMonthlyPayment: Math.round(newMonthlyPayment * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    totalInterestCurrent: Math.round(totalInterestCurrent * 100) / 100,
    totalInterestNew: Math.round(totalInterestNew * 100) / 100,
    lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
    closingCosts: Math.round(closingCosts * 100) / 100,
    breakEvenMonths,
  }
}

function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  numberOfPayments: number
): number {
  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  )
}
