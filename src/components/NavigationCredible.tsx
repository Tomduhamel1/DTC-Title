'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import TrueFeelogo from './TrueFeelogo'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'

export default function NavigationCredible() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const signedIn = status === 'authenticated'

  useEffect(() => {
    if (!accountMenuOpen) return
    const onClick = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [accountMenuOpen])

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
              For Mortgage Brokers
            </a>
            <a href="/for-realtors" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              For Real Estate Agents
            </a>
            <a href="/for-lenders" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              For Lenders
            </a>
            <a href="/security" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
              Security
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-5">
            {/* Logged out: Login link, then phone, then "Send to my team" */}
            {!signedIn && (
              <a
                href="/login"
                className="hidden sm:inline-block text-dark-800 hover:text-primary-600 font-semibold transition-colors"
              >
                Log in
              </a>
            )}

            {/* Phone — desktop only */}
            <a href="tel:1-800-316-9508" className="hidden xl:flex items-center gap-3 text-dark-800 hover:text-primary-600 font-medium transition-colors group">
              <div className="relative">
                <img
                  src="/operator-face.png"
                  alt="Customer service"
                  className="w-16 h-16 rounded-full object-cover border-3 border-primary-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
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

            {/* Logged in: My dashboard menu. Logged out: Send to my team CTA. */}
            {signedIn ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  My dashboard
                  <svg className={`w-4 h-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 z-50">
                    {session?.user?.email && (
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Signed in as
                        </div>
                        <div className="text-sm font-semibold text-dark-900 truncate">
                          {session.user.email}
                        </div>
                      </div>
                    )}
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm font-medium text-dark-900 hover:bg-gray-50"
                    >
                      Closing dashboard
                    </a>
                    <a
                      href="/dashboard#contacts"
                      className="block px-4 py-2 text-sm font-medium text-dark-900 hover:bg-gray-50"
                    >
                      My settings
                    </a>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShareOpen(true)}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                Send to my team
              </button>
            )}

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
              <a href="/security" className="block text-dark-800 hover:text-primary-600 font-medium py-2">
                Security & Protection
              </a>
              {signedIn ? (
                <>
                  <a href="/dashboard" className="block text-dark-800 hover:text-primary-600 font-bold py-2">
                    My dashboard
                  </a>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block text-red-600 font-bold py-2"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <a href="/login" className="block text-dark-800 hover:text-primary-600 font-bold py-2">
                  Log in
                </a>
              )}
              <a href="tel:1-800-316-9508" className="block text-primary-600 font-bold py-2">
                📞 Call 1-800-316-9508
              </a>
            </div>
          </div>
        )}
      </div>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="nav_cta"
      />
    </header>
  )
}
