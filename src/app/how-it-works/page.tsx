import type { Metadata } from 'next'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import HowItWorksSection from '@/components/HowItWorksSection'

export const metadata: Metadata = {
  title: 'How It Works · BetterClose',
  description: 'See how to choose BetterClose, follow your closing progress, and close with your team.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <main className="pt-20">
        <HowItWorksSection headingLevel="h1" />
      </main>
      <FooterComprehensive />
    </div>
  )
}
