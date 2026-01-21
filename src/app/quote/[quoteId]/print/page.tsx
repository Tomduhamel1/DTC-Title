import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ quoteId: string }>
}

async function getQuote(quoteId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lead: true,
    },
  })

  if (!quote) {
    notFound()
  }

  return quote
}

export default async function QuotePrintPage({ params }: PageProps) {
  const { quoteId } = await params
  const quote = await getQuote(quoteId)

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Mortgage Quote - {quote.lead.firstName} {quote.lead.lastName}</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            border-bottom: 4px solid #0693e3;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .logo {
            font-size: 28pt;
            font-weight: bold;
            color: #32373c;
            margin-bottom: 10px;
          }

          .quote-id {
            font-size: 10pt;
            color: #666;
          }

          .client-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }

          .client-info h2 {
            font-size: 14pt;
            margin-bottom: 15px;
            color: #0693e3;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .info-item label {
            display: block;
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }

          .info-item value {
            display: block;
            font-size: 11pt;
            font-weight: 600;
            color: #333;
          }

          .savings-hero {
            background: linear-gradient(135deg, #0693e3 0%, #0369a1 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
          }

          .savings-hero h1 {
            font-size: 18pt;
            margin-bottom: 10px;
            font-weight: normal;
          }

          .savings-amount {
            font-size: 42pt;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .savings-subtitle {
            font-size: 14pt;
            opacity: 0.9;
          }

          .breakdown {
            margin-bottom: 30px;
          }

          .breakdown h2 {
            font-size: 14pt;
            margin-bottom: 20px;
            color: #0693e3;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }

          .breakdown-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .breakdown-item {
            border-left: 4px solid #e5e7eb;
            padding-left: 15px;
          }

          .breakdown-item.current {
            border-left-color: #ef4444;
          }

          .breakdown-item.new {
            border-left-color: #0693e3;
          }

          .breakdown-label {
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }

          .breakdown-value {
            font-size: 20pt;
            font-weight: bold;
            color: #333;
          }

          .breakdown-item.current .breakdown-value {
            color: #ef4444;
          }

          .breakdown-item.new .breakdown-value {
            color: #0693e3;
          }

          .details-section {
            margin-bottom: 30px;
          }

          .details-section h3 {
            font-size: 12pt;
            margin-bottom: 15px;
            color: #333;
          }

          .details-table {
            width: 100%;
            border-collapse: collapse;
          }

          .details-table th {
            text-align: left;
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 10px;
            border-bottom: 2px solid #e5e7eb;
            font-weight: 600;
          }

          .details-table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10pt;
          }

          .details-table tr:last-child td {
            border-bottom: none;
          }

          .break-even-box {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }

          .break-even-box p {
            font-size: 11pt;
            color: #1e40af;
          }

          .break-even-box strong {
            font-size: 12pt;
            color: #1e3a8a;
          }

          .disclaimer {
            background: #fff3cd;
            border: 3px solid #ffc107;
            border-radius: 12px;
            padding: 25px;
            margin-top: 40px;
            page-break-inside: avoid;
          }

          .disclaimer-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }

          .disclaimer-icon {
            width: 40px;
            height: 40px;
            background: #ffc107;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24pt;
            font-weight: bold;
            color: #333;
            margin-right: 15px;
          }

          .disclaimer h3 {
            font-size: 14pt;
            color: #333;
            margin: 0;
          }

          .disclaimer-content {
            font-size: 9pt;
            line-height: 1.5;
            color: #333;
          }

          .disclaimer-content ul {
            list-style: none;
            margin-top: 10px;
          }

          .disclaimer-content li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
          }

          .disclaimer-content li:before {
            content: "•";
            position: absolute;
            left: 5px;
            font-weight: bold;
            color: #ffc107;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 9pt;
            color: #666;
          }

          @media print {
            body {
              padding: 20px;
            }

            .container {
              max-width: 100%;
            }

            .page-break {
              page-break-before: always;
            }

            .no-break {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
            <div className="logo">TrueFee Closing</div>
            <div className="quote-id">Quote ID: {quote.id}</div>
            <div className="quote-id">Generated: {formatDate(quote.createdAt)}</div>
          </div>

          {/* Client Information */}
          <div className="client-info no-break">
            <h2>Client Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <value>{quote.lead.firstName} {quote.lead.lastName}</value>
              </div>
              <div className="info-item">
                <label>Email</label>
                <value>{quote.lead.email}</value>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <value>{quote.lead.phone || 'N/A'}</value>
              </div>
              <div className="info-item">
                <label>Property Location</label>
                <value>
                  {quote.lead.city}, {quote.lead.state} {quote.lead.zipCode}
                </value>
              </div>
            </div>
          </div>

          {/* Savings Hero */}
          <div className="savings-hero no-break">
            <h1>Your Monthly Savings</h1>
            <div className="savings-amount">{formatCurrency(quote.monthlySavings)}</div>
            <div className="savings-subtitle">per month</div>
          </div>

          {/* Payment Breakdown */}
          <div className="breakdown no-break">
            <h2>Payment Breakdown</h2>
            <div className="breakdown-grid">
              <div className="breakdown-item current">
                <div className="breakdown-label">Current Payment</div>
                <div className="breakdown-value">
                  {formatCurrency(quote.currentMonthlyPayment)}
                </div>
              </div>
              <div className="breakdown-item new">
                <div className="breakdown-label">New Payment</div>
                <div className="breakdown-value">
                  {formatCurrency(quote.newMonthlyPayment)}
                </div>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="details-section no-break">
            <h3>Loan Details</h3>
            <table className="details-table">
              <thead>
                <tr>
                  <th>Detail</th>
                  <th>Current</th>
                  <th>New</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Home Value</td>
                  <td>{formatCurrency(quote.homeValue)}</td>
                  <td>{formatCurrency(quote.homeValue)}</td>
                </tr>
                <tr>
                  <td>Loan Amount</td>
                  <td>{formatCurrency(quote.mortgageBalance)}</td>
                  <td>{formatCurrency(quote.mortgageBalance)}</td>
                </tr>
                <tr>
                  <td>Interest Rate</td>
                  <td>{quote.currentRate}%</td>
                  <td>{quote.newRate}%</td>
                </tr>
                <tr>
                  <td>Loan Term</td>
                  <td>{quote.loanTerm / 12} years</td>
                  <td>{quote.loanTerm / 12} years</td>
                </tr>
                <tr>
                  <td>Total Interest Paid</td>
                  <td>{formatCurrency(quote.totalInterestCurrent)}</td>
                  <td>{formatCurrency(quote.totalInterestNew)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Savings */}
          <div className="details-section no-break">
            <h3>Total Savings Over Life of Loan</h3>
            <div className="breakdown-item new" style={{ marginBottom: '20px' }}>
              <div className="breakdown-label">Lifetime Savings</div>
              <div className="breakdown-value">
                {formatCurrency(quote.lifetimeSavings)}
              </div>
            </div>
          </div>

          {/* Break-Even Analysis */}
          {quote.closingCosts && quote.breakEvenMonths && (
            <div className="break-even-box no-break">
              <p>
                <strong>Break-Even Point:</strong> With estimated closing costs of{' '}
                {formatCurrency(quote.closingCosts)}, you'll break even in approximately{' '}
                <strong>{quote.breakEvenMonths} months</strong> (
                {Math.ceil(quote.breakEvenMonths / 12)} year
                {Math.ceil(quote.breakEvenMonths / 12) !== 1 ? 's' : ''}
                ). After that, all monthly savings go directly to you.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer">
            <div className="disclaimer-header">
              <div className="disclaimer-icon">!</div>
              <h3>Important Disclaimer</h3>
            </div>
            <div className="disclaimer-content">
              <ul>
                <li>
                  <strong>This is a good faith estimate only.</strong> Actual rates, payments, and
                  closing costs may vary based on final underwriting, credit approval, property
                  appraisal, and market conditions at the time of loan closing.
                </li>
                <li>
                  <strong>Interest rate not locked.</strong> The interest rate shown is an estimate
                  and is subject to change. Rate locks are available upon application and approval.
                </li>
                <li>
                  <strong>Credit approval required.</strong> All loans are subject to credit
                  approval. Credit score of {quote.creditScore} or better typically required for
                  rates shown.
                </li>
                <li>
                  <strong>Property appraisal required.</strong> Final loan amount may be adjusted
                  based on property appraisal value.
                </li>
                <li>
                  <strong>Closing costs not included.</strong> Monthly payment estimates do not
                  include property taxes, homeowners insurance, HOA fees, or other costs.
                </li>
                <li>
                  <strong>Quote expiration.</strong> This quote is valid for 30 days from the date
                  of generation. After expiration, a new quote may be required.
                </li>
                <li>
                  <strong>Not a commitment to lend.</strong> This quote does not constitute a loan
                  commitment or guarantee of financing. A complete application and approval process
                  is required.
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>TrueFee Closing | Mortgage Refinancing Made Simple</p>
            <p>© 2024 TrueFee Closing. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              Questions? Contact us at support@truefeeclosing.com or call (555) 123-4567
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
