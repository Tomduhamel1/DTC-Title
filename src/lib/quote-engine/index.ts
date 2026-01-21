/**
 * Quote Engine Module
 *
 * This module provides a flexible quote calculation system with support for:
 * - Config-based calculations using state/county rules
 * - External API integration (RateCalc or similar)
 * - Easy switching between providers via environment variables
 *
 * Usage:
 *
 * import { QuoteEngine } from '@/lib/quote-engine'
 *
 * const quote = await QuoteEngine.calculate({
 *   state: 'CA',
 *   county: 'Los Angeles',
 *   purchasePrice: 500000,
 *   loanAmount: 400000,
 *   transactionType: 'purchase',
 *   productChoice: 'standard',
 * })
 */

import { QuoteEngineInput, QuoteOutput } from './types'
import { QuoteProviderFactory } from './providers/factory'
import { formatCurrency, formatPercentage, formatQuoteForDisplay } from './utils'

export class QuoteEngine {
  /**
   * Calculate a quote using the configured provider
   */
  static async calculate(input: QuoteEngineInput): Promise<QuoteOutput> {
    const provider = QuoteProviderFactory.getProvider()
    return provider.calculate(input)
  }

  /**
   * Check if the quote service is available
   */
  static async healthCheck(): Promise<boolean> {
    const provider = QuoteProviderFactory.getProvider()
    return provider.healthCheck()
  }

  /**
   * Get the name of the current provider
   */
  static getProviderName(): string {
    const provider = QuoteProviderFactory.getProvider()
    return provider.name
  }
}

// Re-export types and utilities
export * from './types'
export { formatCurrency, formatPercentage, formatQuoteForDisplay }
export { QuoteProviderFactory } from './providers/factory'
