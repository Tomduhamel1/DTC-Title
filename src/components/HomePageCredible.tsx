'use client'

import { SavingsProvider } from '@/contexts/SavingsContext'
import NavigationCredible from './NavigationCredible'
import HeroOptionA from './HeroOptionA'
import HeroOptionB from './HeroOptionB'
import HeroOptionC from './HeroOptionC'
import CompanyCredentialsSection from './CompanyCredentialsSection'
import HowItWorksSection from './HowItWorksSection'
import FeeReportPreviewSection from './FeeReportPreviewSection'
import TeamTrustSection from './TeamTrustSection'
import UnderwriterLogos from './UnderwriterLogos'
import TestimonialsCredible from './TestimonialsCredible'
import FAQSection from './FAQSection'
import SecurityTrustSection from './SecurityTrustSection'
import ReadyToSaveSection from './ReadyToSaveSection'
import FooterComprehensive from './FooterComprehensive'

interface HomePageCredibleProps {
  heroVersion?: 'A' | 'B' | 'C'
}

export default function HomePageCredible({ heroVersion = 'A' }: HomePageCredibleProps) {
  return (
    <SavingsProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <NavigationCredible />

        {/* Spacer for fixed header */}
        <div className="h-20"></div>

        {/* Hero Section - Toggle between options A, B, and C */}
        {heroVersion === 'C' ? <HeroOptionC /> : heroVersion === 'B' ? <HeroOptionB /> : <HeroOptionA />}

        {/* Fee Report Preview - the transparency story */}
        <FeeReportPreviewSection />

        {/* Company Credentials */}
        <CompanyCredentialsSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Team Trust Section */}
        <TeamTrustSection />

        {/* Underwriter Logos */}
        <UnderwriterLogos />

        {/* Testimonials */}
        <TestimonialsCredible />

        {/* FAQ Section */}
        <FAQSection />

        {/* Security & Trust */}
        <SecurityTrustSection />

        {/* Ready to Save */}
        <ReadyToSaveSection />

        {/* Footer */}
        <FooterComprehensive />
      </div>
    </SavingsProvider>
  )
}
