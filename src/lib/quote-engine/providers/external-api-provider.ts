import { QuoteEngineInput, QuoteOutput } from '../types'
import { BaseQuoteProvider } from './base-provider'

/**
 * External API quote provider
 * This is a template for integrating with external RateCalc APIs
 * Replace the implementation with actual API calls when ready
 */
export class ExternalAPIQuoteProvider extends BaseQuoteProvider {
  readonly name = 'ExternalAPIProvider'
  private apiUrl: string
  private apiKey: string
  private timeout: number

  constructor(config: { apiUrl: string; apiKey: string; timeout?: number }) {
    super()
    this.apiUrl = config.apiUrl
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 10000 // 10 seconds default
  }

  async calculate(input: QuoteEngineInput): Promise<QuoteOutput> {
    this.validateInput(input)
    this.log('Calling external API', { apiUrl: this.apiUrl })

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.apiUrl}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      this.log('Quote received from API', { quoteId: result.quoteId })

      // Transform API response to our QuoteOutput format
      return this.transformApiResponse(result, input)
    } catch (error) {
      this.log('Error calling external API', error)

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('External API request timed out')
      }

      throw new Error(
        `Failed to get quote from external API: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Transform external API response to our standard format
   * Customize this based on the actual external API response structure
   */
  private transformApiResponse(apiResponse: any, input: QuoteEngineInput): QuoteOutput {
    // This is a placeholder - implement based on actual API response structure
    // For now, we assume the API returns data in our format
    return {
      ...apiResponse,
      input,
      timestamp: new Date(apiResponse.timestamp || Date.now()),
      expiresAt: new Date(apiResponse.expiresAt || Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  }
}
