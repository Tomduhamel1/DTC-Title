import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { stateOffered } from '@/lib/stateMaster'
import { createClosingFromOrder } from '@/lib/closing/createFromOrder'
import { sendOpenFileOpsEmail } from '@/lib/email/open-file-ops'

// Public open-a-file endpoint behind the /open form. Any persona (borrower,
// broker, realtor, lender) can place an order; the shared createClosingFromOrder
// path seeds a NEW Closing and its milestones, welcome email and teammates.
// Contact details supplied publicly never select or grant access to an
// existing file. Ops must explicitly correlate any duplicate submission.

const Body = z
  .object({
    role: z.enum(['borrower', 'broker', 'realtor', 'lender']),
    // Who is filling out the form (professionals only; for borrowers the
    // borrower fields are the submitter).
    submitterName: z.string().trim().max(160).optional(),
    submitterEmail: z.string().trim().email().max(254).optional(),
    submitterCompany: z.string().trim().max(160).optional(),
    submitterPhone: z.string().trim().max(40).optional(),
    borrowerName: z.string().trim().max(160).optional(),
    borrowerEmail: z.string().trim().email().max(254),
    borrowerPhone: z.string().trim().max(40).optional(),
    propertyAddress: z.string().trim().min(4).max(240),
    propertyCity: z.string().trim().max(120).optional(),
    propertyState: z.string().trim().toUpperCase().length(2),
    propertyZip: z.string().trim().regex(/^\d{5}$/),
    transactionType: z.enum(['purchase', 'refinance']),
    salePrice: z.number().positive().max(100_000_000).optional(),
    loanAmount: z.number().positive().max(100_000_000).optional(),
    closingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'borrower' && !data.submitterEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['submitterEmail'],
        message: 'Your work email is required so we can link the file to you.',
      })
    }
  })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipLimit = rateLimit(`orders-open:ip:${ip}`, 5, 15 * 60 * 1000)
  if (!ipLimit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests — please try again shortly.' },
      { status: 429 },
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const d = parsed.data

  // Availability: an OFF state gets the coming-soon/waitlist path, not an order.
  if (!stateOffered(d.propertyState, d.transactionType)) {
    return NextResponse.json(
      { ok: false, notOffered: true, state: d.propertyState },
      { status: 200 },
    )
  }

  const emailLimit = rateLimit(
    `orders-open:email:${d.borrowerEmail.toLowerCase()}`,
    3,
    60 * 60 * 1000,
  )
  if (!emailLimit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests for this email — please try again later.' },
      { status: 429 },
    )
  }

  const isProfessional = d.role !== 'borrower'

  const result = await createClosingFromOrder({
    borrowerEmail: d.borrowerEmail,
    borrowerName: d.borrowerName ?? null,
    borrowerPhone: d.borrowerPhone ?? null,
    propertyAddress: d.propertyAddress,
    propertyCity: d.propertyCity ?? null,
    propertyState: d.propertyState,
    propertyZip: d.propertyZip,
    propertyType: d.transactionType,
    transactionType: d.transactionType,
    closingDate: d.closingDate ?? null,
    salePrice: d.salePrice ?? null,
    loanAmount: d.loanAmount ?? null,
    // A broker/LO placing the order is the most useful "lender contact" until
    // Garden fills in the real loan record.
    lenderName: d.role === 'broker' || d.role === 'lender' ? d.submitterName ?? null : null,
    lenderCompany: d.role === 'broker' || d.role === 'lender' ? d.submitterCompany ?? null : null,
    lenderEmail: d.role === 'broker' || d.role === 'lender' ? d.submitterEmail ?? null : null,
    lenderPhone: d.role === 'broker' || d.role === 'lender' ? d.submitterPhone ?? null : null,
    teammateEmail: isProfessional ? d.submitterEmail ?? null : null,
    teammateRole: isProfessional ? (d.role === 'lender' ? 'lender' : d.role) : null,
    source: 'web_open_file',
  }, { matchExisting: false, welcomePurpose: 'request_received', borrowerInitiated: d.role === 'borrower' })

  const ops = await sendOpenFileOpsEmail({
    closingId: result.closingId,
    matched: result.matched,
    role: d.role,
    submitterName: d.submitterName,
    submitterEmail: d.submitterEmail,
    submitterCompany: d.submitterCompany,
    submitterPhone: d.submitterPhone,
    borrowerName: d.borrowerName,
    borrowerEmail: d.borrowerEmail,
    borrowerPhone: d.borrowerPhone,
    propertyAddress: d.propertyAddress,
    propertyCity: d.propertyCity,
    propertyState: d.propertyState,
    propertyZip: d.propertyZip,
    transactionType: d.transactionType,
    salePrice: d.salePrice,
    loanAmount: d.loanAmount,
    closingDate: d.closingDate,
    notes: d.notes,
  })

  try {
    await prisma.notificationLog.create({
      data: {
        closingId: result.closingId,
        kind: 'web:open-file:ops',
        recipient: ops.recipient,
        subject: 'New web order',
        providerMessageId: ops.messageId,
        status: ops.messageId ? 'sent' : 'failed',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[orders/open] notification log failed', err)
  }

  // Tell the UI whether the relevant person already has an account, so the
  // success panel can say "sign in" vs "check your email".
  const accountEmail = (isProfessional ? d.submitterEmail! : d.borrowerEmail).toLowerCase()
  const existingUser = await prisma.user.findUnique({
    where: { email: accountEmail },
    select: { id: true },
  })

  return NextResponse.json({
    ok: true,
    // The requester's own file id — harmless to them, and it lets ops/Garden
    // reconcile a phoned-in order against the web submission.
    closingId: result.closingId,
    accountExists: Boolean(existingUser),
    matchedExistingFile: result.matched,
  })
}
