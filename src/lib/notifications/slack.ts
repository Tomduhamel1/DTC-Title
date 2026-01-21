/**
 * Slack notification utilities for mortgage referrals
 */

interface SlackReferralNotification {
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
  partnerName: string
  partnerEmail: string
  referralId: string
  leadId: string
}

/**
 * Send Slack notification when a new mortgage referral is created
 */
export async function notifySlackReferral(
  data: SlackReferralNotification
): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification')
    return false
  }

  const message = {
    text: '🏠 New Mortgage Referral',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🏠 New Mortgage Referral Request',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Lead:*\n${data.leadName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${data.leadEmail}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Phone:*\n${data.leadPhone || 'Not provided'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Credit Band:*\n${data.creditBand}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Property Type:*\n${data.propertyType}`,
          },
          {
            type: 'mrkdwn',
            text: `*Occupancy:*\n${data.occupancy}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Loan Amount:*\n${
              data.requestedLoanAmount
                ? `$${data.requestedLoanAmount.toLocaleString()}`
                : 'Not specified'
            }`,
          },
          {
            type: 'mrkdwn',
            text: `*Down Payment:*\n${data.downPaymentPct}%`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Term Preference:*\n${formatTermPreference(data.termPreference)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Contact Preference:*\n${formatContactPreference(
              data.contactPreference
            )}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Assigned Partner:*\n${data.partnerName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Partner Email:*\n${data.partnerEmail}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Referral ID:*\n\`${data.referralId}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Lead ID:*\n\`${data.leadId}\``,
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Lead Details',
              emoji: true,
            },
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/leads/${data.leadId}`,
            style: 'primary',
          },
        ],
      },
    ],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error(
        `Slack notification failed: ${response.status} ${response.statusText}`
      )
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    return false
  }
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
