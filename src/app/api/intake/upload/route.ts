import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateUploadUrl, validateFile } from '@/lib/aws/upload'
import { z } from 'zod'

const uploadRequestSchema = z.object({
  leadId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  documentType: z.string(),
})

/**
 * Generate presigned upload URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, fileName, fileSize, fileType, documentType } =
      uploadRequestSchema.parse(body)

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead not found',
        },
        { status: 404 }
      )
    }

    // Validate file
    const validation = validateFile(fileName, fileSize, fileType)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      )
    }

    // Generate presigned upload URL
    const { uploadUrl, key, expiresIn } = await generateUploadUrl({
      leadId,
      fileName,
      fileType,
      documentType,
    })

    return NextResponse.json(
      {
        success: true,
        uploadUrl,
        key,
        expiresIn,
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

    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
