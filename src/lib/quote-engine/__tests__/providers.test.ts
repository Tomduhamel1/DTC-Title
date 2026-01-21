import { ConfigBasedQuoteProvider } from '../providers/config-provider'
import { QuoteProviderFactory } from '../providers/factory'
import { QuoteEngineInput } from '../types'

describe('Quote Providers', () => {
  const validInput: QuoteEngineInput = {
    state: 'CA',
    county: 'Los Angeles',
    purchasePrice: 500000,
    loanAmount: 400000,
    transactionType: 'purchase',
    productChoice: 'standard',
  }

  describe('ConfigBasedQuoteProvider', () => {
    let provider: ConfigBasedQuoteProvider

    beforeEach(() => {
      provider = new ConfigBasedQuoteProvider()
    })

    it('should have correct name', () => {
      expect(provider.name).toBe('ConfigBasedProvider')
    })

    it('should calculate quote successfully', async () => {
      const quote = await provider.calculate(validInput)

      expect(quote).toBeDefined()
      expect(quote.quoteId).toBeDefined()
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })

    it('should reject invalid input - zero loan amount', async () => {
      const invalidInput: QuoteEngineInput = {
        ...validInput,
        loanAmount: 0,
      }

      await expect(provider.calculate(invalidInput)).rejects.toThrow()
    })

    it('should reject invalid input - negative purchase price', async () => {
      const invalidInput: QuoteEngineInput = {
        ...validInput,
        purchasePrice: -100000,
      }

      await expect(provider.calculate(invalidInput)).rejects.toThrow()
    })

    it('should reject invalid input - loan exceeds purchase price', async () => {
      const invalidInput: QuoteEngineInput = {
        ...validInput,
        loanAmount: 600000,
        purchasePrice: 500000,
      }

      await expect(provider.calculate(invalidInput)).rejects.toThrow()
    })

    it('should reject invalid input - missing state', async () => {
      const invalidInput: QuoteEngineInput = {
        ...validInput,
        state: '',
      }

      await expect(provider.calculate(invalidInput)).rejects.toThrow()
    })

    it('should reject invalid input - missing county', async () => {
      const invalidInput: QuoteEngineInput = {
        ...validInput,
        county: '',
      }

      await expect(provider.calculate(invalidInput)).rejects.toThrow()
    })

    it('should pass health check', async () => {
      const healthy = await provider.healthCheck()
      expect(healthy).toBe(true)
    })
  })

  describe('QuoteProviderFactory', () => {
    beforeEach(() => {
      // Reset factory before each test
      QuoteProviderFactory.resetProvider()
    })

    it('should return config provider by default', () => {
      const provider = QuoteProviderFactory.getProvider()
      expect(provider.name).toBe('ConfigBasedProvider')
    })

    it('should create config provider explicitly', () => {
      const provider = QuoteProviderFactory.createProvider('config')
      expect(provider.name).toBe('ConfigBasedProvider')
    })

    it('should create external provider with config', () => {
      const provider = QuoteProviderFactory.createProvider('external', {
        apiUrl: 'https://api.example.com',
        apiKey: 'test-key',
      })
      expect(provider.name).toBe('ExternalAPIProvider')
    })

    it('should throw error when creating external provider without config', () => {
      expect(() => {
        QuoteProviderFactory.createProvider('external')
      }).toThrow()
    })

    it('should reuse singleton instance', () => {
      const provider1 = QuoteProviderFactory.getProvider()
      const provider2 = QuoteProviderFactory.getProvider()
      expect(provider1).toBe(provider2)
    })

    it('should allow setting custom provider', () => {
      const customProvider = new ConfigBasedQuoteProvider()
      QuoteProviderFactory.setProvider(customProvider)

      const provider = QuoteProviderFactory.getProvider()
      expect(provider).toBe(customProvider)
    })

    it('should reset provider correctly', () => {
      const provider1 = QuoteProviderFactory.getProvider()
      QuoteProviderFactory.resetProvider()
      const provider2 = QuoteProviderFactory.getProvider()

      expect(provider1).not.toBe(provider2)
    })
  })

  describe('Integration Tests', () => {
    beforeEach(() => {
      QuoteProviderFactory.resetProvider()
    })

    it('should calculate quote using factory', async () => {
      const provider = QuoteProviderFactory.getProvider()
      const quote = await provider.calculate(validInput)

      expect(quote).toBeDefined()
      expect(quote.totals.totalClosingCosts).toBeGreaterThan(0)
    })

    it('should handle multiple states correctly', async () => {
      const provider = QuoteProviderFactory.getProvider()

      const caQuote = await provider.calculate({
        ...validInput,
        state: 'CA',
        county: 'Los Angeles',
      })

      const txQuote = await provider.calculate({
        ...validInput,
        state: 'TX',
        county: 'Harris',
      })

      expect(caQuote.totals.totalClosingCosts).not.toBe(
        txQuote.totals.totalClosingCosts
      )
    })

    it('should calculate different totals for purchase vs refinance', async () => {
      const provider = QuoteProviderFactory.getProvider()

      const purchaseQuote = await provider.calculate({
        ...validInput,
        transactionType: 'purchase',
      })

      const refinanceQuote = await provider.calculate({
        ...validInput,
        transactionType: 'refinance',
      })

      // Purchase should have transfer taxes that refinance doesn't
      expect(purchaseQuote.totals.governmentFees).toBeGreaterThan(
        refinanceQuote.totals.governmentFees
      )
    })

    it('should calculate different totals for different product choices', async () => {
      const provider = QuoteProviderFactory.getProvider()

      const basicQuote = await provider.calculate({
        ...validInput,
        productChoice: 'basic',
      })

      const premiumQuote = await provider.calculate({
        ...validInput,
        productChoice: 'premium',
      })

      // Premium should cost more than basic
      expect(premiumQuote.totals.lenderFees).toBeGreaterThan(basicQuote.totals.lenderFees)
    })
  })
})
