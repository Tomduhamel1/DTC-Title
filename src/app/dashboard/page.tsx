import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { requireUser } from '@/lib/auth/session'
import { getOrCreateClosingForUser } from '@/lib/closing'
import DashboardHome from '@/components/dashboard/DashboardHome'
import OnboardingForm from '@/components/dashboard/OnboardingForm'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser()
  if (!user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const closing = await getOrCreateClosingForUser(user.id)
  const needsOnboarding = !closing.propertyAddress

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {needsOnboarding ? (
            <OnboardingForm closingId={closing.id} userName={user.name} userEmail={user.email} />
          ) : (
            <DashboardHome closing={closing} userName={user.name} userEmail={user.email} />
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
