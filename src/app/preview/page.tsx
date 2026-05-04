import { Suspense } from 'react'
import PageWrapper from '../PageWrapper'

export const dynamic = 'force-dynamic'

// Mirrors / for previewers (people with the cs_bypass cookie or a session).
// Lives at a separate URL so CloudFront's per-URL cache for / — which is
// pinned to the gated coming-soon HTML — doesn't poison their experience.
// Middleware rewrites authorized visitors from / to here.
export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <PageWrapper />
    </Suspense>
  )
}
