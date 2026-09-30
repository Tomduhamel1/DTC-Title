'use client'

import { SavingsProvider } from '@/contexts/SavingsContext'
import NavigationCredible from './NavigationCredible'
import HeroOptionA from './HeroOptionA'
import HeroOptionB from './HeroOptionB'
import HeroOptionC from './HeroOptionC'
import HeroMagicReveal from './HeroMagicReveal'
import CompanyCredentialsSection from './CompanyCredentialsSection'
import HowItWorksSection from './HowItWorksSection'
import FeeReportPreviewSection from './FeeReportPreviewSection'
import TeamTrustSection from './TeamTrustSection'
import DashboardTrustSection from './DashboardTrustSection'
import UnderwriterLogos from './UnderwriterLogos'
import TrustStripSection from './TrustStripSection'
import FAQSection from './FAQSection'
import SecurityTrustSection from './SecurityTrustSection'
import ReadyToSaveSection from './ReadyToSaveSection'
import FooterComprehensive from './FooterComprehensive'

interface HomePageCredibleProps {
  heroVersion?: 'A' | 'B' | 'C' | 'magic'
}

export default function HomePageCredible({ heroVersion = 'A' }: HomePageCredibleProps) {
  return (
    <SavingsProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <NavigationCredible />

        {/* Spacer for fixed header */}
        <div className="h-20"></div>

        {/* Hero Section - Toggle between hero variants */}
        {heroVersion === 'magic' ? (
          <HeroMagicReveal />
        ) : heroVersion === 'C' ? (
          <HeroOptionC />
        ) : heroVersion === 'B' ? (
          <HeroOptionB />
        ) : (
          <HeroOptionA />
        )}

        {/* Keep the Team You Trust — immediately after the hero */}
        <TeamTrustSection />

        {/* Fee Estimate Preview */}
        <FeeReportPreviewSection />

        {/* Dashboard + dedicated escrow officer trust section
            (replaces the old PeaceOfMindSection on the magic-reveal homepage) */}
        <DashboardTrustSection />

        {/* Company Credentials */}
        <CompanyCredentialsSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Underwriter Logos */}
        <UnderwriterLogos />

        {/* Why BetterClose — directly below Backed By */}
        <TrustStripSection />

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
