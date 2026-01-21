import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { selectPartner } from '@/lib/mortgage/partner'
import { sendPartnerReferralEmail } from '@/lib/email/partner-referral'
import { notifySlackReferral } from '@/lib/notifications/slack'

const createReferralSchema = z.object({
  leadId: z.string(),
  creditBand: z.enum(['excellent', 'good', 'fair', 'poor']),
  occupancy: z.enum(['primary', 'secondary', 'investment']),
  propertyType: z.enum([
    'single_family',
    'condo',
    'townhouse',
    'multi_family',
    'manufactured',
  ]),
  downPaymentPct: z.number().min(0).max(100),
  termPreference: z.enum([
    '30_year',
    '15_year',
    '20_year',
    '10_year',
    '7_1_arm',
    '5_1_arm',
    'arm',
  ]),
  contactPreference: z.enum(['email', 'phone', 'both']),
  requestedLoanAmount: z.number().positive().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createReferralSchema.parse(body)

    // Verify lead exists and get full details
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Select best partner based on preferences
    const partnerSelection = await selectPartner({
      creditBand: data.creditBand,
      propertyType: data.propertyType,
      occupancy: data.occupancy,
    })

    if (!partnerSelection.partner) {
      return NextResponse.json(
        { error: 'No active partners available' },
        { status: 503 }
      )
    }

    const partner = partnerSelection.partner

    // Create mortgage referral
    const referral = await prisma.mortgageReferral.create({
      data: {
        leadId: data.leadId,
        partnerId: partner.id,
        creditBand: data.creditBand,
        occupancy: data.occupancy,
        propertyType: data.propertyType,
        downPaymentPct: data.downPaymentPct,
        termPreference: data.termPreference,
        contactPreference: data.contactPreference,
        requestedLoanAmount: data.requestedLoanAmount,
        notes: data.notes,
        status: 'pending',
      },
    })

    // Prepare notification data
    const leadName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unknown'
    const notificationData = {
      partnerName: partner.name,
      partnerEmail: partner.email,
      leadName,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      creditBand: data.creditBand,
      propertyType: data.propertyType,
      occupancy: data.occupancy,
      requestedLoanAmount: data.requestedLoanAmount,
      downPaymentPct: data.downPaymentPct,
      termPreference: data.termPreference,
      contactPreference: data.contactPreference,
      notes: data.notes,
      referralId: referral.id,
      leadId: lead.id,
    }

    // Send partner email (don't block on failure)
    sendPartnerReferralEmail(notificationData).catch((error) => {
      console.error('Failed to send partner email:', error)
    })

    // Send Slack notification (don't block on failure)
    notifySlackReferral(notificationData).catch((error) => {
      console.error('Failed to send Slack notification:', error)
    })

    // Log activity event
    await prisma.activityEvent.create({
      data: {
        leadId: data.leadId,
        type: 'mortgage_referral_requested',
        action: 'User requested mortgage loan suggestions',
        metadata: {
          referralId: referral.id,
          partnerId: partner.id,
          partnerName: partner.name,
          partnerSelectionReason: partnerSelection.reason,
          creditBand: data.creditBand,
          propertyType: data.propertyType,
          occupancy: data.occupancy,
          termPreference: data.termPreference,
          requestedLoanAmount: data.requestedLoanAmount,
        },
      },
    })

    return NextResponse.json({
      success: true,
      referral: {
        id: referral.id,
        partner: {
          name: partner.name,
          selectionReason: partnerSelection.reason,
        },
        status: referral.status,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating mortgage referral:', error)
    return NextResponse.json(
      { error: 'Failed to create mortgage referral' },
      { status: 500 }
    )
  }
}
