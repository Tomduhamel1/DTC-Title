import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateTitleSavings } from '@/lib/title-calculator'
import { z } from 'zod'

const quoteRequestSchema = z.object({
  transactionType: z.enum(['purchase', 'refinance']),
  homeValue: z.number().positive(),
  loanAmount: z.number().positive(),
  state: z.string().min(2).max(2),
  county: z.string().optional(),
  email: z.string().email().optional(),
  leadId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = quoteRequestSchema.parse(body)

    // Calculate title and settlement savings
    const savingsResult = calculateTitleSavings({
      transactionType: validatedData.transactionType,
      homeValue: validatedData.homeValue,
      loanAmount: validatedData.loanAmount,
      state: validatedData.state,
      county: validatedData.county,
    })

    // If email is provided, find or create lead and save quote
    let leadId = validatedData.leadId
    let savedQuote = null

    if (validatedData.email || leadId) {
      // Find or create lead
      if (validatedData.email && !leadId) {
        let lead = await prisma.lead.findUnique({
          where: { email: validatedData.email },
        })

        if (!lead) {
          lead = await prisma.lead.create({
            data: {
              email: validatedData.email,
              homeValue: validatedData.homeValue,
              source: 'title_calculator',
            },
          })
        }

        leadId = lead.id
      }

      if (leadId) {
        // Save quote to database
        // Note: Reusing existing Quote model fields to store title savings
        // In production, you might create a separate TitleQuote model
        savedQuote = await prisma.quote.create({
          data: {
            leadId,
            homeValue: validatedData.homeValue,
            mortgageBalance: validatedData.loanAmount, // Using as loanAmount
            currentRate: 0, // Not applicable for title quotes
            newRate: 0, // Not applicable
            creditScore: validatedData.transactionType, // Storing transaction type here
            loanTerm: 0, // Not applicable
            currentMonthlyPayment: savingsResult.traditionalCosts.total, // Traditional closing costs
            newMonthlyPayment: savingsResult.trueFeeClosingCosts.total, // TrueFee Closing costs
            monthlySavings: savingsResult.savings, // Total savings
            totalInterestCurrent: savingsResult.traditionalCosts.titleInsurance,
            totalInterestNew: savingsResult.trueFeeClosingCosts.titleInsurance,
            lifetimeSavings: savingsResult.savings,
            closingCosts: savingsResult.traditionalCosts.total,
            breakEvenMonths: 0, // Not applicable
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        })

        // Log activity
        await prisma.activityEvent.create({
          data: {
            leadId,
            type: 'quote_generated',
            action: 'Generated title savings quote',
            metadata: {
              transactionType: validatedData.transactionType,
              state: validatedData.state,
              totalSavings: savingsResult.savings,
              savingsPercentage: savingsResult.savingsPercentage,
            },
          },
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        quote: {
          transactionType: validatedData.transactionType,
          traditionalCosts: savingsResult.traditionalCosts.total,
          trueFeeClosingCosts: savingsResult.trueFeeClosingCosts.total,
          savings: savingsResult.savings,
          savingsPercentage: savingsResult.savingsPercentage,
          lineItems: savingsResult.lineItems,
          breakdown: savingsResult,
        },
        quoteId: savedQuote?.id,
        leadId,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error calculating quote:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
