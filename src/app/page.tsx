import { Suspense } from 'react'
import { cookies } from 'next/headers'
import PageWrapper from './PageWrapper'

export const dynamic = 'force-dynamic'

export default function Page() {
  // Touching cookies() opts the route into per-request rendering and makes
  // Next emit Cache-Control: private, no-store. Without this, Amplify's
  // CloudFront pins / for a year and the middleware's bypass-cookie rewrite
  // never gets a chance to run for returning visitors.
  cookies()

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <PageWrapper />
    </Suspense>
  )
}
