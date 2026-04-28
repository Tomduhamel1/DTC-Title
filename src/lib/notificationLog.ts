import { prisma } from '@/lib/db'

export type NotificationStatus = 'sent' | 'failed' | 'skipped'

export interface LogNotificationInput {
  userId?: string | null
  closingId?: string | null
  channel?: string // defaults to 'email'
  kind: string // e.g. 'milestone:loan_locked', 'milestone:closed', 'magic_link', 'lender_invite'
  recipient: string
  subject: string
  status: NotificationStatus
  providerMessageId?: string | null
  error?: string | null
}

export async function logNotification(input: LogNotificationInput): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        userId: input.userId ?? null,
        closingId: input.closingId ?? null,
        channel: input.channel || 'email',
        kind: input.kind,
        recipient: input.recipient,
        subject: input.subject,
        status: input.status,
        providerMessageId: input.providerMessageId ?? null,
        error: input.error ?? null,
      },
    })
  } catch (err) {
    // Logging is best-effort — never let a logging failure break the main flow.
    // eslint-disable-next-line no-console
    console.error('[notificationLog] insert failed:', err)
  }
}
