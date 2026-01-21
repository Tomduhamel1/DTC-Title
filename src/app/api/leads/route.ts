import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  homeValue: z.number().positive().optional(),
  mortgageBalance: z.number().positive().optional(),
  currentRate: z.number().positive().optional(),
  creditScore: z.string().optional(),
  propertyType: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = leadSchema.parse(body)

    // Check if lead with this email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email: validatedData.email },
    })

    let lead

    if (existingLead) {
      // Update existing lead
      lead = await prisma.lead.update({
        where: { email: validatedData.email },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      })

      // Log activity
      await prisma.activityEvent.create({
        data: {
          leadId: lead.id,
          type: 'form_submit',
          action: 'Updated lead information',
          metadata: {
            source: validatedData.source || 'unknown',
          },
        },
      })
    } else {
      // Create new lead
      lead = await prisma.lead.create({
        data: validatedData,
      })

      // Log activity
      await prisma.activityEvent.create({
        data: {
          leadId: lead.id,
          type: 'form_submit',
          action: 'Lead created',
          metadata: {
            source: validatedData.source || 'unknown',
          },
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        lead: {
          id: lead.id,
          email: lead.email,
          firstName: lead.firstName,
          lastName: lead.lastName,
        },
      },
      { status: existingLead ? 200 : 201 }
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

    console.error('Error creating/updating lead:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
