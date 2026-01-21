# TrueFee Closing - Mortgage Refinancing Platform

A production-ready Next.js application for mortgage refinancing lead generation and management with discounted closing costs.

## Features

- **Marketing Pages**: Landing page with call-to-action
- **Savings Calculator**: Interactive quote calculator with results display
- **Progressive Intake Form**: Multi-step application form with auto-save and resume
- **Admin Dashboard**: Lead management and tracking
- **Quote Engine**: Config-based quote calculator with state-specific rules
- **PDF Generation**: Professional quote PDFs with Puppeteer
- **Email Delivery**: Automated quote delivery via AWS SES
- **File Uploads**: S3-based document uploads with signed URLs
- **Magic Links**: Secure resume tokens for continuing applications
- **API Layer**: RESTful endpoints for leads, quotes, and uploads
- **Database**: PostgreSQL with Prisma ORM
- **Activity Logging**: Comprehensive tracking of all user interactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Validation**: Zod
- **PDF Generation**: Puppeteer
- **Cloud Storage**: AWS S3
- **Email**: AWS SES
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/truefee_closing?schema=public"

# AWS Configuration (for PDF generation and email)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_S3_BUCKET="truefee-closing-quotes"
AWS_SES_FROM_EMAIL="noreply@truefeeclosing.com"
```

4. Generate Prisma client and push schema to database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) to view the application.

## Database Schema

### Lead
Stores customer information, intake data, and progress tracking.
- Progressive intake with `intakeJson` field
- Completion percentage (0-100%)
- Resume tokens for magic links
- Document relationships

### Quote
Stores mortgage quote calculations and savings estimates.
- PDF URL for generated quotes
- Expiration dates

### Document
Stores uploaded files and metadata.
- S3 keys and URLs
- File type, size, and MIME type
- Upload tracking

### ActivityEvent
Tracks user interactions and lead activities.
- Intake events: `intake_started`, `intake_updated`
- Document events: `doc_uploaded`
- Quote events: `quote_generated`, `pdf_sent`

## Routes

### Public Routes

- `/` - Marketing landing page
- `/pricing` - Savings calculator form
- `/pricing/results` - Quote results and savings breakdown
- `/start` - Progressive intake application form with auto-save
- `/resume/[token]` - Resume incomplete application via magic link
- `/quote/[quoteId]/print` - Print-optimized quote page

### Admin Routes

- `/admin` - Lead list dashboard
- `/admin/leads/[id]` - Individual lead details

### API Routes

- `POST /api/leads` - Create or update a lead
- `POST /api/quote` - Calculate mortgage quote
- `POST /api/quote-engine` - Calculate detailed quote with line items
- `POST /api/quote/pdf` - Generate and email quote PDF
- `POST /api/intake/save` - Auto-save intake progress
- `POST /api/intake/upload` - Generate S3 upload URL
- `POST /api/intake/upload/confirm` - Confirm file upload

## API Usage

### Create Lead

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "555-123-4567",
    "homeValue": 500000,
    "mortgageBalance": 400000,
    "currentRate": 4.5,
    "creditScore": "excellent"
  }'
```

### Calculate Quote

```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "homeValue": 500000,
    "mortgageBalance": 400000,
    "currentRate": 4.5,
    "creditScore": "excellent",
    "email": "user@example.com"
  }'
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

### Database Management

To view and edit your database, use Prisma Studio:
```bash
npm run db:studio
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Run database migrations:
```bash
npm run db:migrate
```

4. Start the production server:
```bash
npm run start
```

## Project Structure

```
.
├── prisma/
│   └── schema.prisma               # Database schema
├── src/
│   ├── app/
│   │   ├── admin/                  # Admin dashboard pages
│   │   ├── api/                    # API routes
│   │   ├── pricing/                # Pricing calculator pages
│   │   ├── quote/[quoteId]/print/  # Print-optimized quote pages
│   │   ├── start/                  # Intake form
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── components/                 # Reusable components
│   └── lib/
│       ├── aws/                    # AWS utilities (S3, SES)
│       ├── pdf/                    # PDF generation
│       ├── quote-engine/           # Quote engine module
│       ├── db.ts                   # Prisma client
│       └── quote-calculator.ts     # Quote calculation logic
├── .env.example
├── package.json
├── PDF_GENERATION.md               # PDF generation docs
├── QUOTE_ENGINE.md                 # Quote engine docs
└── README.md
```

## Additional Documentation

- **[Quote Engine](./QUOTE_ENGINE.md)**: Detailed documentation for the quote calculation engine
- **[PDF Generation](./PDF_GENERATION.md)**: Complete guide for PDF generation and email delivery
- **[Progressive Intake](./INTAKE_SUMMARY.md)**: Auto-save, magic links, and file uploads guide
- **[Mortgage Lane](./MORTGAGE_LANE.md)**: Purchase mortgage referral and lender scenario tracking

## License

MIT
