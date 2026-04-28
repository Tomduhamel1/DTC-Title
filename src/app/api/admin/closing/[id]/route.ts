import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { normalizePhoneKey, normalizePropertyKey } from '@/lib/closing'

const ALLOWED_FIELDS = [
  'propertyAddress',
  'propertyCity',
  'propertyState',
  'propertyZip',
  'propertyType',
  'salePrice',
  'loanAmount',
  'closingDate',
  'borrowerEmail',
  'borrowerPhone',
  'lenderName',
  'lenderCompany',
  'lenderEmail',
  'lenderPhone',
  'lenderNmls',
  'agentName',
  'agentCompany',
  'agentEmail',
  'agentPhone',
  'titleUnderwriter',
  'titlePolicyNo',
  'closingLocation',
  'status',
] as const

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const closing = await prisma.closing.findUnique({ where: { id: params.id } })
  if (!closing) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const fields = body as Record<string, unknown>
  const data: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in fields) data[key] = fields[key]
  }

  if ('propertyAddress' in data) {
    data.propertyAddressKey = normalizePropertyKey(data.propertyAddress as string | null)
  }
  if ('borrowerPhone' in data) {
    data.borrowerPhone = normalizePhoneKey(data.borrowerPhone as string | null)
  }
  if ('closingDate' in data && typeof data.closingDate === 'string' && data.closingDate) {
    data.closingDate = new Date(data.closingDate as string)
  }
  for (const numKey of ['salePrice', 'loanAmount'] as const) {
    if (numKey in data && typeof data[numKey] === 'string') {
      const n = parseFloat((data[numKey] as string).replace(/[^0-9.]/g, ''))
      data[numKey] = Number.isFinite(n) ? n : null
    }
  }

  const updated = await prisma.closing.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json({ ok: true, closing: updated })
}
