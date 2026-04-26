export default function CompanyCredentialsSection() {
  const credentials = [
    {
      icon: (
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: "Licensed in 50 States",
      description: "Fully licensed and compliant"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "12,000+ Closings",
      description: "Trusted by thousands of homeowners"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: "A+ Rated Underwriters",
      description: "Backed by industry leaders"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      label: "Bank-Level Security",
      description: "Your data is protected"
    }
  ]

  const trustBadges = [
    {
      name: "BBB Accredited",
      logo: "🅱️" // Replace with actual BBB logo
    },
    {
      name: "ALTA Member",
      logo: "🏛️" // Replace with actual ALTA logo
    },
    {
      name: "SSL Secured",
      logo: "🔒"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {credentials.map((cred, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-2xl mb-4">
                {cred.icon}
              </div>
              <h3 className="text-2xl font-black text-dark-900 mb-2">{cred.label}</h3>
              <p className="text-gray-600">{cred.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500 mb-4 font-semibold">ACCREDITED & CERTIFIED BY</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-3xl">{badge.logo}</span>
                <span className="text-sm font-medium text-gray-700">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Licensed and regulated in all 50 states. Member of American Land Title Association (ALTA).
          </p>
        </div>
      </div>
    </section>
  )
}
