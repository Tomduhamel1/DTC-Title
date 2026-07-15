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

  // SES Source supports RFC 5322 "Display Name <addr@host>" format. Inboxes
  // surface the display name to recipients (e.g. "BetterClose" instead of
  // "noreply"). If the caller already supplied "Name <addr>", leave it as-is.
  const formattedSource = /<[^>]+>/.test(fromAddress)
    ? fromAddress
    : `BetterClose <${fromAddress}>`

  const command = new SendEmailCommand({
    Source: formattedSource,
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
