import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { normalizeSlug } from '@/lib/brokerCompany'

// Admin-only. Edits an existing BrokerCompany. Each field is optional; only
// fields present in the body are touched. `verified` is a boolean toggle —
// true sets verifiedAt to now (if currently null), false clears it. Sending
// verified=true on an already-verified company is a no-op (preserves the
// original verification timestamp).

const Body = z
  .object({
    name: z.string().trim().min(1).max(160).optional(),
    slug: z.string().trim().min(1).max(64).optional(),
    primaryDomain: z.string().trim().max(160).nullable().optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
    verified: z.boolean().optional(),
  })
  .strict()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const existing = await prisma.brokerCompany.findUnique({ where: { id: params.id } })
  if (!existing) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const data: Prisma.BrokerCompanyUpdateInput = {}
  if (parsed.data.name !== undefined) data.name = parsed.data.name
  if (parsed.data.slug !== undefined) {
    const normalized = normalizeSlug(parsed.data.slug)
    if (!normalized) {
      return NextResponse.json({ error: 'slug normalized to empty' }, { status: 400 })
    }
    data.slug = normalized
  }
  if (parsed.data.primaryDomain !== undefined) {
    data.primaryDomain = parsed.data.primaryDomain || null
  }
  if (parsed.data.notes !== undefined) {
    data.notes = parsed.data.notes || null
  }
  if (parsed.data.verified !== undefined) {
    if (parsed.data.verified) {
      // Idempotent — preserves the original verification timestamp.
      if (existing.verifiedAt === null) data.verifiedAt = new Date()
    } else {
      data.verifiedAt = null
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: true, company: existing, updated: 0 })
  }

  try {
    const updated = await prisma.brokerCompany.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json({ ok: true, company: updated })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { error: 'slug already in use', slug: data.slug },
        { status: 409 },
      )
    }
    throw err
  }
}
