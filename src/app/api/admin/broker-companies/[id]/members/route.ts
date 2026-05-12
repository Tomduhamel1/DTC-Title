import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { addBrokerCompanyMember } from '@/lib/brokerCompany'

// Admin-only. Add a member by email to this BrokerCompany.
//
// Idempotent: re-adding the same email is a no-op (same userId+companyId
// resolves to the existing BrokerMembership). Returns flags so the UI can
// surface what actually happened — whether a User row was created, whether
// accountType was upgraded, whether the membership is new.
//
// Does NOT send any email or magic-link. The created User row (when the
// email is brand new) has no Account/Session; NextAuth's PrismaAdapter will
// hydrate those automatically the first time that email signs in.

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().max(160).optional(),
  role: z.enum(['owner', 'member']).optional(),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const company = await prisma.brokerCompany.findUnique({
    where: { id: params.id },
    select: { id: true },
  })
  if (!company) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const result = await addBrokerCompanyMember({
    companyId: company.id,
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role ?? 'member',
  })

  return NextResponse.json(result)
}
