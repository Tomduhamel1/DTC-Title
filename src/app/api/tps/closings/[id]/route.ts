import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { MILESTONE_KINDS } from '@/lib/closing'

// GET /api/tps/closings/[id]
// Read-only snapshot of a Closing for the TPS side. Returns everything TPS
// might want to mirror: borrower contact, property/loan, milestone state,
// the assigned BetterClose escrow officer (so TPS routes calls/email to
// the right person), and any teammate emails on file.
//
// Auth: shared secret in `Authorization: Bearer <ORDER_INGEST_SECRET>`.

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = _req.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.ORDER_INGEST_SECRET || ''}`
  if (!process.env.ORDER_INGEST_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const closing = await prisma.closing.findUnique({
    where: { id: params.id },
    include: {
      milestones: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      teammates: {
        where: { userId: { not: null } },
        select: { matchedEmail: true, role: true, muted: true },
      },
    },
  })

  if (!closing) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // Normalise milestones into the canonical 5-step shape TPS expects.
  const byKind = new Map(closing.milestones.map((m) => [m.kind, m]))
  const milestones = MILESTONE_KINDS.map((kind) => {
    const m = byKind.get(kind)
    return {
      kind,
      status: m?.status ?? 'pending',
      completedAt: m?.completedAt ?? null,
    }
  })

  return NextResponse.json({
    ok: true,
    closing: {
      id: closing.id,
      status: closing.status,
      source: closing.source,
      createdAt: closing.createdAt,
      updatedAt: closing.updatedAt,
      closedAt: closing.closedAt,
      borrower: {
        userId: closing.user?.id ?? null,
        name: closing.user?.name ?? null,
        email: closing.borrowerEmail || closing.user?.email || null,
        phone: closing.borrowerPhone || closing.user?.phone || null,
      },
      property: {
        address: closing.propertyAddress,
        city: closing.propertyCity,
        state: closing.propertyState,
        zip: closing.propertyZip,
        type: closing.propertyType,
      },
      transaction: {
        salePrice: closing.salePrice,
        loanAmount: closing.loanAmount,
        closingDate: closing.closingDate,
      },
      lender: {
        name: closing.lenderName,
        company: closing.lenderCompany,
        email: closing.lenderEmail,
        phone: closing.lenderPhone,
        nmls: closing.lenderNmls,
      },
      agent: {
        name: closing.agentName,
        company: closing.agentCompany,
        email: closing.agentEmail,
        phone: closing.agentPhone,
      },
      title: {
        underwriter: closing.titleUnderwriter,
        policyNumber: closing.titlePolicyNo,
      },
      escrowOfficer: {
        name: closing.escrowOfficerName,
        title: closing.escrowOfficerTitle,
        email: closing.escrowOfficerEmail,
        phone: closing.escrowOfficerPhone,
        nmls: closing.escrowOfficerNmls,
        photoUrl: closing.escrowOfficerPhotoUrl,
      },
      closingLocation: closing.closingLocation,
      milestones,
      teammates: closing.teammates.map((t) => ({
        email: t.matchedEmail,
        role: t.role,
        muted: t.muted,
      })),
    },
  })
}
