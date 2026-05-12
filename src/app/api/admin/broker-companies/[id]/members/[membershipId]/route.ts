import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'

// Admin-only. Remove a BrokerMembership.
//
// We do NOT downgrade User.accountType back to 'borrower' on removal —
// the user may still belong to other companies, and even if they don't,
// the upgrade was a deliberate admin action and the inverse should be too.
// Admins can edit User.accountType directly if needed.

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; membershipId: string } },
) {
  await requireAdmin()

  // Verify the membership belongs to this company — avoids cross-company
  // membership-id confusion in URLs.
  const membership = await prisma.brokerMembership.findUnique({
    where: { id: params.membershipId },
    select: { id: true, companyId: true },
  })
  if (!membership || membership.companyId !== params.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  try {
    await prisma.brokerMembership.delete({ where: { id: params.membershipId } })
  } catch (err) {
    // Idempotent: another admin may have just deleted it.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ ok: true, alreadyRemoved: true })
    }
    throw err
  }

  return NextResponse.json({ ok: true })
}
