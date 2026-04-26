import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

export default function VerifyRequestPage() {
  const dryRun = process.env.AUTH_EMAIL_DRY_RUN === 'true'

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gradient-to-br from-primary-50 to-white min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-dark-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We sent a sign-in link. Tap the link in the email to access your dashboard.
            <br />
            The link expires in 24 hours.
          </p>

          {dryRun && (
            <div className="text-left bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-900">
              <div className="font-bold mb-1">Dev mode</div>
              <div>
                No email actually sent. Check your terminal for the magic-link URL — it's printed under <code className="bg-amber-100 px-1 rounded">[auth] magic-link</code>.
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Didn't get it?{' '}
            <Link href="/login" className="text-primary-700 font-semibold underline-offset-2 hover:underline">
              Try again
            </Link>
          </p>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
