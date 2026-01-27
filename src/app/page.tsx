import { Suspense } from 'react'
import PageWrapper from './PageWrapper'

export default function Page() {
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
