import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendLenderRequestEmail } from '@/lib/email/lender-request'
import { getSession } from '@/lib/auth/session'

const Body = z.object({
  channel: z.enum(['sms', 'mailto', 'we_email', 'copy_link', 'native_share']),
  refId: z.string().min(4).max(64),
  source: z.string().min(1).max(64),
  // Only required when channel = 'we_email'
  lenderEmail: z.string().email().optional(),
  lenderFirstName: z.string().max(120).optional(),
  lenderCompany: z.string().max(160).optional(),
  clientName: z.string().max(160).optional(),
  clientEmail: z.string().email().optional(),
  note: z.string().max(500).optional(),
  savingsEstimate: z.number().nonnegative().optional(),
})

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body', details: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data

  // For we_email we require lenderEmail
  if (data.channel === 'we_email' && !data.lenderEmail) {
    return NextResponse.json({ error: 'lenderEmail required for we_email channel' }, { status: 400 })
  }

  // Only auto-attribute when the share originated from inside the dashboard.
  // Public shares (quote_results, hero, etc.) stay anonymous and get claimed
  // on sign-up via /api/lender-request/claim — that way an invite sent before
  // the user creates an account ends up on the *right* account.
  const session = await getSession()
  // @ts-expect-error — id is added in session callback
  const sessionUserId = (session?.user?.id as string | undefined) ?? null
  const isDashboardShare = data.source === 'dashboard_account'
  const userId = isDashboardShare ? sessionUserId : null
  let closingId: string | null = null
  if (userId) {
    const closing = await prisma.closing.findFirst({
      where: { userId, status: { in: ['pending', 'active'] } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    closingId = closing?.id ?? null
  }

  // Persist the share event regardless of channel
  const record = await prisma.lenderRequest.create({
    data: {
      refId: data.refId,
      channel: data.channel,
      source: data.source,
      lenderEmail: data.lenderEmail?.toLowerCase(),
      lenderFirstName: data.lenderFirstName,
      lenderCompany: data.lenderCompany,
      clientName: data.clientName,
      clientEmail: data.clientEmail?.toLowerCase(),
      note: data.note,
      savingsEstimate: data.savingsEstimate,
      userId,
      closingId,
    },
  })

  // Only the we_email channel actually triggers an SES send
  if (data.channel === 'we_email' && data.lenderEmail) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://betterclose.co'
    try {
      const messageId = await sendLenderRequestEmail({
        lenderEmail: data.lenderEmail,
        lenderFirstName: data.lenderFirstName,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        note: data.note,
        savingsEstimate: data.savingsEstimate,
        refId: data.refId,
        baseUrl,
      })
      return NextResponse.json({ ok: true, requestId: record.id, messageId })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[lender-request] SES send failed', err)
      await prisma.lenderRequest.update({
        where: { id: record.id },
        data: { status: 'failed' },
      })
      return NextResponse.json({ ok: false, error: 'send failed' }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true, requestId: record.id })
}
