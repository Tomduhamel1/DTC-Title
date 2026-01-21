import Link from 'next/link'
import Image from 'next/image'
import InlineCalculator from '@/components/InlineCalculator'
import TrustBadges from '@/components/TrustBadges'
import SavingsExamples from '@/components/SavingsExamples'
import Testimonials from '@/components/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - eLEND Style */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            {/* Left: Logo/Branding */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-dark-800 hover:text-primary-600 transition-colors">
                TrueFee Closing
              </Link>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-sm text-gray-500 font-medium">powered by eLEND</span>
            </div>

            {/* Center: Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                Calculate Savings
              </Link>
              <Link href="/start" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                Get Started
              </Link>
              <Link href="#how-it-works" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                How It Works
              </Link>
            </div>

            {/* Right: Contact & CTA */}
            <div className="flex items-center space-x-6">
              <a href="tel:1-800-316-9508" className="hidden lg:flex items-center text-dark-800 hover:text-primary-600 font-medium transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1.800.316.9508
              </a>
              <Link href="/start" className="bg-primary-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-700 transition-colors">
                Get Quote
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[700px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/75 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
            alt="Modern home exterior"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left: Story and Messaging */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Save Thousands on Closing Costs
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-50 leading-relaxed">
                Get transparent, discounted title insurance and settlement services. Same underwriters, better rates.
              </p>

              {/* Trust Strip */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-semibold text-lg">30-40% Lower Fees</div>
                    <div className="text-primary-100">Same coverage, same underwriters</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-semibold text-lg">48-Hour Quote Response</div>
                    <div className="text-primary-100">Fast, transparent pricing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-semibold text-lg">Licensed Nationwide</div>
                    <div className="text-primary-100">Compliant in all 50 states</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-semibold text-lg">Secure Escrow & Wire Fraud Prevention</div>
                    <div className="text-primary-100">FDIC-insured accounts with advanced security</div>
                  </div>
                </div>
              </div>

              <Link
                href="/start"
                className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl"
              >
                Let's Start Now
              </Link>
            </div>

            {/* Right: Inline Calculator Card */}
            <div className="lg:pl-8">
              <InlineCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Savings Examples */}
      <SavingsExamples />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">TrueFee Closing</div>
              <p className="text-gray-400">
                Transparent, discounted title insurance and settlement services for your home purchase or refinance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Calculate Savings
                  </Link>
                </li>
                <li>
                  <Link href="/start" className="hover:text-white transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Questions? We're here to help.<br />
                Reach out for a quote or support.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrueFee Closing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
