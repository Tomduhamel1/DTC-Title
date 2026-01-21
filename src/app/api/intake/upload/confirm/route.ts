import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getDocumentUrl } from '@/lib/aws/upload'
import { z } from 'zod'

const confirmUploadSchema = z.object({
  leadId: z.string(),
  key: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  documentType: z.string(),
})

/**
 * Confirm file upload and save to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, key, fileName, fileSize, fileType, documentType } =
      confirmUploadSchema.parse(body)

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

    // Get document URL
    const s3Url = getDocumentUrl(key)

    // Save document record
    const document = await prisma.document.create({
      data: {
        leadId,
        type: documentType,
        fileName,
        fileSize,
        mimeType: fileType,
        s3Key: key,
        s3Url,
        uploadedBy: 'user',
      },
    })

    // Log doc_uploaded activity
    await prisma.activityEvent.create({
      data: {
        leadId,
        type: 'doc_uploaded',
        action: `Uploaded ${documentType}`,
        metadata: {
          documentId: document.id,
          fileName,
          fileSize,
          documentType,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        document: {
          id: document.id,
          type: document.type,
          fileName: document.fileName,
          s3Url: document.s3Url,
        },
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

    console.error('Error confirming upload:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
