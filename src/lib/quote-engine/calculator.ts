import {
  QuoteEngineInput,
  QuoteOutput,
  LineItem,
  LineItemGroup,
  QuoteTotals,
  SavingsSummary,
} from './types'
import { getStateConfig, getCountyConfig } from './config/states'
import { defaultFeeSchedule, estimatedRates } from './config/fee-schedule'
import { generateQuoteId } from './utils'

export class QuoteCalculator {
  /**
   * Calculate a complete quote with all line items, totals, and savings
   */
  static calculate(input: QuoteEngineInput): QuoteOutput {
    const stateConfig = getStateConfig(input.state)
    const countyOverrides = getCountyConfig(input.state, input.county)

    // Merge state and county configs
    const effectiveConfig = {
      ...stateConfig,
      ...countyOverrides,
    }

    // Calculate all line items
    const lenderFeesGroup = this.calculateLenderFees(input)
    const thirdPartyFeesGroup = this.calculateThirdPartyFees(input)
    const governmentFeesGroup = this.calculateGovernmentFees(input, effectiveConfig)
    const prepaidItemsGroup = this.calculatePrepaidItems(input)

    // Calculate totals
    const totals = this.calculateTotals(
      [lenderFeesGroup, thirdPartyFeesGroup, governmentFeesGroup, prepaidItemsGroup],
      input
    )

    // Calculate savings
    const savingsSummary = this.calculateSavings(totals, input.competitorQuoteTotal)

    // Generate disclaimers
    const disclaimers = this.generateDisclaimers(input, effectiveConfig)

    // Set expiration (quotes valid for 30 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    return {
      quoteId: generateQuoteId(),
      timestamp: new Date(),
      input,
      lineItemGroups: [
        lenderFeesGroup,
        thirdPartyFeesGroup,
        governmentFeesGroup,
        prepaidItemsGroup,
      ],
      totals,
      savingsSummary,
      disclaimers,
      expiresAt,
    }
  }

  /**
   * Calculate lender fees (A. Origination Charges)
   */
  private static calculateLenderFees(input: QuoteEngineInput): LineItemGroup {
    const schedule = defaultFeeSchedule
    const items: LineItem[] = []

    // Origination fee
    const originationAmount =
      typeof schedule.originationFee === 'function'
        ? schedule.originationFee(input.loanAmount)
        : schedule.originationFee
    items.push({
      category: 'Lender Fees',
      name: 'Origination Fee',
      amount: originationAmount,
      description: '1% of loan amount',
    })

    // Underwriting fee
    items.push({
      category: 'Lender Fees',
      name: 'Underwriting Fee',
      amount: schedule.underwritingFee,
      description: 'Loan review and approval',
    })

    // Processing fee
    items.push({
      category: 'Lender Fees',
      name: 'Processing Fee',
      amount: schedule.processingFee,
      description: 'Loan file preparation',
    })

    // Application fee
    items.push({
      category: 'Lender Fees',
      name: 'Application Fee',
      amount: schedule.applicationFee,
      description: 'Initial application processing',
    })

    // Product premium
    const productPremium = schedule.productPremiums[input.productChoice]
    if (productPremium > 0) {
      items.push({
        category: 'Lender Fees',
        name: `${input.productChoice.charAt(0).toUpperCase() + input.productChoice.slice(1)} Product Premium`,
        amount: productPremium,
        description: 'Enhanced service package',
        isOptional: true,
      })
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      title: 'A. Origination Charges',
      items,
      subtotal,
    }
  }

  /**
   * Calculate third-party fees (B. Services You Cannot Shop For, C. Services You Can Shop For)
   */
  private static calculateThirdPartyFees(input: QuoteEngineInput): LineItemGroup {
    const schedule = defaultFeeSchedule
    const items: LineItem[] = []

    // Appraisal
    items.push({
      category: 'Third Party',
      name: 'Appraisal Fee',
      amount: schedule.appraisalFee,
      description: 'Property valuation',
      isThirdParty: true,
    })

    // Credit report
    items.push({
      category: 'Third Party',
      name: 'Credit Report Fee',
      amount: schedule.creditReportFee,
      description: 'Credit history verification',
      isThirdParty: true,
    })

    // Flood certification
    items.push({
      category: 'Third Party',
      name: 'Flood Certification',
      amount: schedule.floodCertificationFee,
      description: 'Flood zone determination',
      isThirdParty: true,
    })

    // Title insurance
    const titleInsuranceAmount = (input.purchasePrice / 1000) * schedule.titleInsuranceRate
    items.push({
      category: 'Third Party',
      name: "Lender's Title Insurance",
      amount: titleInsuranceAmount,
      description: 'Title policy protection',
      isThirdParty: true,
    })

    // Title search
    items.push({
      category: 'Third Party',
      name: 'Title Search Fee',
      amount: schedule.titleSearchFee,
      description: 'Title examination',
      isThirdParty: true,
    })

    // Settlement/closing fee
    items.push({
      category: 'Third Party',
      name: 'Settlement/Closing Fee',
      amount: schedule.settlementFee,
      description: 'Closing coordination',
      isThirdParty: true,
    })

    // Survey (for purchase only)
    if (input.transactionType === 'purchase') {
      items.push({
        category: 'Third Party',
        name: 'Survey Fee',
        amount: schedule.surveyFee,
        description: 'Property boundary survey',
        isThirdParty: true,
        isOptional: true,
      })

      // Pest inspection
      items.push({
        category: 'Third Party',
        name: 'Pest Inspection',
        amount: schedule.pestInspectionFee,
        description: 'Termite and pest inspection',
        isThirdParty: true,
        isOptional: true,
      })
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      title: 'B. Third-Party Services',
      items,
      subtotal,
    }
  }

  /**
   * Calculate government fees and taxes (E. Taxes and Government Fees)
   */
  private static calculateGovernmentFees(
    input: QuoteEngineInput,
    config: any
  ): LineItemGroup {
    const items: LineItem[] = []

    // Recording fee
    const recordingFeeBase = config.recordingFeeBase || 50
    const recordingFeePerPage = config.recordingFeePerPage || 0
    const estimatedPages = 15
    const totalRecordingFee = recordingFeeBase + recordingFeePerPage * estimatedPages

    items.push({
      category: 'Government',
      name: 'Recording Fee',
      amount: totalRecordingFee,
      description: `County recording (${config.stateName})`,
    })

    // Transfer tax (for purchase transactions)
    if (input.transactionType === 'purchase') {
      let transferTax = 0
      if (config.transferTaxType === 'percentage') {
        transferTax = input.purchasePrice * (config.transferTaxRate / 100)
      } else {
        transferTax = (input.purchasePrice / 1000) * config.transferTaxRate
      }

      if (transferTax > 0) {
        items.push({
          category: 'Government',
          name: 'Transfer Tax',
          amount: transferTax,
          description: `${config.stateName} transfer tax`,
        })
      }
    }

    // Recording tax on mortgage
    if (config.recordingTaxRate > 0) {
      let recordingTax = 0
      if (config.recordingTaxType === 'percentage') {
        recordingTax = input.loanAmount * (config.recordingTaxRate / 100)
      } else {
        recordingTax = (input.loanAmount / 1000) * config.recordingTaxRate
      }

      items.push({
        category: 'Government',
        name: 'Mortgage Recording Tax',
        amount: recordingTax,
        description: 'State mortgage tax',
      })
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      title: 'E. Taxes and Government Fees',
      items,
      subtotal,
    }
  }

  /**
   * Calculate prepaid items (F. Prepaids)
   */
  private static calculatePrepaidItems(input: QuoteEngineInput): LineItemGroup {
    const schedule = defaultFeeSchedule
    const items: LineItem[] = []

    // Prepaid interest
    const perDiemCalculator = schedule.prepaidInterestPerDiem
    const perDiem =
      typeof perDiemCalculator === 'function'
        ? perDiemCalculator(input.loanAmount, estimatedRates.mortgageInterestRate)
        : perDiemCalculator

    const prepaidInterestTotal = perDiem * schedule.prepaidInterestDays

    items.push({
      category: 'Prepaids',
      name: 'Prepaid Interest',
      amount: prepaidInterestTotal,
      description: `${schedule.prepaidInterestDays} days at ${perDiem.toFixed(2)}/day`,
    })

    // Homeowners insurance
    const insuranceTotal =
      (estimatedRates.annualHomeownersInsurance / 12) * schedule.homeownersInsuranceMonths

    items.push({
      category: 'Prepaids',
      name: 'Homeowners Insurance Premium',
      amount: insuranceTotal,
      description: `${schedule.homeownersInsuranceMonths} months`,
    })

    // Property taxes
    const annualPropertyTax =
      input.purchasePrice * (estimatedRates.annualPropertyTaxRate / 100)
    const propertyTaxTotal = (annualPropertyTax / 12) * schedule.propertyTaxMonths

    items.push({
      category: 'Prepaids',
      name: 'Property Taxes',
      amount: propertyTaxTotal,
      description: `${schedule.propertyTaxMonths} months`,
    })

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      title: 'F. Prepaids',
      items,
      subtotal,
    }
  }

  /**
   * Calculate all totals
   */
  private static calculateTotals(
    groups: LineItemGroup[],
    input: QuoteEngineInput
  ): QuoteTotals {
    let lenderFees = 0
    let thirdPartyFees = 0
    let governmentFees = 0
    let prepaidItems = 0

    groups.forEach((group) => {
      if (group.title.includes('Origination')) {
        lenderFees = group.subtotal
      } else if (group.title.includes('Third-Party')) {
        thirdPartyFees = group.subtotal
      } else if (group.title.includes('Taxes and Government')) {
        governmentFees = group.subtotal
      } else if (group.title.includes('Prepaids')) {
        prepaidItems = group.subtotal
      }
    })

    const totalClosingCosts = lenderFees + thirdPartyFees + governmentFees + prepaidItems
    const downPayment = input.purchasePrice - input.loanAmount
    const cashToClose =
      input.transactionType === 'purchase'
        ? downPayment + totalClosingCosts
        : totalClosingCosts

    return {
      lenderFees,
      thirdPartyFees,
      governmentFees,
      prepaidItems,
      totalClosingCosts,
      totalLoanAmount: input.loanAmount,
      cashToClose,
    }
  }

  /**
   * Calculate savings vs competitor
   */
  private static calculateSavings(
    totals: QuoteTotals,
    competitorTotal?: number
  ): SavingsSummary {
    if (!competitorTotal) {
      return {
        hasSavings: false,
        ourTotal: totals.totalClosingCosts,
      }
    }

    const savings = competitorTotal - totals.totalClosingCosts
    const savingsPercentage = (savings / competitorTotal) * 100

    return {
      hasSavings: savings > 0,
      competitorTotal,
      ourTotal: totals.totalClosingCosts,
      savings: savings > 0 ? savings : undefined,
      savingsPercentage: savings > 0 ? savingsPercentage : undefined,
    }
  }

  /**
   * Generate disclaimers
   */
  private static generateDisclaimers(
    input: QuoteEngineInput,
    config: any
  ): string[] {
    const disclaimers = [
      'This is a good faith estimate of closing costs. Actual costs may vary.',
      'Interest rate not included in this estimate. Final rate subject to credit approval and market conditions.',
      'Third-party fees are estimates and may vary based on service provider selection.',
      'This estimate is valid for 30 days from the date of issue.',
      `Transaction type: ${input.transactionType.charAt(0).toUpperCase() + input.transactionType.slice(1)}`,
    ]

    // Add state-specific disclaimers
    if (config.stateSpecificDisclosures) {
      disclaimers.push(...config.stateSpecificDisclosures)
    }

    // Add product-specific disclaimer
    if (input.productChoice === 'premium') {
      disclaimers.push(
        'Premium product includes enhanced underwriting, expedited processing, and dedicated support.'
      )
    }

    return disclaimers
  }
}
