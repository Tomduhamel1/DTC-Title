'use client'

import { useState } from 'react'

interface PortalWaitlistProps {
  title: string
  description: string
  portalType: 'broker' | 'realtor' | 'lender'
}

export default function PortalWaitlist({ title, description, portalType }: PortalWaitlistProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to actual API
    console.log(`Waitlist signup for ${portalType}:`, email)
    setSubmitted(true)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="inline-block bg-primary-500 px-4 py-1 rounded-full text-sm font-bold mb-4">
          🚀 COMING SOON
        </div>

        <h2 className="text-3xl md:text-4xl font-black mb-4">
          {title}
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          {description}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-lg text-dark-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              Be the first to know when the portal launches
            </p>
          </form>
        ) : (
          <div className="bg-emerald-500 text-white px-8 py-6 rounded-xl max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
            <p>We'll notify you when the {portalType} portal is ready.</p>
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
          <div>
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-bold text-lg mb-2">Real-Time Dashboard</h3>
            <p className="text-primary-100 text-sm">Track all your transactions in one place</p>
          </div>
          <div>
            <div className="text-4xl mb-2">📄</div>
            <h3 className="font-bold text-lg mb-2">Document Sharing</h3>
            <p className="text-primary-100 text-sm">Secure upload and download of all files</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🔔</div>
            <h3 className="font-bold text-lg mb-2">Instant Notifications</h3>
            <p className="text-primary-100 text-sm">Email and SMS alerts for status updates</p>
          </div>
        </div>
      </div>
    </section>
  )
}
