import { IQuoteProvider } from './base-provider'
import { ConfigBasedQuoteProvider } from './config-provider'
import { ExternalAPIQuoteProvider } from './external-api-provider'

export type ProviderType = 'config' | 'external'

export interface ExternalProviderConfig {
  apiUrl: string
  apiKey: string
  timeout?: number
}

/**
 * Factory for creating quote providers
 * Makes it easy to switch between different providers via configuration
 */
export class QuoteProviderFactory {
  private static instance: IQuoteProvider | null = null

  /**
   * Get the configured quote provider
   * This reads from environment variables to determine which provider to use
   */
  static getProvider(): IQuoteProvider {
    if (this.instance) {
      return this.instance
    }

    const providerType = (process.env.QUOTE_PROVIDER_TYPE as ProviderType) || 'config'

    switch (providerType) {
      case 'external': {
        const apiUrl = process.env.RATECALC_API_URL
        const apiKey = process.env.RATECALC_API_KEY

        if (!apiUrl || !apiKey) {
          console.warn(
            'External API provider selected but API credentials missing. Falling back to config provider.'
          )
          this.instance = new ConfigBasedQuoteProvider()
        } else {
          this.instance = new ExternalAPIQuoteProvider({
            apiUrl,
            apiKey,
            timeout: parseInt(process.env.RATECALC_API_TIMEOUT || '10000'),
          })
        }
        break
      }

      case 'config':
      default:
        this.instance = new ConfigBasedQuoteProvider()
        break
    }

    return this.instance
  }

  /**
   * Set a specific provider (useful for testing)
   */
  static setProvider(provider: IQuoteProvider): void {
    this.instance = provider
  }

  /**
   * Reset the provider instance (useful for testing)
   */
  static resetProvider(): void {
    this.instance = null
  }

  /**
   * Create a provider of a specific type
   */
  static createProvider(type: ProviderType, config?: ExternalProviderConfig): IQuoteProvider {
    switch (type) {
      case 'external':
        if (!config) {
          throw new Error('External provider requires configuration')
        }
        return new ExternalAPIQuoteProvider(config)

      case 'config':
      default:
        return new ConfigBasedQuoteProvider()
    }
  }
}
