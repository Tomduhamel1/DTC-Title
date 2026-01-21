import { QuoteEngineInput, QuoteOutput } from '../types'

/**
 * Base interface for quote providers
 * Implement this interface to create new providers (internal calculator, external API, etc.)
 */
export interface IQuoteProvider {
  /**
   * Provider name for logging and identification
   */
  readonly name: string

  /**
   * Calculate a quote
   */
  calculate(input: QuoteEngineInput): Promise<QuoteOutput>

  /**
   * Check if provider is available/healthy
   */
  healthCheck(): Promise<boolean>
}

/**
 * Base class for quote providers with common functionality
 */
export abstract class BaseQuoteProvider implements IQuoteProvider {
  abstract readonly name: string

  abstract calculate(input: QuoteEngineInput): Promise<QuoteOutput>

  async healthCheck(): Promise<boolean> {
    try {
      // Basic health check - can be overridden by subclasses
      return true
    } catch {
      return false
    }
  }

  /**
   * Validate input before processing
   */
  protected validateInput(input: QuoteEngineInput): void {
    if (input.loanAmount <= 0) {
      throw new Error('Loan amount must be greater than 0')
    }

    if (input.purchasePrice <= 0) {
      throw new Error('Purchase price must be greater than 0')
    }

    if (input.loanAmount > input.purchasePrice) {
      throw new Error('Loan amount cannot exceed purchase price')
    }

    if (!input.state || input.state.length !== 2) {
      throw new Error('Valid state code required (2 letters)')
    }

    if (!input.county) {
      throw new Error('County is required')
    }
  }

  /**
   * Log provider activity
   */
  protected log(message: string, data?: any): void {
    console.log(`[${this.name}] ${message}`, data || '')
  }
}
