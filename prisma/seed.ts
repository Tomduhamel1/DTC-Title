import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed partners
  const partners = [
    {
      name: 'Premier Home Lending',
      email: 'referrals@premierhome.example.com',
      phone: '(555) 100-1000',
      isActive: true,
      priority: 100,
      specialties: {
        creditBands: ['excellent', 'good'],
        propertyTypes: ['single_family', 'condo', 'townhouse'],
        loanTypes: ['conventional', 'jumbo'],
      },
      notes: 'Specializes in high-credit borrowers and conventional loans',
    },
    {
      name: 'Community First Mortgage',
      email: 'leads@communityfirst.example.com',
      phone: '(555) 200-2000',
      isActive: true,
      priority: 90,
      specialties: {
        creditBands: ['good', 'fair'],
        propertyTypes: ['single_family', 'multi_family'],
        loanTypes: ['fha', 'va', 'conventional'],
      },
      notes: 'Great with FHA and VA loans, serves middle-credit borrowers',
    },
    {
      name: 'Flexible Lending Solutions',
      email: 'info@flexiblelending.example.com',
      phone: '(555) 300-3000',
      isActive: true,
      priority: 80,
      specialties: {
        creditBands: ['fair', 'poor'],
        propertyTypes: ['single_family', 'condo', 'manufactured'],
        loanTypes: ['fha', 'subprime'],
      },
      notes: 'Specializes in credit repair and lower-credit borrowers',
    },
    {
      name: 'Investment Property Experts',
      email: 'referrals@ipexperts.example.com',
      phone: '(555) 400-4000',
      isActive: true,
      priority: 85,
      specialties: {
        creditBands: ['excellent', 'good'],
        propertyTypes: ['multi_family', 'single_family'],
        loanTypes: ['investment', 'conventional'],
      },
      notes: 'Focused on investment properties and multi-family homes',
    },
    {
      name: 'Universal Home Loans',
      email: 'partners@universalhome.example.com',
      phone: '(555) 500-5000',
      isActive: true,
      priority: 70,
      specialties: {
        creditBands: [], // Accepts all credit bands
        propertyTypes: [], // Accepts all property types
        loanTypes: ['conventional', 'fha', 'va', 'usda'],
      },
      notes: 'General lender accepting all credit levels and property types',
    },
  ]

  for (const partner of partners) {
    const created = await prisma.partner.upsert({
      where: { email: partner.email },
      update: partner,
      create: partner,
    })
    console.log(`Created/updated partner: ${created.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
