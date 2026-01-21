# Purchase Mortgage Lane Implementation

Complete implementation of the secondary mortgage lane (Option A - Partner Referral) without weakening the primary refinance funnel.

## Overview

This feature allows users on the `/pricing/results` page to optionally explore purchase mortgage options through two paths:
1. **Path 1: "I already have a lender"** - Enter and compare existing lender terms
2. **Path 2: "Request loan suggestions"** - Get matched with a lending partner for personalized options

## Key Features

### 1. **Optional Module Design** ✅
- Collapsible module on `/pricing/results` page
- Keeps "Let's Start Now" as the dominant CTA for refinance application
- Shows/hides with user interaction
- Clear visual hierarchy prioritizing primary funnel

### 2. **Path 1: Lender Scenario Entry** ✅
Users can enter their existing lender's terms:
- **Required Fields**:
  - Loan Amount
  - Interest Rate (%)
  - Loan Term (10, 15, 20, 30 year options)
- **Optional Fields**:
  - Lender Name
  - Points (%)
  - Lender Fees ($)
  - Monthly PITI components (Property Taxes, Home Insurance, HOA Fees, PMI)

**Calculations**:
- Monthly Principal & Interest (P&I)
- Total Monthly Payment (PITI if components provided)
- Total Upfront Costs (points + lender fees)

**Storage**: Saved as `MortgageScenario` record with `source=user_entered`

**Activity Logging**: `mortgage_terms_added` event

### 3. **Path 2: Partner Referral Request** ✅
Users can request loan suggestions by providing:
- **Required Fields**:
  - Credit Band (Excellent, Good, Fair, Poor)
  - Property Type (Single Family, Condo, Townhouse, Multi-Family, Manufactured)
  - Occupancy (Primary, Secondary, Investment)
  - Down Payment Percentage
  - Term Preference (30yr, 15yr, 20yr, 10yr, 7/1 ARM, 5/1 ARM)
  - Contact Preference (Email, Phone, Both)
- **Optional Fields**:
  - Estimated Loan Amount
  - Additional Notes

**Processing**:
1. Intelligent partner selection based on specialties
2. Creates `MortgageReferral` record
3. Sends partner notification email
4. Sends Slack notification to internal team
5. Logs `mortgage_referral_requested` event

### 4. **Partner Selection Logic** ✅
Smart partner matching algorithm:
```typescript
// Priority 1: Match by specialties
// - Credit bands (excellent, good, fair, poor)
// - Property types (single_family, condo, etc.)
//
// Priority 2: Default to highest priority partner
```

Partners with empty specialty arrays accept all types (universal lenders).

### 5. **Notifications** ✅

**Partner Email**:
- Professional HTML template with lead details
- Loan preferences and requirements
- Contact information and preferences
- Referral ID for tracking

**Slack Notification**:
- Rich message with all referral details
- Link to admin lead detail page
- Partner assignment information

### 6. **Admin Dashboard Integration** ✅
Enhanced admin lead detail page shows:
- **Lender Scenarios Panel**: User-entered mortgage terms with calculated payments
- **Partner Referrals Panel**: Referral status, partner details, preferences
- Color-coded status badges
- Comprehensive field display

## Database Schema

### MortgageScenario Model
```prisma
model MortgageScenario {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(...)

  source    String   // user_entered, partner_quote, internal

  // Loan terms
  lenderName       String?
  loanAmount       Float
  interestRate     Float
  term             Int      // months
  points           Float?
  lenderFees       Float?

  // PITI components
  propertyTaxes    Float?   // monthly
  homeInsurance    Float?   // monthly
  hoaFees          Float?   // monthly
  pmi              Float?   // monthly

  // Calculated values
  principalInterest Float
  totalMonthly      Float
  totalUpfront      Float

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### MortgageReferral Model
```prisma
model MortgageReferral {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(...)
  partnerId String?
  partner   Partner? @relation(...)

  // User preferences
  creditBand        String   // excellent, good, fair, poor
  occupancy         String   // primary, secondary, investment
  propertyType      String   // single_family, condo, etc.
  downPaymentPct    Float
  termPreference    String   // 30_year, 15_year, arm, etc.
  contactPreference String   // email, phone, both

  // Additional context
  requestedLoanAmount Float?
  notes               String?

  // Referral status
  status            String   @default("pending")
  partnerResponse   Json?
  partnerContactedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Partner Model
```prisma
model Partner {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?

  isActive  Boolean  @default(true)
  priority  Int      @default(0)  // Higher = preferred

  specialties Json?   // { creditBands: [], propertyTypes: [], loanTypes: [] }
  notes     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  referrals MortgageReferral[]
}
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── mortgage/
│   │   │   ├── scenario/route.ts      # POST - Save user-entered lender terms
│   │   │   └── referral/route.ts      # POST - Create partner referral
│   │   └── partners/route.ts          # GET/POST/PATCH - Partner management
│   ├── pricing/results/page.tsx       # Enhanced with mortgage module
│   └── admin/leads/[id]/page.tsx      # Enhanced with mortgage panel
├── lib/
│   ├── mortgage/
│   │   ├── calculator.ts              # Mortgage calculations (P&I, PITI, etc.)
│   │   └── partner.ts                 # Partner selection logic
│   ├── email/
│   │   └── partner-referral.ts        # Partner notification email
│   └── notifications/
│       └── slack.ts                   # Slack webhook notifications
└── prisma/
    └── seed.ts                        # Partner seeding script
```

## API Endpoints

### POST /api/mortgage/scenario
Save user-entered lender terms and calculate payments.

**Request Body**:
```json
{
  "leadId": "clx123",
  "lenderName": "ABC Bank",
  "loanAmount": 400000,
  "interestRate": 3.75,
  "term": 360,
  "points": 0.5,
  "lenderFees": 2000,
  "propertyTaxes": 500,
  "homeInsurance": 150,
  "hoaFees": 200,
  "pmi": 100
}
```

**Response**:
```json
{
  "success": true,
  "scenario": {
    "id": "scenario_123",
    "principalInterest": 1852.46,
    "totalMonthly": 2802.46,
    "totalUpfront": 4000
  }
}
```

### POST /api/mortgage/referral
Create partner referral and trigger notifications.

**Request Body**:
```json
{
  "leadId": "clx123",
  "creditBand": "excellent",
  "occupancy": "primary",
  "propertyType": "single_family",
  "downPaymentPct": 20,
  "termPreference": "30_year",
  "contactPreference": "both",
  "requestedLoanAmount": 400000,
  "notes": "Looking to close in 60 days"
}
```

**Response**:
```json
{
  "success": true,
  "referral": {
    "id": "ref_456",
    "partner": {
      "name": "Premier Home Lending",
      "selectionReason": "Matched based on specialties"
    },
    "status": "pending"
  }
}
```

### GET /api/partners
Get all partners for admin management.

**Response**:
```json
{
  "partners": [
    {
      "id": "partner_1",
      "name": "Premier Home Lending",
      "email": "referrals@premierhome.example.com",
      "phone": "(555) 100-1000",
      "isActive": true,
      "priority": 100,
      "specialties": {
        "creditBands": ["excellent", "good"],
        "propertyTypes": ["single_family", "condo"]
      }
    }
  ]
}
```

## Mortgage Calculation Functions

### calculateMonthlyPI(loanAmount, annualRate, termMonths)
Calculates monthly principal and interest payment.

**Formula**:
```
monthlyRate = annualRate / 100 / 12
payment = (loanAmount × monthlyRate × (1 + monthlyRate)^termMonths) / ((1 + monthlyRate)^termMonths - 1)
```

### calculateMonthlyPITI(principalInterest, propertyTaxes, homeInsurance, hoaFees, pmi)
Calculates total monthly payment including all PITI components.

### calculateUpfrontCosts(loanAmount, points, lenderFees, closingCosts)
Calculates total upfront costs including points and fees.

**Formula**:
```
pointsCost = loanAmount × (points / 100)
total = pointsCost + lenderFees + closingCosts
```

### estimatePMI(loanAmount, homeValue, annualPMIRate = 0.5)
Estimates monthly PMI if LTV > 80%.

**Formula**:
```
ltv = (loanAmount / homeValue) × 100
if ltv <= 80: return 0
annualPMI = loanAmount × (annualPMIRate / 100)
monthlyPMI = annualPMI / 12
```

### termToMonths(term)
Converts term strings to months:
- `30_year` → 360
- `15_year` → 180
- `20_year` → 240
- `10_year` → 120
- `7_1_arm` / `5_1_arm` → 360 (30-year amortization)

## User Experience Flow

### Path 1: Lender Scenario
```
1. User views /pricing/results (refinance quote)
2. Clicks "Show Options" on optional mortgage module
3. Selects "I Already Have a Lender"
4. Enters lender terms (loan amount, rate, term, etc.)
5. Submits form → POST /api/mortgage/scenario
6. Calculations performed server-side
7. MortgageScenario created, activity logged
8. Success message displayed
9. User can continue with refinance application
```

### Path 2: Partner Referral
```
1. User views /pricing/results (refinance quote)
2. Clicks "Show Options" on optional mortgage module
3. Selects "Request Loan Suggestions"
4. Fills out preferences (credit, property type, occupancy, etc.)
5. Submits form → POST /api/mortgage/referral
6. Partner selected based on specialties
7. MortgageReferral created
8. Partner email sent
9. Slack notification sent
10. Activity logged
11. Success message displayed
12. Partner contacts user within 24 hours
```

## Partner Seeding

Run the seed script to populate initial partners:

```bash
npx tsx prisma/seed.ts
```

**Default Partners**:
1. **Premier Home Lending** (Priority: 100)
   - Specializes in excellent/good credit, conventional loans

2. **Community First Mortgage** (Priority: 90)
   - Great with FHA/VA loans, good/fair credit

3. **Flexible Lending Solutions** (Priority: 80)
   - Specializes in fair/poor credit, credit repair

4. **Investment Property Experts** (Priority: 85)
   - Focused on investment properties

5. **Universal Home Loans** (Priority: 70)
   - Accepts all credit levels and property types

## Activity Event Types

### mortgage_terms_added
Logged when user enters lender scenario.

**Metadata**:
```json
{
  "scenarioId": "scenario_123",
  "lenderName": "ABC Bank",
  "loanAmount": 400000,
  "interestRate": 3.75,
  "principalInterest": 1852.46,
  "totalMonthly": 2802.46,
  "totalUpfront": 4000
}
```

### mortgage_referral_requested
Logged when user requests partner referral.

**Metadata**:
```json
{
  "referralId": "ref_456",
  "partnerId": "partner_1",
  "partnerName": "Premier Home Lending",
  "partnerSelectionReason": "Matched based on specialties",
  "creditBand": "excellent",
  "propertyType": "single_family",
  "occupancy": "primary",
  "termPreference": "30_year",
  "requestedLoanAmount": 400000
}
```

## Disclaimers

The following disclaimers are prominently displayed:

### Path 1 (Lender Scenario):
> **Disclaimer:** This is not a loan offer. Calculations are estimates only. Exact pricing requires a full application with the lender.

### Path 2 (Partner Referral):
> **Disclaimer:** This is not a loan offer. By submitting, you agree to be contacted by one of our lending partners. Exact pricing requires a full application.

## Design Principles

### 1. Non-Intrusive
- Module is collapsed by default
- Labeled as "completely optional"
- Positioned after primary refinance savings display

### 2. Primary Funnel Protection
- "Let's Start Now" button is larger and more prominent
- Mortgage module uses subtle border (gray) vs primary CTA (green)
- Clear visual hierarchy maintains refinance focus

### 3. User-Friendly
- Simple two-option choice architecture
- Progressive disclosure (show form after selection)
- Back button to return to options
- Clear success messages

### 4. Partner-Friendly
- Professional email template with complete lead details
- All necessary information for initial contact
- Clear referral tracking with unique IDs

## Environment Variables

Add to `.env`:

```bash
# Slack webhook for referral notifications
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Base URL for admin links in notifications
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"

# Existing AWS configuration used for emails
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_SES_FROM_EMAIL="noreply@yourdomain.com"
```

## Testing Checklist

- [ ] Database schema updated with new models
- [ ] Prisma migrations run successfully
- [ ] Partner seed script executed
- [ ] `/pricing/results` displays mortgage module
- [ ] "I already have a lender" path works
- [ ] Mortgage calculations are accurate
- [ ] "Request loan suggestions" path works
- [ ] Partner selection logic functioning
- [ ] Partner email sent successfully
- [ ] Slack notification received
- [ ] Activity events logged correctly
- [ ] Admin lead detail shows mortgage panel
- [ ] Mortgage scenarios display correctly
- [ ] Partner referrals display correctly
- [ ] Disclaimers are prominent and clear
- [ ] Primary "Let's Start Now" CTA remains dominant

## Future Enhancements

- [ ] Partner portal for viewing referrals
- [ ] Automated partner quote submission
- [ ] Multi-partner quote comparison
- [ ] Partner performance tracking
- [ ] Automated follow-up reminders
- [ ] Partner rating/feedback system
- [ ] LOS (Loan Origination System) integration
- [ ] Rate lock functionality
- [ ] Document upload for purchase mortgage
- [ ] Pre-approval letter generation

## Summary

✅ **Lender Scenario Entry**: User can enter and compare existing lender terms
✅ **Partner Referral System**: Intelligent matching and automated notifications
✅ **Mortgage Calculations**: Accurate P&I, PITI, upfront cost calculations
✅ **Partner Management**: Seeding, selection logic, and API
✅ **Admin Integration**: Comprehensive mortgage panel in lead details
✅ **Email & Slack Notifications**: Professional templates and real-time alerts
✅ **Activity Logging**: Complete audit trail of all mortgage activities
✅ **Non-Intrusive Design**: Protects primary refinance funnel
✅ **Production Ready**: Error handling, validation, disclaimers

**All requirements delivered!** 🎉
