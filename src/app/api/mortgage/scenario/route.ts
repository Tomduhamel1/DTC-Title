import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  calculateMonthlyPI,
  calculateMonthlyPITI,
  calculateUpfrontCosts,
} from '@/lib/mortgage/calculator'

const createScenarioSchema = z.object({
  leadId: z.string(),
  lenderName: z.string().optional(),
  loanAmount: z.number().positive(),
  interestRate: z.number().positive(),
  term: z.number().positive(), // months
  points: z.number().min(0).optional(),
  lenderFees: z.number().min(0).optional(),
  propertyTaxes: z.number().min(0).optional(), // monthly
  homeInsurance: z.number().min(0).optional(), // monthly
  hoaFees: z.number().min(0).optional(), // monthly
  pmi: z.number().min(0).optional(), // monthly
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createScenarioSchema.parse(body)

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Calculate P&I
    const principalInterest = calculateMonthlyPI(
      data.loanAmount,
      data.interestRate,
      data.term
    )

    // Calculate total monthly payment (PITI if components provided, else just P&I)
    const totalMonthly = calculateMonthlyPITI(
      principalInterest,
      data.propertyTaxes,
      data.homeInsurance,
      data.hoaFees,
      data.pmi
    )

    // Calculate upfront costs
    const totalUpfront = calculateUpfrontCosts(
      data.loanAmount,
      data.points,
      data.lenderFees
    )

    // Create mortgage scenario
    const scenario = await prisma.mortgageScenario.create({
      data: {
        leadId: data.leadId,
        source: 'user_entered',
        lenderName: data.lenderName,
        loanAmount: data.loanAmount,
        interestRate: data.interestRate,
        term: data.term,
        points: data.points,
        lenderFees: data.lenderFees,
        propertyTaxes: data.propertyTaxes,
        homeInsurance: data.homeInsurance,
        hoaFees: data.hoaFees,
        pmi: data.pmi,
        principalInterest,
        totalMonthly,
        totalUpfront,
      },
    })

    // Log activity event
    await prisma.activityEvent.create({
      data: {
        leadId: data.leadId,
        type: 'mortgage_terms_added',
        action: 'User entered mortgage lender terms',
        metadata: {
          scenarioId: scenario.id,
          lenderName: data.lenderName,
          loanAmount: data.loanAmount,
          interestRate: data.interestRate,
          principalInterest,
          totalMonthly,
          totalUpfront,
        },
      },
    })

    return NextResponse.json({
      success: true,
      scenario: {
        id: scenario.id,
        principalInterest,
        totalMonthly,
        totalUpfront,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating mortgage scenario:', error)
    return NextResponse.json(
      { error: 'Failed to create mortgage scenario' },
      { status: 500 }
    )
  }
}
