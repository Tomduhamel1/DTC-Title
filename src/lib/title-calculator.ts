/**
 * Title Insurance and Settlement Cost Calculator
 *
 * Calculates savings on closing costs including:
 * - Title insurance premiums
 * - Settlement/escrow fees
 * - Recording fees
 * - Other closing costs
 */

export interface TitleCalculatorInput {
  transactionType: 'purchase' | 'refinance'
  homeValue: number
  loanAmount: number
  state: string
  county?: string
}

export interface CostBreakdown {
  titleInsurance: number
  settlementFee: number
  recordingFees: number
  courierFees: number
  notaryFees: number
  total: number
}

export interface TitleCalculatorResult {
  traditionalCosts: CostBreakdown
  trueFeeClosingCosts: CostBreakdown
  savings: number
  savingsPercentage: number
  lineItems: Array<{
    name: string
    traditional: number
    trueFeeClosing: number
    savings: number
  }>
}

/**
 * Calculate title insurance premium based on loan amount
 * Using placeholder rates - actual rates vary by state
 */
function calculateTitleInsurance(
  loanAmount: number,
  transactionType: 'purchase' | 'refinance',
  state: string
): { traditional: number; trueFeeClosing: number } {
  // Base rate per $1000 of coverage (placeholder rates)
  // In reality, these vary significantly by state
  const baseRatePerThousand = transactionType === 'purchase' ? 5.75 : 3.50

  // Calculate traditional premium
  const traditional = (loanAmount / 1000) * baseRatePerThousand

  // TrueFee Closing offers 30% savings on title insurance
  const trueFeeClosing = traditional * 0.70

  return {
    traditional: Math.round(traditional * 100) / 100,
    trueFeeClosing: Math.round(trueFeeClosing * 100) / 100
  }
}

/**
 * Calculate settlement/escrow fee
 */
function calculateSettlementFee(
  homeValue: number,
  transactionType: 'purchase' | 'refinance'
): { traditional: number; trueFeeClosing: number } {
  // Traditional settlement fees are typically $800-1200
  const traditional = transactionType === 'purchase' ? 1000 : 800

  // TrueFee Closing offers 40% savings on settlement fees
  const trueFeeClosing = traditional * 0.60

  return {
    traditional,
    trueFeeClosing
  }
}

/**
 * Calculate recording fees (typically same for all providers)
 */
function calculateRecordingFees(
  state: string,
  transactionType: 'purchase' | 'refinance'
): number {
  // Recording fees are set by county/state, not negotiable
  // Placeholder: $300-500 depending on location
  const baseFee = transactionType === 'purchase' ? 400 : 300
  return baseFee
}

/**
 * Calculate courier and notary fees
 */
function calculateMiscFees(): {
  courier: { traditional: number; trueFeeClosing: number }
  notary: { traditional: number; trueFeeClosing: number }
} {
  return {
    courier: {
      traditional: 75,
      trueFeeClosing: 50 // Some savings on courier
    },
    notary: {
      traditional: 150,
      trueFeeClosing: 150 // Same notary fees
    }
  }
}

/**
 * Main calculator function
 */
export function calculateTitleSavings(
  input: TitleCalculatorInput
): TitleCalculatorResult {
  // Calculate each cost component
  const titleInsurance = calculateTitleInsurance(
    input.loanAmount,
    input.transactionType,
    input.state
  )

  const settlementFee = calculateSettlementFee(
    input.homeValue,
    input.transactionType
  )

  const recordingFees = calculateRecordingFees(
    input.state,
    input.transactionType
  )

  const miscFees = calculateMiscFees()

  // Build cost breakdown
  const traditionalCosts: CostBreakdown = {
    titleInsurance: titleInsurance.traditional,
    settlementFee: settlementFee.traditional,
    recordingFees,
    courierFees: miscFees.courier.traditional,
    notaryFees: miscFees.notary.traditional,
    total: 0
  }
  traditionalCosts.total =
    traditionalCosts.titleInsurance +
    traditionalCosts.settlementFee +
    traditionalCosts.recordingFees +
    traditionalCosts.courierFees +
    traditionalCosts.notaryFees

  const trueFeeClosingCosts: CostBreakdown = {
    titleInsurance: titleInsurance.trueFeeClosing,
    settlementFee: settlementFee.trueFeeClosing,
    recordingFees, // Same
    courierFees: miscFees.courier.trueFeeClosing,
    notaryFees: miscFees.notary.trueFeeClosing,
    total: 0
  }
  trueFeeClosingCosts.total =
    trueFeeClosingCosts.titleInsurance +
    trueFeeClosingCosts.settlementFee +
    trueFeeClosingCosts.recordingFees +
    trueFeeClosingCosts.courierFees +
    trueFeeClosingCosts.notaryFees

  // Calculate savings
  const savings = traditionalCosts.total - trueFeeClosingCosts.total
  const savingsPercentage = Math.round((savings / traditionalCosts.total) * 100)

  // Build line items for display
  const lineItems = [
    {
      name: 'Title Insurance Premium',
      traditional: traditionalCosts.titleInsurance,
      trueFeeClosing: trueFeeClosingCosts.titleInsurance,
      savings: traditionalCosts.titleInsurance - trueFeeClosingCosts.titleInsurance
    },
    {
      name: 'Settlement/Escrow Fee',
      traditional: traditionalCosts.settlementFee,
      trueFeeClosing: trueFeeClosingCosts.settlementFee,
      savings: traditionalCosts.settlementFee - trueFeeClosingCosts.settlementFee
    },
    {
      name: 'Recording Fees',
      traditional: traditionalCosts.recordingFees,
      trueFeeClosing: trueFeeClosingCosts.recordingFees,
      savings: 0
    },
    {
      name: 'Courier Fees',
      traditional: traditionalCosts.courierFees,
      trueFeeClosing: trueFeeClosingCosts.courierFees,
      savings: traditionalCosts.courierFees - trueFeeClosingCosts.courierFees
    },
    {
      name: 'Notary Fees',
      traditional: traditionalCosts.notaryFees,
      trueFeeClosing: trueFeeClosingCosts.notaryFees,
      savings: 0
    }
  ]

  return {
    traditionalCosts,
    trueFeeClosingCosts,
    savings: Math.round(savings * 100) / 100,
    savingsPercentage,
    lineItems
  }
}

/**
 * Get list of supported states
 */
export function getSupportedStates(): Array<{ code: string; name: string }> {
  return [
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'NY', name: 'New York' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'IL', name: 'Illinois' },
    { code: 'OH', name: 'Ohio' },
    { code: 'GA', name: 'Georgia' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'MI', name: 'Michigan' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'IN', name: 'Indiana' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MD', name: 'Maryland' },
    { code: 'WI', name: 'Wisconsin' }
  ]
}
