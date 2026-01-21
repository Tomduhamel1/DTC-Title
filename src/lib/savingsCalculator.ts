// Savings calculation logic for AI Calculator

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
}

// State-based title insurance rates (average per $100k home value)
const STATE_RATES: Record<string, number> = {
  'Texas': 320,
  'California': 320,
  'Florida': 575,
  'New York': 400,
  'Pennsylvania': 350,
  'Illinois': 300,
  'Ohio': 280,
  'Georgia': 290,
  'North Carolina': 270,
  'Michigan': 260,
  'Default': 300
}

// Calculate base title insurance cost for state and home value
function calculateBaseTitleCost(state: string, homeValue: number): number {
  const ratePerHundredK = STATE_RATES[state] || STATE_RATES['Default']
  return (homeValue / 100000) * ratePerHundredK
}

// Calculate average closing costs (title insurance + other fees)
function calculateAverageClosingCost(state: string, homeValue: number, transactionType: 'purchase' | 'refinance'): number {
  const titleInsurance = calculateBaseTitleCost(state, homeValue)

  // Add other typical closing costs
  const lenderFees = transactionType === 'purchase' ? 1500 : 1200
  const appraisalFee = 500
  const creditReportFee = 50
  const floodCertFee = 25
  const titleSearchFee = 300
  const recordingFees = 150
  const surveyFee = transactionType === 'purchase' ? 400 : 0

  return titleInsurance + lenderFees + appraisalFee + creditReportFee +
         floodCertFee + titleSearchFee + recordingFees + surveyFee
}

export function calculateSavings(
  transactionType: 'purchase' | 'refinance',
  homeValue: number,
  state: string,
  factors: SavingsFactors
): SavingsBreakdown {
  // Base savings: 35% off title insurance
  const baseTitleCost = calculateBaseTitleCost(state, homeValue)
  const baseSavings = Math.round(baseTitleCost * 0.35)

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
  const totalSavings = baseSavings + remoteSavings + docsSavings + titleSavings

  // Calculate closing costs
  const averageClosingCost = calculateAverageClosingCost(state, homeValue, transactionType)
  const estimatedClosingCost = averageClosingCost - totalSavings

  // Monthly payment impact (amortized over 30 years)
  // Assumes closing costs would be financed at ~7% interest
  const monthlyRate = 0.07 / 12
  const numPayments = 360 // 30 years

  const averageMonthlyImpact = (averageClosingCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                                (Math.pow(1 + monthlyRate, numPayments) - 1)

  const estimatedMonthlyImpact = (estimatedClosingCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                                  (Math.pow(1 + monthlyRate, numPayments) - 1)

  return {
    baseSavings,
    remoteSavings,
    docsSavings,
    titleSavings,
    totalSavings: Math.max(0, totalSavings), // Never show negative savings
    estimatedClosingCost: Math.round(estimatedClosingCost),
    averageClosingCost: Math.round(averageClosingCost),
    estimatedMonthlyImpact: Math.round(estimatedMonthlyImpact),
    averageMonthlyImpact: Math.round(averageMonthlyImpact)
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
