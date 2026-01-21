import { QuoteCalculator } from '../calculator'
import { QuoteEngineInput } from '../types'

describe('QuoteCalculator', () => {
  const validInput: QuoteEngineInput = {
    state: 'CA',
    county: 'Los Angeles',
    purchasePrice: 500000,
    loanAmount: 400000,
    transactionType: 'purchase',
    productChoice: 'standard',
  }

  describe('calculate', () => {
    it('should calculate a complete quote with all sections', () => {
      const quote = QuoteCalculator.calculate(validInput)

      expect(quote).toBeDefined()
      expect(quote.quoteId).toBeDefined()
      expect(quote.timestamp).toBeInstanceOf(Date)
      expect(quote.lineItemGroups).toHaveLength(4)
      expect(quote.totals).toBeDefined()
      expect(quote.savingsSummary).toBeDefined()
      expect(quote.disclaimers).toBeDefined()
      expect(quote.expiresAt).toBeInstanceOf(Date)
    })

    it('should include lender fees section', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const lenderFeesGroup = quote.lineItemGroups.find((g) =>
        g.title.includes('Origination')
      )

      expect(lenderFeesGroup).toBeDefined()
      expect(lenderFeesGroup!.items.length).toBeGreaterThan(0)
      expect(lenderFeesGroup!.subtotal).toBeGreaterThan(0)

      // Check for key lender fees
      const itemNames = lenderFeesGroup!.items.map((i) => i.name)
      expect(itemNames).toContain('Origination Fee')
      expect(itemNames).toContain('Underwriting Fee')
      expect(itemNames).toContain('Processing Fee')
    })

    it('should include third-party fees section', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const thirdPartyGroup = quote.lineItemGroups.find((g) =>
        g.title.includes('Third-Party')
      )

      expect(thirdPartyGroup).toBeDefined()
      expect(thirdPartyGroup!.items.length).toBeGreaterThan(0)

      // Check for key third-party fees
      const itemNames = thirdPartyGroup!.items.map((i) => i.name)
      expect(itemNames).toContain('Appraisal Fee')
      expect(itemNames).toContain('Credit Report Fee')
      expect(itemNames).toContain("Lender's Title Insurance")
    })

    it('should include government fees section', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const govFeesGroup = quote.lineItemGroups.find((g) => g.title.includes('Taxes'))

      expect(govFeesGroup).toBeDefined()
      expect(govFeesGroup!.items.length).toBeGreaterThan(0)

      // Check for recording fee
      const itemNames = govFeesGroup!.items.map((i) => i.name)
      expect(itemNames).toContain('Recording Fee')
    })

    it('should include prepaids section', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const prepaidsGroup = quote.lineItemGroups.find((g) => g.title.includes('Prepaids'))

      expect(prepaidsGroup).toBeDefined()
      expect(prepaidsGroup!.items.length).toBeGreaterThan(0)

      // Check for key prepaid items
      const itemNames = prepaidsGroup!.items.map((i) => i.name)
      expect(itemNames).toContain('Prepaid Interest')
      expect(itemNames).toContain('Homeowners Insurance Premium')
      expect(itemNames).toContain('Property Taxes')
    })

    it('should calculate correct totals', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const { totals } = quote

      expect(totals.lenderFees).toBeGreaterThan(0)
      expect(totals.thirdPartyFees).toBeGreaterThan(0)
      expect(totals.governmentFees).toBeGreaterThan(0)
      expect(totals.prepaidItems).toBeGreaterThan(0)

      // Total closing costs should equal sum of all categories
      const calculatedTotal =
        totals.lenderFees +
        totals.thirdPartyFees +
        totals.governmentFees +
        totals.prepaidItems

      expect(totals.totalClosingCosts).toBeCloseTo(calculatedTotal, 2)
    })

    it('should calculate cash to close for purchase', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const downPayment = validInput.purchasePrice - validInput.loanAmount

      expect(quote.totals.cashToClose).toBeCloseTo(
        downPayment + quote.totals.totalClosingCosts,
        2
      )
    })

    it('should calculate cash to close for refinance', () => {
      const refinanceInput: QuoteEngineInput = {
        ...validInput,
        transactionType: 'refinance',
      }

      const quote = QuoteCalculator.calculate(refinanceInput)

      // For refinance, cash to close should equal closing costs (no down payment)
      expect(quote.totals.cashToClose).toBeCloseTo(quote.totals.totalClosingCosts, 2)
    })
  })

  describe('product choice', () => {
    it('should add premium fee for premium product', () => {
      const premiumInput: QuoteEngineInput = {
        ...validInput,
        productChoice: 'premium',
      }

      const quote = QuoteCalculator.calculate(premiumInput)
      const lenderFeesGroup = quote.lineItemGroups.find((g) =>
        g.title.includes('Origination')
      )

      const premiumItem = lenderFeesGroup!.items.find((i) => i.name.includes('Premium'))
      expect(premiumItem).toBeDefined()
      expect(premiumItem!.amount).toBeGreaterThan(0)
    })

    it('should not add premium fee for basic product', () => {
      const basicInput: QuoteEngineInput = {
        ...validInput,
        productChoice: 'basic',
      }

      const quote = QuoteCalculator.calculate(basicInput)
      const lenderFeesGroup = quote.lineItemGroups.find((g) =>
        g.title.includes('Origination')
      )

      const basicItem = lenderFeesGroup!.items.find((i) => i.name.includes('Basic'))
      expect(basicItem).toBeUndefined() // Basic has no premium
    })
  })

  describe('state-specific fees', () => {
    it('should apply California transfer tax for purchase', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const govFeesGroup = quote.lineItemGroups.find((g) => g.title.includes('Taxes'))

      const transferTax = govFeesGroup!.items.find((i) => i.name.includes('Transfer Tax'))
      expect(transferTax).toBeDefined()
      expect(transferTax!.amount).toBeGreaterThan(0)
    })

    it('should not apply transfer tax for refinance', () => {
      const refinanceInput: QuoteEngineInput = {
        ...validInput,
        transactionType: 'refinance',
      }

      const quote = QuoteCalculator.calculate(refinanceInput)
      const govFeesGroup = quote.lineItemGroups.find((g) => g.title.includes('Taxes'))

      const transferTax = govFeesGroup!.items.find((i) => i.name.includes('Transfer Tax'))
      expect(transferTax).toBeUndefined()
    })

    it('should apply county-specific fees for Los Angeles', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const govFeesGroup = quote.lineItemGroups.find((g) => g.title.includes('Taxes'))

      // LA County should have higher transfer tax rate
      expect(govFeesGroup!.subtotal).toBeGreaterThan(0)
    })

    it('should handle different state configurations', () => {
      const texasInput: QuoteEngineInput = {
        ...validInput,
        state: 'TX',
        county: 'Harris',
      }

      const quote = QuoteCalculator.calculate(texasInput)
      expect(quote).toBeDefined()
      expect(quote.disclaimers).toEqual(
        expect.arrayContaining([expect.stringContaining('Texas')])
      )
    })
  })

  describe('savings calculation', () => {
    it('should calculate savings when competitor quote provided', () => {
      const inputWithCompetitor: QuoteEngineInput = {
        ...validInput,
        competitorQuoteTotal: 15000,
      }

      const quote = QuoteCalculator.calculate(inputWithCompetitor)

      expect(quote.savingsSummary.hasSavings).toBe(true)
      expect(quote.savingsSummary.competitorTotal).toBe(15000)
      expect(quote.savingsSummary.ourTotal).toBeLessThan(15000)
      expect(quote.savingsSummary.savings).toBeGreaterThan(0)
      expect(quote.savingsSummary.savingsPercentage).toBeGreaterThan(0)
    })

    it('should handle no savings when our quote is higher', () => {
      const inputWithLowerCompetitor: QuoteEngineInput = {
        ...validInput,
        competitorQuoteTotal: 1000, // Unrealistically low
      }

      const quote = QuoteCalculator.calculate(inputWithLowerCompetitor)

      expect(quote.savingsSummary.hasSavings).toBe(false)
      expect(quote.savingsSummary.savings).toBeUndefined()
    })

    it('should not show savings when no competitor quote', () => {
      const quote = QuoteCalculator.calculate(validInput)

      expect(quote.savingsSummary.hasSavings).toBe(false)
      expect(quote.savingsSummary.competitorTotal).toBeUndefined()
      expect(quote.savingsSummary.savings).toBeUndefined()
    })
  })

  describe('disclaimers', () => {
    it('should include general disclaimers', () => {
      const quote = QuoteCalculator.calculate(validInput)

      expect(quote.disclaimers).toEqual(
        expect.arrayContaining([
          expect.stringContaining('good faith estimate'),
          expect.stringContaining('valid for 30 days'),
        ])
      )
    })

    it('should include state-specific disclaimers', () => {
      const quote = QuoteCalculator.calculate(validInput)

      expect(quote.disclaimers).toEqual(
        expect.arrayContaining([expect.stringContaining('California')])
      )
    })

    it('should include product-specific disclaimers for premium', () => {
      const premiumInput: QuoteEngineInput = {
        ...validInput,
        productChoice: 'premium',
      }

      const quote = QuoteCalculator.calculate(premiumInput)

      expect(quote.disclaimers).toEqual(
        expect.arrayContaining([expect.stringContaining('Premium product')])
      )
    })
  })

  describe('expiration', () => {
    it('should set expiration 30 days from now', () => {
      const quote = QuoteCalculator.calculate(validInput)
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      expect(quote.expiresAt.getTime()).toBeGreaterThan(now.getTime())
      expect(quote.expiresAt.getTime()).toBeLessThanOrEqual(thirtyDaysFromNow.getTime())
    })
  })
})
