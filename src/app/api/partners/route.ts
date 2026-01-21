import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/partners - Get all partners
 */
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ isActive: 'desc' }, { priority: 'desc' }],
    })

    return NextResponse.json({ partners })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/partners - Create a new partner
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const partner = await prisma.partner.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        isActive: body.isActive ?? true,
        priority: body.priority ?? 0,
        specialties: body.specialties ?? null,
        notes: body.notes,
      },
    })

    return NextResponse.json({ partner })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/partners - Update a partner
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      )
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ partner })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    )
  }
}
