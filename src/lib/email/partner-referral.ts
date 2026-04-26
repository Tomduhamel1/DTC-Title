/**
 * Email templates for partner referrals
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.APP_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey:
      process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

interface PartnerReferralEmailData {
  partnerName: string
  partnerEmail: string
  leadName: string
  leadEmail: string
  leadPhone?: string
  creditBand: string
  propertyType: string
  occupancy: string
  requestedLoanAmount?: number
  downPaymentPct: number
  termPreference: string
  contactPreference: string
  notes?: string
  referralId: string
}

/**
 * Send referral notification email to partner
 */
export async function sendPartnerReferralEmail(
  data: PartnerReferralEmailData
): Promise<boolean> {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || 'noreply@truefeeclosing.com'

  const htmlBody = generatePartnerEmailHTML(data)
  const textBody = generatePartnerEmailText(data)

  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [data.partnerEmail],
    },
    Message: {
      Subject: {
        Data: `New Mortgage Referral - ${data.leadName}`,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  }

  try {
    const command = new SendEmailCommand(params)
    await sesClient.send(command)
    return true
  } catch (error) {
    console.error('Error sending partner referral email:', error)
    return false
  }
}

function generatePartnerEmailHTML(data: PartnerReferralEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #10b981;
      font-size: 24px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #10b981;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-item {
      padding: 12px;
      background-color: #f9fafb;
      border-radius: 6px;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 15px;
      color: #111827;
      font-weight: 500;
    }
    .notes {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin-top: 20px;
      border-radius: 4px;
    }
    .cta-button {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
    }
    .referral-id {
      font-family: monospace;
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 New Mortgage Referral</h1>
      <p style="margin: 10px 0 0 0; color: #6b7280;">
        Referral ID: <span class="referral-id">${data.referralId}</span>
      </p>
    </div>

    <p>Hi ${data.partnerName},</p>
    <p>You have received a new mortgage referral from TrueFee Closing. Please review the client details below and reach out according to their contact preferences.</p>

    <div class="section">
      <div class="section-title">Contact Information</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Name</div>
          <div class="info-value">${data.leadName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${data.leadEmail}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">${data.leadPhone || 'Not provided'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Preferred Contact</div>
          <div class="info-value">${formatContactPreference(data.contactPreference)}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Loan Preferences</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Credit Band</div>
          <div class="info-value">${formatCreditBand(data.creditBand)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Property Type</div>
          <div class="info-value">${formatPropertyType(data.propertyType)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Occupancy</div>
          <div class="info-value">${formatOccupancy(data.occupancy)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Term Preference</div>
          <div class="info-value">${formatTermPreference(data.termPreference)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Loan Amount</div>
          <div class="info-value">${data.requestedLoanAmount ? `$${data.requestedLoanAmount.toLocaleString()}` : 'Not specified'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Down Payment</div>
          <div class="info-value">${data.downPaymentPct}%</div>
        </div>
      </div>
    </div>

    ${
      data.notes
        ? `
    <div class="notes">
      <div class="info-label" style="margin-bottom: 8px;">Additional Notes</div>
      <div>${data.notes}</div>
    </div>
    `
        : ''
    }

    <p style="margin-top: 30px;">
      <strong>Next Steps:</strong><br>
      Please reach out to this client within 24 hours according to their contact preference.
      They are expecting to hear from you regarding purchase loan options.
    </p>

    <div class="footer">
      <p>This referral was generated by TrueFee Closing's mortgage platform.</p>
      <p>If you have questions about this referral, please contact our team.</p>
    </div>
  </div>
</body>
</html>
  `
}

function generatePartnerEmailText(data: PartnerReferralEmailData): string {
  return `
New Mortgage Referral - ${data.leadName}
Referral ID: ${data.referralId}

Hi ${data.partnerName},

You have received a new mortgage referral from TrueFee Closing.

CONTACT INFORMATION
Name: ${data.leadName}
Email: ${data.leadEmail}
Phone: ${data.leadPhone || 'Not provided'}
Preferred Contact: ${formatContactPreference(data.contactPreference)}

LOAN PREFERENCES
Credit Band: ${formatCreditBand(data.creditBand)}
Property Type: ${formatPropertyType(data.propertyType)}
Occupancy: ${formatOccupancy(data.occupancy)}
Term Preference: ${formatTermPreference(data.termPreference)}
Loan Amount: ${data.requestedLoanAmount ? `$${data.requestedLoanAmount.toLocaleString()}` : 'Not specified'}
Down Payment: ${data.downPaymentPct}%

${data.notes ? `ADDITIONAL NOTES\n${data.notes}\n` : ''}

NEXT STEPS
Please reach out to this client within 24 hours according to their contact preference.

---
This referral was generated by TrueFee Closing's mortgage platform.
  `.trim()
}

function formatCreditBand(band: string): string {
  const bandMap: Record<string, string> = {
    excellent: 'Excellent (740+)',
    good: 'Good (670-739)',
    fair: 'Fair (580-669)',
    poor: 'Poor (<580)',
  }
  return bandMap[band] || band
}

function formatPropertyType(type: string): string {
  const typeMap: Record<string, string> = {
    single_family: 'Single Family',
    condo: 'Condominium',
    townhouse: 'Townhouse',
    multi_family: 'Multi-Family',
    manufactured: 'Manufactured',
  }
  return typeMap[type] || type
}

function formatOccupancy(occupancy: string): string {
  const occupancyMap: Record<string, string> = {
    primary: 'Primary Residence',
    secondary: 'Secondary/Vacation Home',
    investment: 'Investment Property',
  }
  return occupancyMap[occupancy] || occupancy
}

function formatTermPreference(term: string): string {
  const termMap: Record<string, string> = {
    '30_year': '30 Year Fixed',
    '15_year': '15 Year Fixed',
    '20_year': '20 Year Fixed',
    '10_year': '10 Year Fixed',
    '7_1_arm': '7/1 ARM',
    '5_1_arm': '5/1 ARM',
    arm: 'ARM',
  }
  return termMap[term] || term
}

function formatContactPreference(pref: string): string {
  const prefMap: Record<string, string> = {
    email: 'Email',
    phone: 'Phone',
    both: 'Email & Phone',
  }
  return prefMap[pref] || pref
}
