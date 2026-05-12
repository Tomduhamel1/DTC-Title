import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { normalizeSlug, slugFromName } from '@/lib/brokerCompany'

// Admin-only. Creates a new BrokerCompany. Slug is derived from `name` when
// not supplied. Returns 409 if the slug collides with an existing company.

const Body = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(64).optional(),
  primaryDomain: z.string().trim().max(160).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
})

export async function POST(req: Request) {
  await requireAdmin()

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const slug = parsed.data.slug
    ? normalizeSlug(parsed.data.slug)
    : slugFromName(parsed.data.name)
  if (!slug) {
    return NextResponse.json({ error: 'slug could not be derived from name' }, { status: 400 })
  }

  try {
    const company = await prisma.brokerCompany.create({
      data: {
        name: parsed.data.name,
        slug,
        primaryDomain: parsed.data.primaryDomain || null,
        notes: parsed.data.notes || null,
      },
    })
    return NextResponse.json({ ok: true, company })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { error: 'slug already in use', slug },
        { status: 409 },
      )
    }
    throw err
  }
}
