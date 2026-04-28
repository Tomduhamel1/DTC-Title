import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { MILESTONE_KINDS, MILESTONE_LABELS, type MilestoneKind } from '@/lib/closing'
import { sendClosingUpdateEmail } from '@/lib/email/closing-update'
import { sendClosingCompletedEmail } from '@/lib/email/closing-completed'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'
import type { FeeReport } from '@/lib/feeReport'
import { logNotification } from '@/lib/notificationLog'

const Body = z.object({
  kind: z.enum(MILESTONE_KINDS as unknown as [MilestoneKind, ...MilestoneKind[]]),
  status: z.enum(['pending', 'active', 'done']),
})

function firstName(name?: string | null): string | null {
  if (!name) return null
  return name.split(' ')[0] || null
}

function fullAddress(c: { propertyAddress: string | null; propertyCity: string | null; propertyState: string | null; propertyZip: string | null }): string | null {
  const parts = [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

async function buildSnapshotFeeReport(input: {
  propertyZip: string | null
  loanAmount: number | null
  salePrice: number | null
  propertyType: string | null
}): Promise<FeeReport | null> {
  const zip = input.propertyZip
  if (!zip || !/^\d{5}$/.test(zip)) return null
  const txType: 'purchase' | 'refinance' =
    input.propertyType === 'refinance' ? 'refinance' : 'purchase'
  const homeValue = input.salePrice || 0
  let loanAmount = input.loanAmount || 0
  if (txType === 'purchase' && !loanAmount && homeValue) loanAmount = Math.round(homeValue * 0.8)
  if (!loanAmount) return null
  try {
    return await fetchElendFeeEstimate({ transactionType: txType, zip, homeValue, loanAmount })
  } catch (err) {
    console.error('[admin] snapshot fee-estimate failed:', err)
    return null
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body', details: parsed.error.flatten() }, { status: 400 })
  }
  const { kind, status } = parsed.data

  const closing = await prisma.closing.findUnique({
    where: { id: params.id },
    include: {
      milestones: true,
      user: { select: { id: true, email: true, name: true } },
    },
  })
  if (!closing) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Find or create the milestone row.
  let milestone = closing.milestones.find((m) => m.kind === kind)
  if (!milestone) {
    milestone = await prisma.milestone.create({
      data: { closingId: closing.id, kind, status: 'pending' },
    })
  }

  const wasDone = milestone.status === 'done'
  const goingToDone = status === 'done'

  // Persist the status change.
  const completedAt = goingToDone ? milestone.completedAt || new Date() : milestone.completedAt
  await prisma.milestone.update({
    where: { id: milestone.id },
    data: { status, completedAt: goingToDone ? completedAt : null },
  })

  // Side-effects only fire on the first done transition (idempotent).
  let emailed = false
  let snapshotted = false
  if (goingToDone && !wasDone && !milestone.notifiedAt) {
    const recipient = closing.borrowerEmail || closing.user?.email
    if (recipient) {
      const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
      const dashboardUrl = `${baseUrl}/dashboard`

      const dryRun = process.env.AUTH_EMAIL_DRY_RUN === 'true'

      if (kind === 'closed') {
        // Snapshot the fee report so the celebratory email + post-close
        // dashboard view always show what they actually saved.
        const snapshot = await buildSnapshotFeeReport(closing)
        await prisma.closing.update({
          where: { id: closing.id },
          data: {
            status: 'closed',
            closedAt: new Date(),
            // Cast through unknown to satisfy Prisma's Json typing for arbitrary objects.
            snapshotFeeReport: snapshot ? (snapshot as unknown as object) : undefined,
          },
        })
        snapshotted = !!snapshot

        const subject = "You're closed! · Your BetterClose savings"
        try {
          const messageId = await sendClosingCompletedEmail({
            to: recipient,
            borrowerFirstName: firstName(closing.user?.name),
            propertyAddress: fullAddress(closing),
            feeReport: snapshot,
            dashboardUrl,
          })
          emailed = true
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: 'milestone:closed',
            recipient,
            subject,
            status: dryRun ? 'skipped' : 'sent',
            providerMessageId: messageId,
          })
        } catch (err) {
          console.error('[admin] closing-completed email failed:', err)
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: 'milestone:closed',
            recipient,
            subject,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        const subject = `${MILESTONE_LABELS[kind]} · BetterClose`
        try {
          const messageId = await sendClosingUpdateEmail({
            to: recipient,
            borrowerFirstName: firstName(closing.user?.name),
            milestoneKind: kind,
            propertyAddress: fullAddress(closing),
            dashboardUrl,
          })
          emailed = true
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `milestone:${kind}`,
            recipient,
            subject,
            status: dryRun ? 'skipped' : 'sent',
            providerMessageId: messageId,
          })
        } catch (err) {
          console.error('[admin] closing-update email failed:', err)
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `milestone:${kind}`,
            recipient,
            subject,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err),
          })
        }
      }

      // Record the notify time so toggling done→pending→done doesn't re-send.
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { notifiedAt: new Date() },
      })
    }
  }

  return NextResponse.json({ ok: true, emailed, snapshotted })
}
