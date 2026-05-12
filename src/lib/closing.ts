import { prisma } from '@/lib/db'

export const MILESTONE_KINDS = [
  'loan_locked',
  'title_ordered',
  'title_search',
  'title_issued',
  'closed',
] as const

export type MilestoneKind = (typeof MILESTONE_KINDS)[number]

export const MILESTONE_LABELS: Record<MilestoneKind, string> = {
  loan_locked: 'Loan locked',
  title_ordered: 'Title ordered',
  title_search: 'Title search complete',
  title_issued: 'Title issued',
  closed: 'Closed',
}

export const MILESTONE_DESCRIPTIONS: Record<MilestoneKind, string> = {
  loan_locked: 'Your lender finalizes your interest rate.',
  title_ordered: 'Your closing team opened your title order with BetterClose.',
  title_search: 'We confirm clean title — no liens, no surprises.',
  title_issued: 'Title insurance is issued by an A-rated underwriter.',
  closed: 'Funds disbursed. Keys handed over. Done.',
}

export function normalizePropertyKey(address: string | null | undefined): string | null {
  if (!address) return null
  return address
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizePhoneKey(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.length >= 10 ? digits.slice(-10) : null
}

/**
 * Get a user's primary (most recent active) closing, or create a stub one if none exist.
 * Always seeds the 5 milestone rows so the timeline renders even on a brand-new account.
 */
export async function getOrCreateClosingForUser(userId: string) {
  let closing = await prisma.closing.findFirst({
    where: { userId, status: { in: ['pending', 'active'] } },
    orderBy: { createdAt: 'desc' },
    include: { milestones: true },
  })

  if (!closing) {
    closing = await prisma.closing.create({
      data: {
        userId,
        source: 'user_signup',
        status: 'pending',
        milestones: {
          create: MILESTONE_KINDS.map((kind) => ({ kind })),
        },
      },
      include: { milestones: true },
    })
  } else if (closing.milestones.length === 0) {
    // Defensive: backfill milestones if a row exists but milestones don't.
    await prisma.milestone.createMany({
      data: MILESTONE_KINDS.map((kind) => ({ closingId: closing!.id, kind })),
    })
    closing = await prisma.closing.findUnique({
      where: { id: closing.id },
      include: { milestones: true },
    })
  }

  return closing!
}

/**
 * Identity-resolution stub for the title-software integration that comes later.
 *
 * When a lender emails an order or the title software pushes one, this function
 * is called to find an existing closing/user to attach to. Match priority:
 *   1. exact borrowerEmail
 *   2. last-10-digit phone
 *   3. normalized property address key
 *
 * If nothing matches, the caller should create a new orphan Closing (userId=null)
 * and trigger the welcome-email flow on the borrowerEmail.
 */
export async function resolveClosingForOrder(input: {
  borrowerEmail?: string | null
  borrowerPhone?: string | null
  propertyAddress?: string | null
}) {
  if (input.borrowerEmail) {
    const byEmail = await prisma.closing.findFirst({
      where: { borrowerEmail: input.borrowerEmail.toLowerCase() },
    })
    if (byEmail) return { closing: byEmail, matchedBy: 'email' as const }

    // Also try matching on the User table — the user may have created an
    // account but not yet entered their property.
    const user = await prisma.user.findUnique({
      where: { email: input.borrowerEmail.toLowerCase() },
      include: { closings: { take: 1, orderBy: { createdAt: 'desc' } } },
    })
    if (user?.closings[0]) return { closing: user.closings[0], matchedBy: 'user_email' as const }
  }

  const phoneKey = normalizePhoneKey(input.borrowerPhone)
  if (phoneKey) {
    const byPhone = await prisma.closing.findFirst({ where: { borrowerPhone: phoneKey } })
    if (byPhone) return { closing: byPhone, matchedBy: 'phone' as const }
  }

  const propKey = normalizePropertyKey(input.propertyAddress)
  if (propKey) {
    const byProp = await prisma.closing.findFirst({ where: { propertyAddressKey: propKey } })
    if (byProp) return { closing: byProp, matchedBy: 'property' as const }
  }

  return { closing: null, matchedBy: null }
}
