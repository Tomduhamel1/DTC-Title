import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

// PATCH /api/tps/closings/[id]/details
//
// Lets TPS push field updates back to BetterClose for fields TPS owns —
// the assigned escrow officer (so the borrower's dashboard shows the right
// person and contact info), title underwriter and policy number once
// known, and the physical closing location.
//
// Borrower-owned fields (property, loan amount, contact info) are NOT
// settable here — those are the borrower's source of truth and TPS should
// pull them from /api/tps/closings/[id], not push them.
//
// Auth: Bearer ORDER_INGEST_SECRET. Idempotent — passing the same body
// twice is a no-op.

const Body = z
  .object({
    escrowOfficer: z
      .object({
        name: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
        email: z.string().email().nullable().optional(),
        phone: z.string().nullable().optional(),
        nmls: z.string().nullable().optional(),
        photoUrl: z.string().url().nullable().optional(),
      })
      .optional(),
    title: z
      .object({
        underwriter: z.string().nullable().optional(),
        policyNumber: z.string().nullable().optional(),
      })
      .optional(),
    closingLocation: z.string().nullable().optional(),
  })
  .strict()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.ORDER_INGEST_SECRET || ''}`
  if (!process.env.ORDER_INGEST_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const closing = await prisma.closing.findUnique({
    where: { id: params.id },
    select: { id: true },
  })
  if (!closing) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const data: Record<string, string | null> = {}
  const eo = parsed.data.escrowOfficer
  if (eo) {
    if ('name' in eo) data.escrowOfficerName = eo.name ?? null
    if ('title' in eo) data.escrowOfficerTitle = eo.title ?? null
    if ('email' in eo) data.escrowOfficerEmail = eo.email ?? null
    if ('phone' in eo) data.escrowOfficerPhone = eo.phone ?? null
    if ('nmls' in eo) data.escrowOfficerNmls = eo.nmls ?? null
    if ('photoUrl' in eo) data.escrowOfficerPhotoUrl = eo.photoUrl ?? null
  }
  const tt = parsed.data.title
  if (tt) {
    if ('underwriter' in tt) data.titleUnderwriter = tt.underwriter ?? null
    if ('policyNumber' in tt) data.titlePolicyNo = tt.policyNumber ?? null
  }
  if ('closingLocation' in parsed.data) {
    data.closingLocation = parsed.data.closingLocation ?? null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: true, updated: 0 })
  }

  await prisma.closing.update({
    where: { id: closing.id },
    data,
  })

  // If TPS just assigned a new escrow officer with an email, that email is
  // also a teammate of the file — surface them in the teammate index so
  // they show up if they ever log in.
  if (eo?.email) {
    try {
      const { upsertTeammateClosing } = await import('@/lib/teammate/match')
      await upsertTeammateClosing({
        closingId: closing.id,
        email: eo.email,
        role: 'unknown',
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[tps/details] escrow-officer teammate upsert failed', err)
    }
  }

  return NextResponse.json({ ok: true, updated: Object.keys(data).length })
}
