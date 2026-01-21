import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generatePdfFromUrl } from '@/lib/pdf/generator'
import { uploadToS3, generatePdfKey } from '@/lib/aws/s3'
import { sendQuotePdfEmail } from '@/lib/aws/ses'
import { z } from 'zod'

const pdfRequestSchema = z.object({
  quoteId: z.string(),
  sendEmail: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quoteId, sendEmail: shouldSendEmail } = pdfRequestSchema.parse(body)

    // Fetch the quote with lead information
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        lead: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quote not found',
        },
        { status: 404 }
      )
    }

    // Check if PDF already exists
    if (quote.pdfUrl) {
      console.log('PDF already exists for quote:', quoteId)

      // Still send email if requested
      if (shouldSendEmail && quote.lead.email) {
        try {
          await sendQuotePdfEmail(
            quote.lead.email,
            `${quote.lead.firstName} ${quote.lead.lastName}`,
            quote.id,
            quote.pdfUrl,
            quote.monthlySavings
          )

          // Log email activity
          await prisma.activityEvent.create({
            data: {
              leadId: quote.leadId,
              type: 'email_sent',
              action: 'Quote PDF emailed',
              metadata: {
                quoteId: quote.id,
                pdfUrl: quote.pdfUrl,
                emailTo: quote.lead.email,
              },
            },
          })
        } catch (emailError) {
          console.error('Error sending email:', emailError)
          // Don't fail the request if email fails
        }
      }

      return NextResponse.json(
        {
          success: true,
          pdfUrl: quote.pdfUrl,
          quoteId: quote.id,
          message: 'PDF already exists',
        },
        { status: 200 }
      )
    }

    // Generate the print page URL
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const printUrl = `${protocol}://${host}/quote/${quoteId}/print`

    console.log('Generating PDF from URL:', printUrl)

    // Generate PDF using Puppeteer
    const pdfBuffer = await generatePdfFromUrl({
      url: printUrl,
      timeout: 30000,
    })

    console.log('PDF generated, size:', pdfBuffer.length, 'bytes')

    // Upload to S3
    const s3Key = generatePdfKey(quoteId)
    const pdfUrl = await uploadToS3({
      buffer: pdfBuffer,
      key: s3Key,
      contentType: 'application/pdf',
    })

    console.log('PDF uploaded to S3:', pdfUrl)

    // Update quote with PDF URL
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        pdfUrl,
      },
    })

    // Log quote generation activity
    await prisma.activityEvent.create({
      data: {
        leadId: quote.leadId,
        type: 'quote_generated',
        action: 'Quote PDF generated',
        metadata: {
          quoteId: quote.id,
          pdfUrl,
          monthlySavings: quote.monthlySavings,
          lifetimeSavings: quote.lifetimeSavings,
        },
      },
    })

    // Send email if requested
    if (shouldSendEmail && quote.lead.email) {
      try {
        const messageId = await sendQuotePdfEmail(
          quote.lead.email,
          `${quote.lead.firstName} ${quote.lead.lastName}`,
          quote.id,
          pdfUrl,
          quote.monthlySavings
        )

        console.log('Email sent, message ID:', messageId)

        // Log email activity
        await prisma.activityEvent.create({
          data: {
            leadId: quote.leadId,
            type: 'email_sent',
            action: 'Quote PDF emailed',
            metadata: {
              quoteId: quote.id,
              pdfUrl,
              emailTo: quote.lead.email,
              messageId,
            },
          },
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail the request if email fails - PDF was still generated
        return NextResponse.json(
          {
            success: true,
            pdfUrl,
            quoteId: quote.id,
            warning: 'PDF generated but email failed to send',
            emailError:
              emailError instanceof Error ? emailError.message : 'Unknown email error',
          },
          { status: 200 }
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        pdfUrl,
        quoteId: quote.id,
        emailSent: shouldSendEmail && !!quote.lead.email,
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

    console.error('Error generating PDF:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
