'use client'

import { useState } from 'react'
import TrueFeelogo from './TrueFeelogo'

export default function NavigationCredible() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6">
        <nav className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <a href="/?variant=credible" className="hover:opacity-80 transition-opacity">
              <TrueFeelogo className="h-10" />
            </a>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="/?variant=credible#how-it-works" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              How It Works
            </a>
            <a href="/for-brokers" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              For Brokers
            </a>
            <a href="/for-realtors" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              For Realtors
            </a>
            <a href="/for-lenders" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              For Lenders
            </a>
            <a href="/about" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a href="/security" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              Security
            </a>
          </div>

          {/* Right: Contact & CTA */}
          <div className="flex items-center space-x-6">
            {/* Phone - Desktop Only */}
            <a href="tel:1-800-316-9508" className="hidden xl:flex items-center gap-3 text-dark-800 hover:text-primary-600 font-medium transition-colors group">
              <div className="relative">
                <img
                  src="/operator-face.png"
                  alt="Customer service"
                  className="w-16 h-16 rounded-full object-cover border-3 border-primary-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium">Talk to a real person</div>
                <div className="font-bold text-lg text-primary-600 group-hover:text-primary-700">1.800.316.9508</div>
              </div>
            </a>

            {/* Get Quote Button */}
            <a href="/start" className="bg-primary-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg">
              Get Quote
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-dark-800 hover:text-primary-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 pb-6">
            <div className="space-y-3">
              <a href="/?variant=credible#how-it-works" className="block text-dark-800 hover:text-primary-600 font-medium transition-colors py-2">
                How It Works
              </a>
              <a href="/for-brokers" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                For Mortgage Brokers
              </a>
              <a href="/for-realtors" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                For Real Estate Agents
              </a>
              <a href="/for-lenders" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                For Lenders
              </a>
              <a href="/about" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                About Us
              </a>
              <a href="/security" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                Security & Protection
              </a>
              <a href="tel:1-800-316-9508" className="block text-primary-600 font-bold py-2">
                📞 Call 1-800-316-9508
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
