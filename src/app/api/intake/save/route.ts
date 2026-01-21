import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateCompletionPercentage } from '@/lib/intake/progress'
import { generateResumeToken, getTokenExpiration } from '@/lib/intake/token'
import { z } from 'zod'

const saveIntakeSchema = z.object({
  email: z.string().email(),
  data: z.record(z.any()),
  resumeToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, data, resumeToken } = saveIntakeSchema.parse(body)

    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(data)

    // Find existing lead or create new one
    let lead = await prisma.lead.findUnique({
      where: { email },
    })

    const isNewLead = !lead

    if (!lead) {
      // Create new lead with resume token
      const newToken = generateResumeToken()
      const tokenExpiration = getTokenExpiration(7)

      lead = await prisma.lead.create({
        data: {
          email,
          ...data, // Save top-level fields
          intakeJson: data,
          completionPercentage,
          resumeToken: newToken,
          tokenExpiresAt: tokenExpiration,
          source: 'progressive_intake',
        },
      })

      // Log intake_started activity
      await prisma.activityEvent.create({
        data: {
          leadId: lead.id,
          type: 'intake_started',
          action: 'Started progressive intake',
          metadata: {
            completionPercentage,
            email,
          },
        },
      })
    } else {
      // Update existing lead
      const updateData: any = {
        ...data,
        intakeJson: data,
        completionPercentage,
        updatedAt: new Date(),
      }

      // Generate resume token if doesn't exist or expired
      if (!lead.resumeToken || !lead.tokenExpiresAt || new Date() > lead.tokenExpiresAt) {
        updateData.resumeToken = generateResumeToken()
        updateData.tokenExpiresAt = getTokenExpiration(7)
      }

      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: updateData,
      })

      // Log intake_updated activity
      await prisma.activityEvent.create({
        data: {
          leadId: lead.id,
          type: 'intake_updated',
          action: 'Updated progressive intake',
          metadata: {
            completionPercentage,
            previousCompletion: lead.completionPercentage,
          },
        },
      })
    }

    // Generate resume URL
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const resumeUrl = `${protocol}://${host}/resume/${lead.resumeToken}`

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        completionPercentage: lead.completionPercentage,
        resumeToken: lead.resumeToken,
        resumeUrl,
        isNew: isNewLead,
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

    console.error('Error saving intake:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
