import { NextRequest, NextResponse } from 'next/server'
import { QuoteEngine, QuoteEngineInput } from '@/lib/quote-engine'
import { z } from 'zod'

const quoteEngineInputSchema = z.object({
  state: z.string().length(2),
  county: z.string().min(1),
  purchasePrice: z.number().positive(),
  loanAmount: z.number().positive(),
  transactionType: z.enum(['purchase', 'refinance']),
  productChoice: z.enum(['basic', 'standard', 'premium']),
  competitorQuoteTotal: z.number().positive().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = quoteEngineInputSchema.parse(body)

    // Calculate quote using the quote engine
    const quote = await QuoteEngine.calculate(validatedData as QuoteEngineInput)

    return NextResponse.json(
      {
        success: true,
        quote,
        provider: QuoteEngine.getProviderName(),
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
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const healthy = await QuoteEngine.healthCheck()
    const provider = QuoteEngine.getProviderName()

    return NextResponse.json(
      {
        success: true,
        healthy,
        provider,
        timestamp: new Date().toISOString(),
      },
      { status: healthy ? 200 : 503 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        healthy: false,
        error: 'Health check failed',
      },
      { status: 503 }
    )
  }
}
