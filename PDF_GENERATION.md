# Quote PDF Generation & Email Delivery

Complete implementation of PDF generation using Puppeteer, S3 storage, and SES email delivery with activity logging.

## Features

- **Professional PDF Generation**: Puppeteer-powered rendering from print-optimized pages
- **S3 Storage**: Secure PDF storage on AWS S3 with organized folder structure
- **SES Email Delivery**: Branded email templates with PDF links
- **Activity Logging**: Automatic tracking of `quote_generated` and `pdf_sent` events
- **Idempotent**: Checks for existing PDFs to avoid regeneration
- **Error Handling**: Graceful degradation if email fails but PDF succeeds

## Architecture

```
User Request → API Endpoint → Generate PDF → Upload to S3 → Update DB → Send Email → Log Activities
                    ↓              ↓              ↓            ↓           ↓            ↓
             POST /api/quote/pdf  Puppeteer    AWS S3      Quote.pdfUrl  AWS SES   ActivityEvent
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── quote/
│   │       └── pdf/
│   │           └── route.ts          # PDF generation API endpoint
│   └── quote/
│       └── [quoteId]/
│           └── print/
│               └── page.tsx           # Print-optimized quote page
├── lib/
│   ├── aws/
│   │   ├── s3.ts                      # S3 upload/delete utilities
│   │   └── ses.ts                     # SES email utilities
│   └── pdf/
│       └── generator.ts               # Puppeteer PDF generation
└── prisma/
    └── schema.prisma                  # Updated with pdfUrl field
```

## Database Schema Updates

```prisma
model Quote {
  // ... existing fields
  pdfUrl    String?  // S3 URL for generated PDF
}

model ActivityEvent {
  type      String   // quote_generated, email_sent, pdf_sent
  action    String
  metadata  Json?
}
```

Run migration:
```bash
npm run db:generate
npm run db:push
```

## API Endpoints

### POST /api/quote/pdf

Generate a PDF for a quote, upload to S3, and optionally email it.

**Request:**
```json
{
  "quoteId": "clx123abc",
  "sendEmail": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "pdfUrl": "https://garden-dtc-quotes.s3.us-east-1.amazonaws.com/quotes/clx123abc/quote-1705420800000-abc123.pdf",
  "quoteId": "clx123abc",
  "emailSent": true
}
```

**Response (PDF Exists):**
```json
{
  "success": true,
  "pdfUrl": "https://...",
  "quoteId": "clx123abc",
  "message": "PDF already exists"
}
```

**Response (Email Failed):**
```json
{
  "success": true,
  "pdfUrl": "https://...",
  "quoteId": "clx123abc",
  "warning": "PDF generated but email failed to send",
  "emailError": "Invalid email address"
}
```

### GET /quote/[quoteId]/print

View the print-optimized quote page (used by Puppeteer for PDF generation).

**Features:**
- Professional styling optimized for PDF
- Prominent disclaimer box with warning icon
- Print-friendly layout (no headers/footers)
- Embedded CSS (no external dependencies)
- Company branding

## Setup

### 1. Install Dependencies

Already included in package.json:
```bash
npm install
```

Key dependencies:
- `puppeteer` - Headless browser for PDF generation
- `@aws-sdk/client-s3` - S3 file uploads
- `@aws-sdk/client-ses` - Email delivery

### 2. Configure AWS

#### S3 Bucket Setup

1. Create S3 bucket: `garden-dtc-quotes`
2. Enable versioning (optional)
3. Set appropriate permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::garden-dtc-quotes/*"
    }
  ]
}
```

Or use private bucket with signed URLs (more secure).

#### SES Email Setup

1. Verify sender email in AWS SES
2. Move out of sandbox mode (to send to any email)
3. Configure DKIM and SPF records

Verify email:
```bash
aws ses verify-email-identity --email-address noreply@gardendtc.com
```

#### IAM Policy

Create IAM user with this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::garden-dtc-quotes/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Environment Variables

Update `.env`:

```bash
# AWS Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_S3_BUCKET="garden-dtc-quotes"
AWS_SES_FROM_EMAIL="noreply@gardendtc.com"
```

### 4. Run Database Migration

```bash
npm run db:push
```

## Usage Examples

### Generate PDF Only (No Email)

```bash
curl -X POST http://localhost:3000/api/quote/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "clx123abc",
    "sendEmail": false
  }'
```

### Generate PDF and Send Email

```bash
curl -X POST http://localhost:3000/api/quote/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "clx123abc",
    "sendEmail": true
  }'
```

### From Application Code

```typescript
// Generate and email quote PDF
const response = await fetch('/api/quote/pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    quoteId: quote.id,
    sendEmail: true,
  }),
})

const result = await response.json()

if (result.success) {
  console.log('PDF URL:', result.pdfUrl)
  console.log('Email sent:', result.emailSent)
}
```

## Print Page Styling

The print page (`/quote/[quoteId]/print`) includes:

### Layout Sections

1. **Header**: Company logo, quote ID, generation date
2. **Client Information**: Name, contact details, property location
3. **Savings Hero**: Large, prominent monthly savings display
4. **Payment Breakdown**: Current vs new payment comparison
5. **Loan Details**: Comprehensive table with all loan information
6. **Total Savings**: Lifetime savings calculation
7. **Break-Even Analysis**: Closing costs recovery timeline
8. **Disclaimer Box**: Prominent yellow warning box with key disclaimers
9. **Footer**: Company information and contact details

### Print-Specific Features

- No external CSS dependencies (all inline)
- Print-friendly colors and layout
- Page break controls
- 0.5" margins on all sides
- Letter size (8.5" x 11")
- Background graphics enabled

### Disclaimer Box

Prominent yellow box with:
- Warning icon
- Bold header
- 7 key disclaimers covering:
  - Good faith estimate
  - Rate not locked
  - Credit approval required
  - Property appraisal required
  - Closing costs not included
  - Quote expiration
  - Not a commitment to lend

## Email Template

Professional HTML email includes:

- **Green gradient header** with savings amount
- **Clear call-to-action** button to download PDF
- **Quote ID** for reference
- **Next steps** checklist
- **Urgency messaging** (30-day expiration)
- **Contact information**
- **Plain text fallback**

Preview:

```
Your Quote is Ready!
$500 in monthly savings

Hi John,

Thank you for your interest in refinancing with Garden DTC...

[Download Your Quote PDF]

Next Steps:
• Review your personalized quote
• Compare with your current mortgage
• Contact us to get started
```

## Activity Logging

Two activity events are automatically logged:

### 1. quote_generated

Logged when PDF is successfully generated.

```typescript
{
  type: 'quote_generated',
  action: 'Quote PDF generated',
  metadata: {
    quoteId: 'clx123abc',
    pdfUrl: 'https://...',
    monthlySavings: 500,
    lifetimeSavings: 120000
  }
}
```

### 2. email_sent (pdf_sent)

Logged when email is successfully sent.

```typescript
{
  type: 'email_sent',
  action: 'Quote PDF emailed',
  metadata: {
    quoteId: 'clx123abc',
    pdfUrl: 'https://...',
    emailTo: 'john@example.com',
    messageId: 'ses-message-id'
  }
}
```

View activities in admin:
```typescript
const activities = await prisma.activityEvent.findMany({
  where: {
    leadId: 'lead-id',
    type: { in: ['quote_generated', 'email_sent'] }
  },
  orderBy: { createdAt: 'desc' }
})
```

## Error Handling

### PDF Generation Failures

- **Timeout**: 30 second default, configurable
- **Puppeteer errors**: Browser launch failures, navigation errors
- **Memory issues**: Headless Chrome memory limits

### S3 Upload Failures

- **Credentials**: Invalid AWS credentials
- **Permissions**: Missing S3 permissions
- **Bucket**: Bucket doesn't exist

### Email Failures

- **Non-blocking**: PDF still generated and saved
- **Logs warning**: Returns success with warning message
- **SES limits**: Check sending limits and quotas
- **Email validation**: Invalid recipient email addresses

## Performance

### Typical Metrics

- **PDF Generation**: 3-5 seconds
- **S3 Upload**: < 1 second
- **Email Delivery**: 1-2 seconds
- **Total Time**: 5-8 seconds

### Optimization Tips

1. **Use caching**: Check for existing PDFs before regenerating
2. **Background jobs**: Generate PDFs asynchronously
3. **CDN**: Use CloudFront for S3 PDFs
4. **Rate limiting**: Prevent abuse of PDF generation

## Testing

### Local Testing (Without AWS)

Mock S3 and SES:

```typescript
// jest.setup.js
jest.mock('@/lib/aws/s3', () => ({
  uploadToS3: jest.fn().mockResolvedValue('https://mock-url.pdf'),
  generatePdfKey: jest.fn().mockReturnValue('mock-key.pdf'),
}))

jest.mock('@/lib/aws/ses', () => ({
  sendQuotePdfEmail: jest.fn().mockResolvedValue('mock-message-id'),
}))
```

### Test Print Page

Visit directly in browser:
```
http://localhost:3000/quote/[your-quote-id]/print
```

Test print to PDF using browser (Cmd/Ctrl + P).

### Test PDF Generation

```bash
# Generate PDF without email
curl -X POST http://localhost:3000/api/quote/pdf \
  -H "Content-Type: application/json" \
  -d '{"quoteId": "test-id", "sendEmail": false}'
```

### Test Email Template

Use AWS SES sandbox mode to send test emails to verified addresses.

## Production Deployment

### Environment Checklist

- [ ] AWS credentials configured
- [ ] S3 bucket created and accessible
- [ ] SES email verified and out of sandbox
- [ ] Database migrated with pdfUrl field
- [ ] Puppeteer dependencies installed
- [ ] Memory limits appropriate for Chrome
- [ ] Error monitoring configured

### Deployment Notes

**Vercel/Serverless**: Puppeteer requires special configuration
```bash
# Add to package.json
"puppeteer": {
  "skipDownload": true
}
```

Use `chrome-aws-lambda` or `@sparticuz/chromium` for serverless.

**Docker**: Include Chrome dependencies in Dockerfile
```dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    --no-install-recommends
```

**PM2/Traditional**: Works out of the box with standard Puppeteer

## Security Considerations

1. **S3 Access**: Use signed URLs for private documents
2. **Email Validation**: Verify email addresses before sending
3. **Rate Limiting**: Prevent PDF generation abuse
4. **Secrets**: Never commit AWS credentials
5. **CORS**: Configure S3 bucket CORS if needed
6. **Audit Trail**: Activity events log all PDF access

## Troubleshooting

### "Quote not found"
- Verify quote exists in database
- Check quoteId is valid CUID

### "Failed to generate PDF"
- Check Puppeteer installation: `npx puppeteer browsers install chrome`
- Verify print URL is accessible
- Check memory limits (Chrome needs ~512MB)

### "S3 upload failed"
- Verify AWS credentials
- Check bucket exists and region matches
- Verify IAM permissions

### "Email send failed"
- Verify SES email is verified
- Check SES is out of sandbox mode
- Verify recipient email is valid
- Check SES sending limits

### PDF renders incorrectly
- Test print page directly in browser
- Check CSS is inline (no external stylesheets)
- Verify images use absolute URLs or data URIs

## Future Enhancements

- [ ] PDF signing for legal compliance
- [ ] Watermarks for draft quotes
- [ ] Multi-page quotes for complex scenarios
- [ ] PDF password protection
- [ ] Analytics tracking (PDF opens, email opens)
- [ ] Template customization per product tier
- [ ] Bulk PDF generation for multiple quotes
- [ ] PDF preview before email
- [ ] Schedule email delivery
- [ ] Resend capability

## Support

For issues or questions:
- Check AWS CloudWatch logs for errors
- Verify environment variables are set
- Test each component individually (PDF → S3 → Email)
- Review ActivityEvents for diagnostic information
