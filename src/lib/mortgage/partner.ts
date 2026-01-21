import { prisma } from '@/lib/db'

export interface PartnerSelection {
  partner: {
    id: string
    name: string
    email: string
    phone?: string
  } | null
  reason: string
}

/**
 * Select the best partner for a referral based on preferences
 */
export async function selectPartner(preferences: {
  creditBand: string
  propertyType: string
  occupancy: string
}): Promise<PartnerSelection> {
  // Get all active partners, ordered by priority
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { priority: 'desc' },
  })

  if (partners.length === 0) {
    return {
      partner: null,
      reason: 'No active partners available',
    }
  }

  // Try to find a partner that matches specialties
  for (const partner of partners) {
    if (!partner.specialties) continue

    const specialties = partner.specialties as any
    const creditBands = specialties.creditBands || []
    const propertyTypes = specialties.propertyTypes || []

    const matchesCredit =
      creditBands.length === 0 || creditBands.includes(preferences.creditBand)
    const matchesProperty =
      propertyTypes.length === 0 || propertyTypes.includes(preferences.propertyType)

    if (matchesCredit && matchesProperty) {
      return {
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone || undefined,
        },
        reason: 'Matched based on specialties',
      }
    }
  }

  // Default to highest priority partner
  const defaultPartner = partners[0]
  return {
    partner: {
      id: defaultPartner.id,
      name: defaultPartner.name,
      email: defaultPartner.email,
      phone: defaultPartner.phone || undefined,
    },
    reason: 'Default to highest priority partner',
  }
}

/**
 * Get partner by ID
 */
export async function getPartner(partnerId: string) {
  return prisma.partner.findUnique({
    where: { id: partnerId },
  })
}

/**
 * Get all active partners
 */
export async function getActivePartners() {
  return prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { priority: 'desc' },
  })
}
