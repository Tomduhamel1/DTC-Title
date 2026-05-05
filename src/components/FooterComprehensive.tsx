import Link from 'next/link'

export default function FooterComprehensive() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About BetterClose
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-primary-400 transition-colors">
                  Security & Fraud Protection
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-primary-400 transition-colors">
                  Fee estimate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Professionals */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">For Professionals</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/for-brokers" className="hover:text-primary-400 transition-colors">
                  For Mortgage Brokers
                </Link>
              </li>
              <li>
                <Link href="/for-realtors" className="hover:text-primary-400 transition-colors">
                  For Real Estate Agents
                </Link>
              </li>
              <li>
                <Link href="/for-lenders" className="hover:text-primary-400 transition-colors">
                  For Lenders
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  Professional Portal Login →
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Compliance */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Legal & Compliance</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-primary-400 transition-colors">
                  State Licenses
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <span className="text-sm">Equal Housing Lender</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:1-800-316-9508" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  1-800-316-9508
                </a>
              </li>
              <li>
                <a href="mailto:contact@betterclose.co" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@betterclose.co
                </a>
              </li>
              <li className="text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    BetterClose<br />
                    1300 Division Road, Unit 306<br />
                    West Warwick, RI 02893<br />
                    (401) 847-3080
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Licensing & Compliance Bar */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-sm text-gray-400 mb-4">
            <strong className="text-white">State Licenses:</strong> Directly licensed in 34 states.
            Closings in the remaining 16 states are completed via licensed
            workshare partners.*{' '}
            <Link href="/licenses" className="text-primary-400 hover:text-primary-300 underline">
              See all state licenses →
            </Link>
            <div className="text-xs text-gray-500 mt-2">
              *Same BetterClose pricing and digital experience either way.
            </div>
          </div>

          {/* Underwriter Logos */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-3">
              <strong className="text-white">Underwritten by:</strong>
            </p>
            <div className="flex flex-wrap items-center gap-6 opacity-50">
              <span className="text-xs">First American</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">AmTrust Title</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">Westcor Land Title</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">CATIC</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 BetterClose, a division of First National Title & Escrow. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Member of ALTA</span>
            <span>•</span>
            <span>BBB Accredited</span>
            <span>•</span>
            <span>SOC 2 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
