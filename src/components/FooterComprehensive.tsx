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
                <Link href="/start" className="hover:text-primary-400 transition-colors">
                  Get a Quote
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
                <a href="#" className="hover:text-primary-400 transition-colors">
                  State Licenses
                </a>
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
                <a href="mailto:contact@betterclose.com" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@betterclose.com
                </a>
              </li>
              <li className="text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>First National Title & Escrow<br />Austin, TX</span>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Licensing & Compliance Bar */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-sm text-gray-400 mb-4">
            <strong className="text-white">State Licenses:</strong> Licensed and regulated in all 50 states.
            TX Lic #[number] • CA Lic #[number] • FL Lic #[number] • NY Lic #[number]
          </div>

          {/* Underwriter Logos */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-3">
              <strong className="text-white">Underwritten by:</strong>
            </p>
            <div className="flex flex-wrap items-center gap-6 opacity-50">
              <span className="text-xs">First American</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">Fidelity National</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">Stewart Title</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs">Chicago Title</span>
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
