/**
 * Integration tests demonstrating real-world usage scenarios
 */

import { QuoteEngine, formatCurrency, formatQuoteForDisplay } from '../index'
import { QuoteEngineInput } from '../types'

describe('Quote Engine Integration Tests', () => {
  describe('Real-world scenarios', () => {
    it('should generate quote for first-time homebuyer in California', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'San Diego',
        purchasePrice: 650000,
        loanAmount: 585000, // 10% down
        transactionType: 'purchase',
        productChoice: 'standard',
      }

      const quote = await QuoteEngine.calculate(input)

      // Verify quote is generated
      expect(quote.quoteId).toBeDefined()
      expect(quote.quoteId).toMatch(/^Q-/)

      // Verify all sections are present
      expect(quote.lineItemGroups).toHaveLength(4)

      // Verify totals are reasonable
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(10000)
      expect(quote.totals.totalClosingCosts).toBeLessThan(50000)

      // Verify cash to close includes down payment
      const downPayment = input.purchasePrice - input.loanAmount
      expect(quote.totals.cashToClose).toBeGreaterThan(downPayment)

      // Verify expiration is set
      const now = new Date()
      expect(quote.expiresAt.getTime()).toBeGreaterThan(now.getTime())
    })

    it('should generate quote for refinance in Texas', async () => {
      const input: QuoteEngineInput = {
        state: 'TX',
        county: 'Dallas',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'refinance',
        productChoice: 'premium',
      }

      const quote = await QuoteEngine.calculate(input)

      // Verify quote is generated
      expect(quote.quoteId).toBeDefined()

      // For refinance, cash to close should equal closing costs (no down payment)
      expect(quote.totals.cashToClose).toBe(quote.totals.totalClosingCosts)

      // Texas should have no transfer tax
      const govFeesGroup = quote.lineItemGroups.find((g) =>
        g.title.includes('Taxes and Government')
      )
      const transferTax = govFeesGroup?.items.find((i) => i.name.includes('Transfer Tax'))
      expect(transferTax).toBeUndefined()

      // Premium product should have higher lender fees
      expect(quote.totals.lenderFees).toBeGreaterThan(5000)
    })

    it('should calculate savings vs competitor quote', async () => {
      const competitorTotal = 18000

      const input: QuoteEngineInput = {
        state: 'FL',
        county: 'Miami-Dade',
        purchasePrice: 450000,
        loanAmount: 360000,
        transactionType: 'purchase',
        productChoice: 'standard',
        competitorQuoteTotal: competitorTotal,
      }

      const quote = await QuoteEngine.calculate(input)

      // Should show savings if our quote is lower
      if (quote.totals.totalClosingCosts < competitorTotal) {
        expect(quote.savingsSummary.hasSavings).toBe(true)
        expect(quote.savingsSummary.savings).toBeGreaterThan(0)
        expect(quote.savingsSummary.savingsPercentage).toBeGreaterThan(0)

        // Verify savings calculation
        const expectedSavings = competitorTotal - quote.totals.totalClosingCosts
        expect(quote.savingsSummary.savings).toBeCloseTo(expectedSavings, 2)
      }
    })

    it('should handle high-value property in New York', async () => {
      const input: QuoteEngineInput = {
        state: 'NY',
        county: 'New York', // Manhattan
        purchasePrice: 2000000,
        loanAmount: 1600000,
        transactionType: 'purchase',
        productChoice: 'premium',
      }

      const quote = await QuoteEngine.calculate(input)

      // NYC should have significantly higher government fees
      expect(quote.totals.governmentFees).toBeGreaterThan(50000)

      // Should include mansion tax disclosure
      expect(quote.disclaimers.some((d) => d.includes('Mansion Tax'))).toBe(true)
    })

    it('should generate different quotes for different product choices', async () => {
      const baseInput: QuoteEngineInput = {
        state: 'WA',
        county: 'King',
        purchasePrice: 700000,
        loanAmount: 560000,
        transactionType: 'purchase',
        productChoice: 'basic',
      }

      const basicQuote = await QuoteEngine.calculate(baseInput)
      const standardQuote = await QuoteEngine.calculate({
        ...baseInput,
        productChoice: 'standard',
      })
      const premiumQuote = await QuoteEngine.calculate({
        ...baseInput,
        productChoice: 'premium',
      })

      // Lender fees should increase with product tier
      expect(basicQuote.totals.lenderFees).toBeLessThan(standardQuote.totals.lenderFees)
      expect(standardQuote.totals.lenderFees).toBeLessThan(premiumQuote.totals.lenderFees)

      // Total costs should increase with product tier
      expect(basicQuote.totals.totalClosingCosts).toBeLessThan(
        standardQuote.totals.totalClosingCosts
      )
      expect(standardQuote.totals.totalClosingCosts).toBeLessThan(
        premiumQuote.totals.totalClosingCosts
      )
    })
  })

  describe('Output formatting', () => {
    it('should format quote for display', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'Los Angeles',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      }

      const quote = await QuoteEngine.calculate(input)
      const formatted = formatQuoteForDisplay(quote)

      // Should include key information
      expect(formatted).toContain(quote.quoteId)
      expect(formatted).toContain('CA')
      expect(formatted).toContain('Los Angeles')
      expect(formatted).toContain('$500,000')
      expect(formatted).toContain('$400,000')
      expect(formatted).toContain('TOTALS')
      expect(formatted).toContain('DISCLAIMERS')
    })

    it('should format individual currency values correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })
  })

  describe('Edge cases', () => {
    it('should handle minimum loan amount', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'Test',
        purchasePrice: 100000,
        loanAmount: 80000,
        transactionType: 'purchase',
        productChoice: 'basic',
      }

      const quote = await QuoteEngine.calculate(input)
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })

    it('should handle maximum loan amount', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'Test',
        purchasePrice: 10000000,
        loanAmount: 8000000,
        transactionType: 'purchase',
        productChoice: 'premium',
      }

      const quote = await QuoteEngine.calculate(input)
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })

    it('should handle unknown county by using state defaults', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'UnknownCounty',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      }

      const quote = await QuoteEngine.calculate(input)
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })

    it('should handle unknown state with default config', async () => {
      const input: QuoteEngineInput = {
        state: 'ZZ', // Not a real state
        county: 'Test',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      }

      const quote = await QuoteEngine.calculate(input)
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })
  })

  describe('Health check', () => {
    it('should pass health check', async () => {
      const healthy = await QuoteEngine.healthCheck()
      expect(healthy).toBe(true)
    })

    it('should return provider name', () => {
      const providerName = QuoteEngine.getProviderName()
      expect(providerName).toBeTruthy()
      expect(typeof providerName).toBe('string')
    })
  })

  describe('Multi-state comparison', () => {
    it('should calculate different totals for same property in different states', async () => {
      const baseInput = {
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase' as const,
        productChoice: 'standard' as const,
      }

      const caQuote = await QuoteEngine.calculate({
        ...baseInput,
        state: 'CA',
        county: 'Los Angeles',
      })

      const txQuote = await QuoteEngine.calculate({
        ...baseInput,
        state: 'TX',
        county: 'Harris',
      })

      const nyQuote = await QuoteEngine.calculate({
        ...baseInput,
        state: 'NY',
        county: 'New York',
      })

      // Each state should have different government fees
      expect(caQuote.totals.governmentFees).not.toBe(txQuote.totals.governmentFees)
      expect(txQuote.totals.governmentFees).not.toBe(nyQuote.totals.governmentFees)

      // NY should have highest government fees
      expect(nyQuote.totals.governmentFees).toBeGreaterThan(caQuote.totals.governmentFees)
      expect(nyQuote.totals.governmentFees).toBeGreaterThan(txQuote.totals.governmentFees)

      // TX should have lowest government fees (no transfer tax)
      expect(txQuote.totals.governmentFees).toBeLessThan(caQuote.totals.governmentFees)
    })
  })

  describe('Quote expiration', () => {
    it('should set expiration 30 days in the future', async () => {
      const input: QuoteEngineInput = {
        state: 'CA',
        county: 'Test',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      }

      const quote = await QuoteEngine.calculate(input)

      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const thirtyOneDaysFromNow = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000)

      expect(quote.expiresAt.getTime()).toBeGreaterThan(now.getTime())
      expect(quote.expiresAt.getTime()).toBeGreaterThan(thirtyDaysFromNow.getTime() - 1000)
      expect(quote.expiresAt.getTime()).toBeLessThan(thirtyOneDaysFromNow.getTime())
    })
  })
})
