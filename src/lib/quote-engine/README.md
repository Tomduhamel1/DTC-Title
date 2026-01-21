# Quote Engine Module

A flexible and extensible quote calculation system for mortgage closing costs.

## Features

- **Config-Based Calculations**: Uses state/county-specific rules and fee schedules
- **Provider Architecture**: Easy to swap between internal calculator and external APIs
- **Comprehensive Calculations**: Covers all aspects of closing costs:
  - Lender fees (origination, underwriting, processing)
  - Third-party fees (appraisal, title, inspections)
  - Government fees (recording, transfer taxes)
  - Prepaid items (interest, insurance, taxes)
- **State-Specific Rules**: Configured for CA, TX, NY, FL, WA (easily extensible)
- **Savings Comparison**: Compare quotes against competitors
- **Full Test Coverage**: Unit tests for calculations and formatting

## Usage

### Basic Usage

```typescript
import { QuoteEngine } from '@/lib/quote-engine'

const quote = await QuoteEngine.calculate({
  state: 'CA',
  county: 'Los Angeles',
  purchasePrice: 500000,
  loanAmount: 400000,
  transactionType: 'purchase',
  productChoice: 'standard',
})

console.log(`Total Closing Costs: ${quote.totals.totalClosingCosts}`)
```

### With Competitor Comparison

```typescript
const quote = await QuoteEngine.calculate({
  state: 'CA',
  county: 'Los Angeles',
  purchasePrice: 500000,
  loanAmount: 400000,
  transactionType: 'purchase',
  productChoice: 'standard',
  competitorQuoteTotal: 15000, // Compare against competitor
})

if (quote.savingsSummary.hasSavings) {
  console.log(`You save: $${quote.savingsSummary.savings}`)
}
```

### Formatting Output

```typescript
import { formatQuoteForDisplay, formatCurrency } from '@/lib/quote-engine'

// Format entire quote as text
const displayText = formatQuoteForDisplay(quote)
console.log(displayText)

// Format individual values
console.log(formatCurrency(quote.totals.totalClosingCosts))
```

## API Endpoint

### POST /api/quote-engine

Calculate a quote via HTTP API.

**Request:**
```json
{
  "state": "CA",
  "county": "Los Angeles",
  "purchasePrice": 500000,
  "loanAmount": 400000,
  "transactionType": "purchase",
  "productChoice": "standard",
  "competitorQuoteTotal": 15000
}
```

**Response:**
```json
{
  "success": true,
  "quote": {
    "quoteId": "Q-ABC123",
    "lineItemGroups": [...],
    "totals": {...},
    "savingsSummary": {...},
    "disclaimers": [...]
  },
  "provider": "ConfigBasedProvider"
}
```

### GET /api/quote-engine

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "healthy": true,
  "provider": "ConfigBasedProvider",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Switching to External API

To use an external RateCalc API instead of config-based calculations:

1. Set environment variables in `.env`:
```bash
QUOTE_PROVIDER_TYPE="external"
RATECALC_API_URL="https://api.ratecalc.example.com"
RATECALC_API_KEY="your-api-key"
RATECALC_API_TIMEOUT="10000"
```

2. The system will automatically use the external provider
3. No code changes required!

## Adding New States

To add support for a new state:

1. Edit `src/lib/quote-engine/config/states.ts`
2. Add a new state configuration:

```typescript
export const stateConfigs: Record<string, StateConfig> = {
  // ... existing states
  AZ: {
    state: 'AZ',
    stateName: 'Arizona',
    recordingTaxRate: 0,
    recordingTaxType: 'percentage',
    transferTaxRate: 2.0,
    transferTaxType: 'per_thousand',
    recordingFeeBase: 30,
    countyOverrides: {
      'Maricopa': {
        recordingFeeBase: 35,
      },
    },
    stateSpecificDisclosures: [
      'Arizona-specific disclosure here',
    ],
  },
}
```

## Customizing Fee Schedules

Edit `src/lib/quote-engine/config/fee-schedule.ts` to adjust fees:

```typescript
export const defaultFeeSchedule: FeeSchedule = {
  originationFee: (loanAmount: number) => loanAmount * 0.01, // 1%
  underwritingFee: 850,
  processingFee: 500,
  // ... other fees
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Architecture

### Provider Pattern

The quote engine uses a provider pattern for flexibility:

```
QuoteEngine (Facade)
    ↓
QuoteProviderFactory
    ↓
BaseQuoteProvider (Interface)
    ↓
├── ConfigBasedQuoteProvider (default)
└── ExternalAPIQuoteProvider (optional)
```

This makes it easy to:
- Add new providers (e.g., multiple external APIs)
- Switch providers at runtime
- Mock providers for testing
- A/B test different calculation methods

### Data Flow

```
Input → Validation → Provider → Calculator → Line Items → Totals → Output
```

1. **Input**: Validate request data
2. **Provider**: Select appropriate calculation provider
3. **Calculator**: Apply state/county rules and fee schedules
4. **Line Items**: Generate detailed breakdown
5. **Totals**: Sum all categories
6. **Output**: Format with disclaimers and expiration

## Quote Output Structure

```typescript
{
  quoteId: string              // Unique identifier
  timestamp: Date              // When quote was generated
  input: QuoteEngineInput      // Original input data
  lineItemGroups: [            // Itemized fees
    {
      title: string            // e.g., "A. Origination Charges"
      items: LineItem[]        // Individual fees
      subtotal: number         // Group total
    }
  ]
  totals: {
    lenderFees: number
    thirdPartyFees: number
    governmentFees: number
    prepaidItems: number
    totalClosingCosts: number
    cashToClose: number
  }
  savingsSummary: {
    hasSavings: boolean
    competitorTotal?: number
    ourTotal: number
    savings?: number
    savingsPercentage?: number
  }
  disclaimers: string[]        // Legal and informational disclaimers
  expiresAt: Date              // Quote expiration (30 days)
}
```

## Product Choices

- **basic**: Standard fees, no premium
- **standard**: Standard fees + $250 service premium
- **premium**: Standard fees + $750 service premium (expedited processing, dedicated support)

## Transaction Types

- **purchase**: Includes transfer taxes, survey, pest inspection
- **refinance**: No transfer taxes or purchase-specific fees

## Best Practices

1. Always validate input before passing to the quote engine
2. Handle errors gracefully (API timeouts, invalid states, etc.)
3. Cache quotes when appropriate (use quoteId for tracking)
4. Respect quote expiration dates (30 days)
5. Log all quote generations for auditing
6. Test with multiple states and edge cases

## Troubleshooting

### "State not found" error
- Add state configuration to `config/states.ts`
- Or the system will use a default configuration

### External API timeout
- Increase timeout in environment variables
- Check API health endpoint
- Fallback to config provider if needed

### Test failures
- Ensure all dependencies are installed: `npm install`
- Clear Jest cache: `npx jest --clearCache`
- Check that state configs haven't changed

## Future Enhancements

- [ ] Add more states (all 50)
- [ ] Support for VA loans, FHA loans, Jumbo loans
- [ ] Rate lock periods and pricing
- [ ] Dynamic fee adjustments based on market conditions
- [ ] Multi-provider quote comparison
- [ ] Quote PDF generation
- [ ] Email quote delivery
