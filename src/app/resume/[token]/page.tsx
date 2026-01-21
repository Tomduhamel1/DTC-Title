import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { isTokenExpired } from '@/lib/intake/token'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function ResumePage({ params }: PageProps) {
  const { token } = await params

  // Find lead by resume token
  const lead = await prisma.lead.findUnique({
    where: { resumeToken: token },
  })

  if (!lead) {
    // Token not found
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This resume link is invalid or has expired. Please start a new application.
          </p>
          <a href="/start" className="btn-primary inline-block">
            Start New Application
          </a>
        </div>
      </div>
    )
  }

  // Check if token is expired
  if (isTokenExpired(lead.tokenExpiresAt)) {
    // Token expired, but we can still load the data
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This resume link has expired, but we've saved your progress! We'll send you a new
            link when you continue.
          </p>
          <form action="/start" method="get">
            <input type="hidden" name="email" value={lead.email} />
            <button type="submit" className="btn-primary">
              Continue Application
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Log activity
  await prisma.activityEvent.create({
    data: {
      leadId: lead.id,
      type: 'intake_updated',
      action: 'Resumed application via magic link',
      metadata: {
        token,
        completionPercentage: lead.completionPercentage,
      },
    },
  })

  // Build URL with saved data
  const savedData = {
    formData: lead.intakeJson || {},
    leadId: lead.id,
    resumeToken: lead.resumeToken,
    completionPercentage: lead.completionPercentage,
  }

  const dataParam = encodeURIComponent(JSON.stringify(savedData))
  redirect(`/start?data=${dataParam}`)
}
