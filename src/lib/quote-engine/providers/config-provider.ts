import { QuoteEngineInput, QuoteOutput } from '../types'
import { BaseQuoteProvider } from './base-provider'
import { QuoteCalculator } from '../calculator'

/**
 * Config-based quote provider using local calculation rules
 * This is the default provider using state configs and fee schedules
 */
export class ConfigBasedQuoteProvider extends BaseQuoteProvider {
  readonly name = 'ConfigBasedProvider'

  async calculate(input: QuoteEngineInput): Promise<QuoteOutput> {
    this.validateInput(input)
    this.log('Calculating quote', { state: input.state, county: input.county })

    try {
      const quote = QuoteCalculator.calculate(input)
      this.log('Quote calculated successfully', { quoteId: quote.quoteId })
      return quote
    } catch (error) {
      this.log('Error calculating quote', error)
      throw new Error(
        `Failed to calculate quote: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async healthCheck(): Promise<boolean> {
    // For config-based provider, we just check if we can perform a basic calculation
    try {
      const testInput: QuoteEngineInput = {
        state: 'CA',
        county: 'Test',
        purchasePrice: 500000,
        loanAmount: 400000,
        transactionType: 'purchase',
        productChoice: 'standard',
      }
      await this.calculate(testInput)
      return true
    } catch {
      return false
    }
  }
}
