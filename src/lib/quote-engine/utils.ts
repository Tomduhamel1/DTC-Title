import { QuoteOutput } from './types'

/**
 * Generate a unique quote ID
 */
export function generateQuoteId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return `Q-${timestamp}-${randomStr}`.toUpperCase()
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Round to 2 decimal places
 */
export function roundTo2Decimals(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Format quote output for display
 */
export function formatQuoteForDisplay(quote: QuoteOutput): string {
  let output = `QUOTE ${quote.quoteId}\n`
  output += `Generated: ${quote.timestamp.toLocaleString()}\n`
  output += `Expires: ${quote.expiresAt.toLocaleDateString()}\n\n`

  // Input summary
  output += `PROPERTY DETAILS\n`
  output += `State: ${quote.input.state}\n`
  output += `County: ${quote.input.county}\n`
  output += `Purchase Price: ${formatCurrency(quote.input.purchasePrice)}\n`
  output += `Loan Amount: ${formatCurrency(quote.input.loanAmount)}\n`
  output += `Transaction: ${quote.input.transactionType}\n`
  output += `Product: ${quote.input.productChoice}\n\n`

  // Line items
  quote.lineItemGroups.forEach((group) => {
    output += `${group.title}\n`
    output += `${'-'.repeat(60)}\n`
    group.items.forEach((item) => {
      const optional = item.isOptional ? ' (Optional)' : ''
      const thirdParty = item.isThirdParty ? ' *' : ''
      output += `  ${item.name}${optional}${thirdParty}: ${formatCurrency(item.amount)}\n`
      if (item.description) {
        output += `    ${item.description}\n`
      }
    })
    output += `  Subtotal: ${formatCurrency(group.subtotal)}\n\n`
  })

  // Totals
  output += `TOTALS\n`
  output += `${'-'.repeat(60)}\n`
  output += `Lender Fees: ${formatCurrency(quote.totals.lenderFees)}\n`
  output += `Third-Party Fees: ${formatCurrency(quote.totals.thirdPartyFees)}\n`
  output += `Government Fees: ${formatCurrency(quote.totals.governmentFees)}\n`
  output += `Prepaid Items: ${formatCurrency(quote.totals.prepaidItems)}\n`
  output += `TOTAL CLOSING COSTS: ${formatCurrency(quote.totals.totalClosingCosts)}\n`
  output += `Cash to Close: ${formatCurrency(quote.totals.cashToClose)}\n\n`

  // Savings
  if (quote.savingsSummary.hasSavings && quote.savingsSummary.savings) {
    output += `SAVINGS SUMMARY\n`
    output += `${'-'.repeat(60)}\n`
    output += `Competitor Quote: ${formatCurrency(quote.savingsSummary.competitorTotal!)}\n`
    output += `Our Quote: ${formatCurrency(quote.savingsSummary.ourTotal)}\n`
    output += `YOUR SAVINGS: ${formatCurrency(quote.savingsSummary.savings)} `
    output += `(${formatPercentage(quote.savingsSummary.savingsPercentage!)})\n\n`
  }

  // Disclaimers
  output += `DISCLAIMERS\n`
  output += `${'-'.repeat(60)}\n`
  quote.disclaimers.forEach((disclaimer, index) => {
    output += `${index + 1}. ${disclaimer}\n`
  })

  output += `\n* Third-party fees are paid to external service providers\n`

  return output
}
