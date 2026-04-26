import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Amplify forbids env keys starting with "AWS_", so on Amplify we use APP_AWS_*.
// Read both, prefer APP_AWS_* (set on Amplify), fall back to AWS_* (local dev).
const sesClient = new SESClient({
  region: process.env.APP_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey:
      process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export interface SendEmailParams {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string | string[]
  subject: string
  htmlBody: string
  textBody?: string
  from?: string
}

const toArray = (v: string | string[] | undefined): string[] | undefined =>
  v == null ? undefined : Array.isArray(v) ? v : [v]

/**
 * Send an email via AWS SES
 */
export async function sendEmail({
  to,
  cc,
  bcc,
  replyTo,
  subject,
  htmlBody,
  textBody,
  from,
}: SendEmailParams): Promise<string> {
  const fromAddress = from || process.env.AWS_SES_FROM_EMAIL || 'noreply@betterclose.co'

  const command = new SendEmailCommand({
    Source: fromAddress,
    Destination: {
      ToAddresses: toArray(to),
      CcAddresses: toArray(cc),
      BccAddresses: toArray(bcc),
    },
    ReplyToAddresses: toArray(replyTo),
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: textBody
          ? {
              Data: textBody,
              Charset: 'UTF-8',
            }
          : undefined,
      },
    },
  })

  const response = await sesClient.send(command)
  return response.MessageId || ''
}

/**
 * Send quote PDF email
 */
export async function sendQuotePdfEmail(
  recipientEmail: string,
  recipientName: string,
  quoteId: string,
  pdfUrl: string,
  monthlySavings: number
): Promise<string> {
  const subject = 'Your Mortgage Refinance Quote from TrueFee Closing'

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #0693e3 0%, #0369a1 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .savings {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background: #0693e3;
      color: white;
      text-decoration: none;
      padding: 15px 30px;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .quote-id {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Your Quote is Ready!</h1>
    <div class="savings">$${monthlySavings.toLocaleString()}</div>
    <p style="margin: 0; font-size: 18px;">in monthly savings</p>
  </div>

  <div class="content">
    <p>Hi ${recipientName},</p>

    <p>Thank you for your interest in refinancing with TrueFee Closing. We're excited to share your personalized mortgage quote!</p>

    <p><strong>Your potential monthly savings: $${monthlySavings.toLocaleString()}</strong></p>

    <p>Your complete quote, including detailed payment breakdowns and savings analysis, is attached as a PDF.</p>

    <a href="${pdfUrl}" class="button">Download Your Quote PDF</a>

    <p class="quote-id">Quote ID: ${quoteId}</p>

    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>Review your personalized quote</li>
      <li>Compare with your current mortgage</li>
      <li>Contact us to get started</li>
    </ul>

    <p>This quote is valid for 30 days. Interest rates can change, so we recommend acting soon to lock in your savings.</p>
  </div>

  <div class="footer">
    <p><strong>TrueFee Closing</strong></p>
    <p>Questions? Reply to this email or call us at (555) 123-4567</p>
    <p style="margin-top: 20px; font-size: 12px; color: #999;">
      This email contains a good faith estimate. Actual rates and terms subject to credit approval and market conditions.
    </p>
  </div>
</body>
</html>
`

  const textBody = `
Hi ${recipientName},

Your mortgage refinance quote from TrueFee Closing is ready!

Your potential monthly savings: $${monthlySavings.toLocaleString()}

Download your complete quote PDF: ${pdfUrl}

Quote ID: ${quoteId}

Next Steps:
- Review your personalized quote
- Compare with your current mortgage
- Contact us to get started

This quote is valid for 30 days.

Questions? Reply to this email or call us at (555) 123-4567

TrueFee Closing
Mortgage Refinancing Made Simple
`

  return sendEmail({
    to: recipientEmail,
    subject,
    htmlBody,
    textBody,
  })
}
