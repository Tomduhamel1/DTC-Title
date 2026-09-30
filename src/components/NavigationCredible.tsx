'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TrueFeelogo from './TrueFeelogo'
import NavOperatorPortrait from './NavOperatorPortrait'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'

const MARKETING_LINKS = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/for-brokers', label: 'Mortgage Brokers' },
  { href: '/for-realtors', label: 'Real Estate Agents' },
  { href: '/for-lenders', label: 'Lenders' },
  { href: '/security', label: 'Security' },
] as const

export default function NavigationCredible() {
  const pathname = usePathname()
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
    <header data-bc-marketing-nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50" onKeyDown={(event) => {
      if (event.key === 'Escape') { setMobileMenuOpen(false); setAccountMenuOpen(false) }
    }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <nav aria-label="Main navigation" className="flex justify-between items-center gap-4 h-20 text-sm">
          {/* Left: Logo */}
          <div data-nav-logo className="flex shrink-0 items-center">
            <Link href="/" aria-label="BetterClose home" className="hover:opacity-80 transition-opacity">
              <TrueFeelogo className="h-9 sm:h-10 w-[162px] sm:w-[180px]" />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div data-nav-links className="hidden xl:flex shrink-0 items-center gap-8 whitespace-nowrap">
            {MARKETING_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`inline-flex h-10 items-center font-medium decoration-2 underline-offset-8 transition-colors hover:text-primary-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${pathname === link.href ? 'text-primary-700 underline' : 'text-dark-800'}`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right */}
          <div data-nav-actions className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            {/* Reserve the same space while loading, signed in, or signed out. */}
            <div data-nav-login className="hidden sm:flex w-11 h-5 shrink-0 items-center">
              {status === 'unauthenticated' && <Link href="/login" className="text-dark-800 hover:text-primary-600 font-semibold transition-colors">Log in</Link>}
            </div>

            {/* Phone — desktop only */}
            <a data-nav-phone href={`tel:${SUPPORT_PHONE_TEL}`} className="hidden xl:flex w-[196px] shrink-0 items-center gap-2 text-dark-800 hover:text-primary-600 font-medium transition-colors group">
              <div className="relative shrink-0">
                <NavOperatorPortrait />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium">Talk to a real person</div>
                <div className="font-bold text-base text-primary-600 group-hover:text-primary-700">{SUPPORT_PHONE_DISPLAY}</div>
              </div>
            </a>

            {/* Logged in: My dashboard menu. Logged out: Send to my team CTA. */}
            <div data-nav-account className="hidden sm:block w-40 shrink-0">
            {status === 'loading' ? (
              <button disabled aria-label="Loading account" className="h-11 w-full rounded-md bg-emerald-600 text-white font-semibold">Account</button>
            ) : signedIn ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  aria-expanded={accountMenuOpen}
                  aria-controls="marketing-account-menu"
                  className="bg-emerald-600 text-white h-11 w-full px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  My dashboard
                  <svg className={`w-4 h-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountMenuOpen && (
                  <div id="marketing-account-menu" className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 z-50">
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
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm font-medium text-dark-900 hover:bg-gray-50"
                    >
                      Closing dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm font-medium text-dark-900 hover:bg-gray-50"
                    >
                      My settings
                    </Link>
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
                className="bg-emerald-600 text-white h-11 w-full px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                Send to my team
              </button>
            )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
              aria-controls="marketing-mobile-menu"
              className="xl:hidden flex h-11 w-11 shrink-0 items-center justify-center text-dark-800 hover:text-primary-600 transition-colors"
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
          <div id="marketing-mobile-menu" className="xl:hidden border-t border-gray-200 py-4 pb-6 max-h-[calc(100dvh-5rem)] overflow-y-auto">
            <div className="space-y-3">
              {MARKETING_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium decoration-2 underline-offset-8 transition-colors hover:text-primary-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 ${pathname === link.href ? 'text-primary-700 underline' : 'text-dark-800'}`}
                >
                  {link.label}
                </Link>
              ))}
              {signedIn ? (
                <>
                  <Link href="/dashboard" className="block text-dark-800 hover:text-primary-600 font-bold py-2">
                    My dashboard
                  </Link>
                  <Link href="/settings" className="block text-dark-800 hover:text-primary-600 font-bold py-2">My settings</Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block text-red-600 font-bold py-2"
                  >
                    Log out
                  </button>
                </>
              ) : status === 'unauthenticated' ? (
                <>
                <Link href="/login" className="block text-dark-800 hover:text-primary-600 font-bold py-2">
                  Log in
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); setShareOpen(true) }} className="block text-primary-700 font-bold py-2">Send to my team</button>
                </>
              ) : null}
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="block text-primary-600 font-bold py-2">
                📞 Call {SUPPORT_PHONE_DISPLAY}
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
