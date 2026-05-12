import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireBrokerMember } from '@/lib/auth/session'

// GET /api/broker/quotes/[id]
//
// Company-scoped read. A broker can view any quote attached to a
// BrokerCompany they belong to, regardless of which co-member created it.
// Quotes at companies the caller does NOT belong to return 404 (not 403)
// so quote-id existence is not leaked.

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const companyIds = ctx.memberships.map((m) => m.companyId)
  const quote = await prisma.feeQuote.findFirst({
    where: { id: params.id, brokerCompanyId: { in: companyIds } },
    select: {
      id: true,
      status: true,
      shareToken: true,
      borrowerName: true,
      borrowerEmail: true,
      borrowerPhone: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      propertyZip: true,
      inputJson: true,
      outputJson: true,
      pdfS3Url: true,
      convertedClosingId: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
      brokerCompany: {
        select: { id: true, name: true, slug: true, verifiedAt: true },
      },
      brokerUser: { select: { id: true, name: true, email: true } },
    },
  })

  if (!quote) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, quote })
}
