# Quote Engine Implementation

A production-ready quote calculation system with config-based rules and easy external API integration.

## File Tree

```
src/lib/quote-engine/
├── README.md                           # Detailed documentation
├── index.ts                            # Main export file
├── types.ts                            # TypeScript interfaces
├── calculator.ts                       # Core calculation logic
├── utils.ts                            # Formatting utilities
├── config/
│   ├── states.ts                       # State/county configurations
│   └── fee-schedule.ts                 # Fee schedules and rates
├── providers/
│   ├── base-provider.ts                # Provider interface
│   ├── config-provider.ts              # Config-based calculator
│   ├── external-api-provider.ts        # External API integration
│   └── factory.ts                      # Provider factory
└── __tests__/
    ├── calculator.test.ts              # Calculator tests
    ├── utils.test.ts                   # Utility tests
    └── providers.test.ts               # Provider tests

src/app/api/quote-engine/
└── route.ts                            # API endpoint

Configuration Files:
├── jest.config.js                      # Jest configuration
├── jest.setup.js                       # Test setup
├── .env                                # Environment variables
└── .env.example                        # Environment template
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### 3. Use the Quote Engine

```typescript
import { QuoteEngine } from '@/lib/quote-engine'

const quote = await QuoteEngine.calculate({
  state: 'CA',
  county: 'Los Angeles',
  purchasePrice: 500000,
  loanAmount: 400000,
  transactionType: 'purchase',
  productChoice: 'standard',
  competitorQuoteTotal: 15000, // Optional
})

console.log('Quote ID:', quote.quoteId)
console.log('Total Closing Costs:', quote.totals.totalClosingCosts)
console.log('Cash to Close:', quote.totals.cashToClose)

if (quote.savingsSummary.hasSavings) {
  console.log('Savings:', quote.savingsSummary.savings)
}
```

## API Usage

### Calculate Quote (POST /api/quote-engine)

```bash
curl -X POST http://localhost:3000/api/quote-engine \
  -H "Content-Type: application/json" \
  -d '{
    "state": "CA",
    "county": "Los Angeles",
    "purchasePrice": 500000,
    "loanAmount": 400000,
    "transactionType": "purchase",
    "productChoice": "standard",
    "competitorQuoteTotal": 15000
  }'
```

**Response:**
```json
{
  "success": true,
  "quote": {
    "quoteId": "Q-LQVXT8-A5B6C",
    "timestamp": "2024-01-16T12:00:00.000Z",
    "input": { ... },
    "lineItemGroups": [
      {
        "title": "A. Origination Charges",
        "items": [
          {
            "category": "Lender Fees",
            "name": "Origination Fee",
            "amount": 4000,
            "description": "1% of loan amount"
          },
          ...
        ],
        "subtotal": 5900
      },
      ...
    ],
    "totals": {
      "lenderFees": 5900,
      "thirdPartyFees": 2945,
      "governmentFees": 925,
      "prepaidItems": 4862.5,
      "totalClosingCosts": 14632.5,
      "totalLoanAmount": 400000,
      "cashToClose": 114632.5
    },
    "savingsSummary": {
      "hasSavings": true,
      "competitorTotal": 15000,
      "ourTotal": 14632.5,
      "savings": 367.5,
      "savingsPercentage": 2.45
    },
    "disclaimers": [
      "This is a good faith estimate of closing costs...",
      ...
    ],
    "expiresAt": "2024-02-15T12:00:00.000Z"
  },
  "provider": "ConfigBasedProvider"
}
```

### Health Check (GET /api/quote-engine)

```bash
curl http://localhost:3000/api/quote-engine
```

**Response:**
```json
{
  "success": true,
  "healthy": true,
  "provider": "ConfigBasedProvider",
  "timestamp": "2024-01-16T12:00:00.000Z"
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | Yes | 2-letter state code (e.g., "CA", "TX") |
| `county` | string | Yes | County name (e.g., "Los Angeles") |
| `purchasePrice` | number | Yes | Property purchase price in dollars |
| `loanAmount` | number | Yes | Mortgage loan amount in dollars |
| `transactionType` | string | Yes | "purchase" or "refinance" |
| `productChoice` | string | Yes | "basic", "standard", or "premium" |
| `competitorQuoteTotal` | number | No | Competitor's total for savings comparison |

## Output Structure

### Line Item Groups

1. **A. Origination Charges** (Lender Fees)
   - Origination Fee (1% of loan amount)
   - Underwriting Fee ($850)
   - Processing Fee ($500)
   - Application Fee ($400)
   - Product Premium (varies by product choice)

2. **B. Third-Party Services**
   - Appraisal Fee ($550)
   - Credit Report Fee ($45)
   - Flood Certification ($25)
   - Lender's Title Insurance (0.55% of purchase price)
   - Title Search Fee ($300)
   - Settlement/Closing Fee ($400)
   - Survey Fee ($475, purchase only)
   - Pest Inspection ($125, purchase only)

3. **E. Taxes and Government Fees**
   - Recording Fee (varies by state/county)
   - Transfer Tax (purchase only, varies by state)
   - Mortgage Recording Tax (varies by state)

4. **F. Prepaids**
   - Prepaid Interest (15 days)
   - Homeowners Insurance Premium (12 months)
   - Property Taxes (6 months)

### Totals

- `lenderFees`: Sum of all lender charges
- `thirdPartyFees`: Sum of all third-party charges
- `governmentFees`: Sum of all government fees/taxes
- `prepaidItems`: Sum of all prepaid amounts
- `totalClosingCosts`: Sum of all above
- `cashToClose`: Total closing costs + down payment (purchase) or just closing costs (refinance)

## State Configurations

Currently configured states: **CA, TX, NY, FL, WA**

### California (CA)
- Transfer Tax: $1.10 per $1,000
- Recording Fee: $30 base + $3/page
- Los Angeles County: Higher transfer tax ($1.45/$1,000)
- San Francisco County: Highest transfer tax ($2.50/$1,000)

### Texas (TX)
- No state transfer tax
- Recording Fee: $25 base
- Lower overall government fees

### New York (NY)
- Recording Tax: 0.4% of loan amount
- Transfer Tax: $4.00 per $1,000
- NYC (Manhattan, Brooklyn, Queens): $10.00 per $1,000 transfer tax
- Higher overall fees

### Florida (FL)
- Documentary Stamp Tax: $0.70 per $1,000 on mortgage
- Transfer Tax: $7.00 per $1,000 on deed
- Recording Fee: $10 base

### Washington (WA)
- Excise Tax: 1.28% of purchase price
- Recording Fee: $50 base

## Product Choices

### Basic ($0 premium)
- Standard processing
- Standard timeline
- Email support

### Standard ($250 premium)
- Priority processing
- Faster timeline
- Email + phone support

### Premium ($750 premium)
- Expedited processing
- Fastest timeline
- Dedicated support team
- Enhanced underwriting

## Switching to External API

To integrate with an external RateCalc API:

1. **Update environment variables:**
```bash
# .env
QUOTE_PROVIDER_TYPE="external"
RATECALC_API_URL="https://api.ratecalc.example.com"
RATECALC_API_KEY="your-api-key-here"
RATECALC_API_TIMEOUT="10000"
```

2. **No code changes needed!** The system automatically uses the external provider.

3. **Custom API integration:** Edit `src/lib/quote-engine/providers/external-api-provider.ts` to match your API's request/response format.

## Testing

### Run All Tests
```bash
npm test
```

### Test Output
```
 PASS  src/lib/quote-engine/__tests__/calculator.test.ts
 PASS  src/lib/quote-engine/__tests__/utils.test.ts
 PASS  src/lib/quote-engine/__tests__/providers.test.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
```

### Coverage Report
```bash
npm run test:coverage
```

## Example Usage Scenarios

### Scenario 1: Basic Purchase Quote

```typescript
const quote = await QuoteEngine.calculate({
  state: 'CA',
  county: 'Los Angeles',
  purchasePrice: 600000,
  loanAmount: 480000, // 20% down
  transactionType: 'purchase',
  productChoice: 'standard',
})

// Output line items for display
quote.lineItemGroups.forEach(group => {
  console.log(`\n${group.title}`)
  group.items.forEach(item => {
    console.log(`  ${item.name}: $${item.amount.toFixed(2)}`)
  })
  console.log(`  Subtotal: $${group.subtotal.toFixed(2)}`)
})
```

### Scenario 2: Refinance with Savings Comparison

```typescript
const quote = await QuoteEngine.calculate({
  state: 'TX',
  county: 'Harris',
  purchasePrice: 400000,
  loanAmount: 300000,
  transactionType: 'refinance',
  productChoice: 'premium',
  competitorQuoteTotal: 12000,
})

if (quote.savingsSummary.hasSavings) {
  console.log(`You save $${quote.savingsSummary.savings}!`)
  console.log(`That's ${quote.savingsSummary.savingsPercentage}% less!`)
}
```

### Scenario 3: Format for Email/PDF

```typescript
import { formatQuoteForDisplay } from '@/lib/quote-engine'

const quote = await QuoteEngine.calculate({ ... })
const displayText = formatQuoteForDisplay(quote)

// Send via email or generate PDF
await sendEmail({
  to: customer.email,
  subject: `Your Mortgage Quote ${quote.quoteId}`,
  body: displayText,
})
```

## Adding New States

1. Edit `src/lib/quote-engine/config/states.ts`
2. Add your state configuration:

```typescript
export const stateConfigs: Record<string, StateConfig> = {
  // Existing states...

  CO: {
    state: 'CO',
    stateName: 'Colorado',
    recordingTaxRate: 0.01,
    recordingTaxType: 'percentage',
    transferTaxRate: 0,
    transferTaxType: 'percentage',
    recordingFeeBase: 13,
    countyOverrides: {
      'Denver': {
        recordingFeeBase: 15,
      },
    },
    stateSpecificDisclosures: [
      'Colorado-specific disclosures here',
    ],
  },
}
```

3. Test with the new state:

```typescript
const quote = await QuoteEngine.calculate({
  state: 'CO',
  county: 'Denver',
  purchasePrice: 500000,
  loanAmount: 400000,
  transactionType: 'purchase',
  productChoice: 'standard',
})
```

## Architecture Benefits

✅ **Easy to maintain**: Config-based rules are simple to update
✅ **Easy to test**: Comprehensive unit tests for all calculations
✅ **Easy to extend**: Add new states/counties without code changes
✅ **Easy to swap**: Switch to external API via environment variable
✅ **Production-ready**: Error handling, validation, logging
✅ **Type-safe**: Full TypeScript support

## Performance

- Config-based calculations: < 10ms per quote
- External API calls: Configurable timeout (default 10s)
- Health check: < 100ms
- Tests: Complete suite runs in < 5s

## Support

For issues or questions:
1. Check the detailed README: `src/lib/quote-engine/README.md`
2. Run tests to verify setup: `npm test`
3. Check provider health: `GET /api/quote-engine`
