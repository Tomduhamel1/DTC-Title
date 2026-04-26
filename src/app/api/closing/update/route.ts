import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/session'
import { normalizePhoneKey, normalizePropertyKey } from '@/lib/closing'

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const { closingId, ...fields } = body as Record<string, unknown>
  if (typeof closingId !== 'string') {
    return NextResponse.json({ error: 'closingId required' }, { status: 400 })
  }

  // Verify ownership
  const closing = await prisma.closing.findFirst({
    where: { id: closingId, userId: user.id },
  })
  if (!closing) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // Only allow specific writable fields
  const ALLOWED = [
    'propertyAddress',
    'propertyCity',
    'propertyState',
    'propertyZip',
    'propertyType',
    'salePrice',
    'loanAmount',
    'closingDate',
    'borrowerPhone',
    'borrowerEmail',
    'lenderName',
    'lenderCompany',
    'lenderEmail',
    'lenderPhone',
    'lenderNmls',
    'agentName',
    'agentCompany',
    'agentEmail',
    'agentPhone',
  ] as const

  const data: Record<string, unknown> = {}
  for (const key of ALLOWED) {
    if (key in fields) data[key] = fields[key]
  }

  // Derived fields
  if ('propertyAddress' in data) {
    data.propertyAddressKey = normalizePropertyKey(data.propertyAddress as string | null)
  }
  if ('borrowerPhone' in data) {
    data.borrowerPhone = normalizePhoneKey(data.borrowerPhone as string | null)
  }
  if ('closingDate' in data && typeof data.closingDate === 'string' && data.closingDate) {
    data.closingDate = new Date(data.closingDate as string)
  }
  if ('salePrice' in data && typeof data.salePrice === 'string') {
    const n = parseFloat((data.salePrice as string).replace(/[^0-9.]/g, ''))
    data.salePrice = Number.isFinite(n) ? n : null
  }
  if ('loanAmount' in data && typeof data.loanAmount === 'string') {
    const n = parseFloat((data.loanAmount as string).replace(/[^0-9.]/g, ''))
    data.loanAmount = Number.isFinite(n) ? n : null
  }

  const updated = await prisma.closing.update({
    where: { id: closingId },
    data,
  })

  return NextResponse.json({ ok: true, closing: updated })
}
