import {
  generateQuoteId,
  formatCurrency,
  formatPercentage,
  roundTo2Decimals,
  formatQuoteForDisplay,
} from '../utils'
import { QuoteOutput, QuoteEngineInput } from '../types'

describe('Quote Engine Utils', () => {
  describe('generateQuoteId', () => {
    it('should generate unique quote IDs', () => {
      const id1 = generateQuoteId()
      const id2 = generateQuoteId()

      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with correct format', () => {
      const id = generateQuoteId()

      expect(id).toMatch(/^Q-[A-Z0-9]+-[A-Z0-9]+$/)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })

    it('should always show 2 decimal places', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(100.5)).toBe('$100.50')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages with default decimals', () => {
      expect(formatPercentage(15.5)).toBe('15.50%')
      expect(formatPercentage(100)).toBe('100.00%')
    })

    it('should format percentages with custom decimals', () => {
      expect(formatPercentage(15.555, 3)).toBe('15.555%')
      expect(formatPercentage(15.555, 1)).toBe('15.6%')
      expect(formatPercentage(15.555, 0)).toBe('16%')
    })
  })

  describe('roundTo2Decimals', () => {
    it('should round numbers to 2 decimal places', () => {
      expect(roundTo2Decimals(1.234)).toBe(1.23)
      expect(roundTo2Decimals(1.235)).toBe(1.24)
      expect(roundTo2Decimals(1.9999)).toBe(2.0)
    })

    it('should handle whole numbers', () => {
      expect(roundTo2Decimals(5)).toBe(5)
      expect(roundTo2Decimals(100)).toBe(100)
    })
  })

  describe('formatQuoteForDisplay', () => {
    const mockQuote: QuoteOutput = {
      quoteId: 'Q-TEST-123',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      expiresAt: new Date('2024-01-31T12:00:00Z'),
      input: {
        state: 'CA',
        county: 'Los Angeles',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      },
      lineItemGroups: [
        {
          title: 'A. Origination Charges',
          items: [
            {
              category: 'Lender Fees',
              name: 'Origination Fee',
              amount: 4000,
              description: '1% of loan amount',
            },
          ],
          subtotal: 4000,
        },
      ],
      totals: {
        lenderFees: 4000,
        thirdPartyFees: 2000,
        governmentFees: 1000,
        prepaidItems: 3000,
        totalClosingCosts: 10000,
        totalLoanAmount: 400000,
        cashToClose: 110000,
      },
      savingsSummary: {
        hasSavings: true,
        competitorTotal: 12000,
        ourTotal: 10000,
        savings: 2000,
        savingsPercentage: 16.67,
      },
      disclaimers: ['This is a test disclaimer'],
    }

    it('should format complete quote for display', () => {
      const formatted = formatQuoteForDisplay(mockQuote)

      expect(formatted).toContain('Q-TEST-123')
      expect(formatted).toContain('CA')
      expect(formatted).toContain('Los Angeles')
      expect(formatted).toContain('$500,000')
      expect(formatted).toContain('$400,000')
    })

    it('should include all line items', () => {
      const formatted = formatQuoteForDisplay(mockQuote)

      expect(formatted).toContain('A. Origination Charges')
      expect(formatted).toContain('Origination Fee')
      expect(formatted).toContain('$4,000')
    })

    it('should include totals section', () => {
      const formatted = formatQuoteForDisplay(mockQuote)

      expect(formatted).toContain('TOTALS')
      expect(formatted).toContain('Lender Fees: $4,000')
      expect(formatted).toContain('TOTAL CLOSING COSTS: $10,000')
    })

    it('should include savings summary when present', () => {
      const formatted = formatQuoteForDisplay(mockQuote)

      expect(formatted).toContain('SAVINGS SUMMARY')
      expect(formatted).toContain('Competitor Quote: $12,000')
      expect(formatted).toContain('YOUR SAVINGS: $2,000')
      expect(formatted).toContain('16.67%')
    })

    it('should include disclaimers', () => {
      const formatted = formatQuoteForDisplay(mockQuote)

      expect(formatted).toContain('DISCLAIMERS')
      expect(formatted).toContain('This is a test disclaimer')
    })

    it('should handle quote without savings', () => {
      const quoteNoSavings: QuoteOutput = {
        ...mockQuote,
        savingsSummary: {
          hasSavings: false,
          ourTotal: 10000,
        },
      }

      const formatted = formatQuoteForDisplay(quoteNoSavings)

      expect(formatted).not.toContain('SAVINGS SUMMARY')
      expect(formatted).not.toContain('Competitor Quote')
    })
  })
})
