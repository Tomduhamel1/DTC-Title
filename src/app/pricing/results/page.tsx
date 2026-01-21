'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface QuoteData {
  quote: {
    transactionType?: string
    traditionalCosts: number
    trueFeeClosingCosts: number
    savings: number
    savingsPercentage: number
    lineItems?: Array<{
      name: string
      traditional: number
      trueFeeClosing: number
      savings: number
    }>
    breakdown?: any
  }
  leadId?: string
}

export default function PricingResultsPage() {
  const router = useRouter()
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [showMortgageModule, setShowMortgageModule] = useState(false)
  const [selectedPath, setSelectedPath] = useState<'lender' | 'referral' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const storedData = sessionStorage.getItem('quoteData')
    if (!storedData) {
      router.push('/pricing')
      return
    }

    try {
      setQuoteData(JSON.parse(storedData))
    } catch {
      router.push('/pricing')
    }
  }, [router])

  // Handle user-entered lender scenario
  const handleLenderScenario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quoteData?.leadId) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/mortgage/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: quoteData.leadId,
          lenderName: formData.get('lenderName') || undefined,
          loanAmount: parseFloat(formData.get('loanAmount') as string),
          interestRate: parseFloat(formData.get('interestRate') as string),
          term: parseInt(formData.get('term') as string),
          points: formData.get('points') ? parseFloat(formData.get('points') as string) : undefined,
          lenderFees: formData.get('lenderFees') ? parseFloat(formData.get('lenderFees') as string) : undefined,
          propertyTaxes: formData.get('propertyTaxes') ? parseFloat(formData.get('propertyTaxes') as string) : undefined,
          homeInsurance: formData.get('homeInsurance') ? parseFloat(formData.get('homeInsurance') as string) : undefined,
          hoaFees: formData.get('hoaFees') ? parseFloat(formData.get('hoaFees') as string) : undefined,
          pmi: formData.get('pmi') ? parseFloat(formData.get('pmi') as string) : undefined,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
      } else {
        alert('Failed to save mortgage scenario')
      }
    } catch (error) {
      console.error('Error submitting lender scenario:', error)
      alert('Failed to save mortgage scenario')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle referral request
  const handleReferralRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quoteData?.leadId) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/mortgage/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: quoteData.leadId,
          creditBand: formData.get('creditBand'),
          occupancy: formData.get('occupancy'),
          propertyType: formData.get('propertyType'),
          downPaymentPct: parseFloat(formData.get('downPaymentPct') as string),
          termPreference: formData.get('termPreference'),
          contactPreference: formData.get('contactPreference'),
          requestedLoanAmount: formData.get('requestedLoanAmount') ? parseFloat(formData.get('requestedLoanAmount') as string) : undefined,
          notes: formData.get('notes') || undefined,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
      } else {
        alert('Failed to submit referral request')
      }
    } catch (error) {
      console.error('Error submitting referral:', error)
      alert('Failed to submit referral request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const { quote } = quoteData
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleCallSpecialist = () => {
    // In production, this would open a calendar widget or dial number
    alert('Feature coming soon: Book a call with our closing specialists')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - eLEND Style */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-dark-800 hover:text-primary-600 transition-colors">
                TrueFee Closing
              </Link>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-sm text-gray-500 font-medium">powered by eLEND</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:1-800-316-9508" className="hidden lg:flex items-center text-dark-800 hover:text-primary-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1.800.316.9508
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* 2-Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Savings Info (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Savings Card */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                  You Could Save
                </h1>
                <div className="text-5xl md:text-7xl font-bold mb-3">
                  {formatCurrency(quote.savings)}
                </div>
                <p className="text-xl md:text-2xl text-primary-100 mb-8">on closing costs</p>

                {/* Trust Strip */}
                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-primary-500">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">Same Policy</div>
                      <div className="text-xs text-primary-100">Backed by top underwriters</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">Secure Funds</div>
                      <div className="text-xs text-primary-100">Your money is protected</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">24/7 Support</div>
                      <div className="text-xs text-primary-100">We're here to help</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Cost Comparison
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-red-400 pl-4">
                    <div className="text-sm text-gray-600 mb-1">Traditional Closing Costs</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(quote.traditionalCosts)}
                    </div>
                  </div>

                  <div className="border-l-4 border-primary-400 pl-4">
                    <div className="text-sm text-gray-600 mb-1">TrueFee Closing Costs</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(quote.trueFeeClosingCosts)}
                    </div>
                  </div>

                  <div className="border-l-4 border-primary-400 pl-4 md:col-span-2">
                    <div className="text-sm text-gray-600 mb-1">Your Total Savings</div>
                    <div className="text-3xl font-bold text-primary-600">
                      {formatCurrency(quote.savings)}
                      <span className="text-lg ml-2 text-gray-600">
                        ({quote.savingsPercentage}% savings)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {quote.lineItems && quote.lineItems.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      {quote.lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700">{item.name}</span>
                          <div className="flex gap-4 items-center">
                            <span className="text-gray-400 text-sm line-through">
                              {formatCurrency(item.traditional)}
                            </span>
                            <span className="font-semibold text-primary-600">
                              {formatCurrency(item.trueFeeClosing)}
                            </span>
                            {item.savings > 0 && (
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                Save -{formatCurrency(item.savings)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Same underwriters, lower fees.</strong> You get the same coverage and protection at a fraction of the cost.
                  </p>
                </div>
              </div>

              {/* Optional Purchase Mortgage Accordion */}
              {!submitSuccess && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setShowMortgageModule(!showMortgageModule)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Want to compare your monthly payment too?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Optional: Get help with purchase mortgage options
                      </p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        showMortgageModule ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMortgageModule && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      {!selectedPath ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedPath('lender')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                      >
                        <h4 className="font-bold text-gray-900 mb-2">
                          I Already Have a Lender
                        </h4>
                        <p className="text-sm text-gray-600">
                          Enter your lender's terms to see estimated payments and upfront costs
                        </p>
                      </button>

                      <button
                        onClick={() => setSelectedPath('referral')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                      >
                        <h4 className="font-bold text-gray-900 mb-2">
                          Request Loan Suggestions
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get matched with a lending partner for personalized options
                        </p>
                      </button>
                    </div>
                  ) : selectedPath === 'lender' ? (
                    <div>
                      <button
                        onClick={() => setSelectedPath(null)}
                        className="text-sm text-gray-600 hover:text-gray-800 mb-4"
                      >
                        ← Back to options
                      </button>

                      <form onSubmit={handleLenderScenario} className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">
                            Enter Your Lender's Terms
                          </h4>
                          <p className="text-sm text-gray-600 mb-6">
                            We'll calculate your estimated payments and upfront costs
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lender Name (Optional)
                            </label>
                            <input
                              type="text"
                              name="lenderName"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., ABC Bank"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Loan Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="loanAmount"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="400000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Interest Rate (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="interestRate"
                              step="0.001"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="3.75"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Loan Term <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="term"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="360">30 Year</option>
                              <option value="180">15 Year</option>
                              <option value="240">20 Year</option>
                              <option value="120">10 Year</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points (%)
                            </label>
                            <input
                              type="number"
                              name="points"
                              step="0.01"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lender Fees ($)
                            </label>
                            <input
                              type="number"
                              name="lenderFees"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Optional: Monthly PITI Components
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Property Taxes (monthly)
                              </label>
                              <input
                                type="number"
                                name="propertyTaxes"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Home Insurance (monthly)
                              </label>
                              <input
                                type="number"
                                name="homeInsurance"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                HOA Fees (monthly)
                              </label>
                              <input
                                type="number"
                                name="hoaFees"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                PMI (monthly)
                              </label>
                              <input
                                type="number"
                                name="pmi"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-xs text-gray-700">
                            <strong>Disclaimer:</strong> This is not a loan offer. Calculations are estimates only.
                            Exact pricing requires a full application with the lender.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                        >
                          {isSubmitting ? 'Saving...' : 'Calculate Estimate'}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setSelectedPath(null)}
                        className="text-sm text-gray-600 hover:text-gray-800 mb-4"
                      >
                        ← Back to options
                      </button>

                      <form onSubmit={handleReferralRequest} className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">
                            Request Loan Suggestions
                          </h4>
                          <p className="text-sm text-gray-600 mb-6">
                            We'll connect you with a lending partner who can provide personalized options
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Credit Band <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="creditBand"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="excellent">Excellent (740+)</option>
                              <option value="good">Good (670-739)</option>
                              <option value="fair">Fair (580-669)</option>
                              <option value="poor">Poor (&lt;580)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Property Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="propertyType"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="single_family">Single Family</option>
                              <option value="condo">Condominium</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="multi_family">Multi-Family</option>
                              <option value="manufactured">Manufactured</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Occupancy <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="occupancy"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="primary">Primary Residence</option>
                              <option value="secondary">Secondary/Vacation Home</option>
                              <option value="investment">Investment Property</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Down Payment (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="downPaymentPct"
                              min="0"
                              max="100"
                              step="0.1"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Term Preference <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="termPreference"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="30_year">30 Year Fixed</option>
                              <option value="15_year">15 Year Fixed</option>
                              <option value="20_year">20 Year Fixed</option>
                              <option value="10_year">10 Year Fixed</option>
                              <option value="7_1_arm">7/1 ARM</option>
                              <option value="5_1_arm">5/1 ARM</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Preference <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="contactPreference"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select...</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                              <option value="both">Email & Phone</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estimated Loan Amount (Optional)
                            </label>
                            <input
                              type="number"
                              name="requestedLoanAmount"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="400000"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              name="notes"
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Any specific requirements or timeline..."
                            />
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-xs text-gray-700">
                            <strong>Disclaimer:</strong> This is not a loan offer. By submitting, you agree to be
                            contacted by one of our lending partners. Exact pricing requires a full application.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                        >
                          {isSubmitting ? 'Submitting...' : 'Request Loan Suggestions'}
                        </button>
                      </form>
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-900 mb-2">
                    ✓ Thank you! Your information has been saved.
                  </h3>
                  <p className="text-green-800 text-sm">
                    {selectedPath === 'referral'
                      ? 'A lending partner will reach out to you shortly with personalized loan options.'
                      : 'Your mortgage scenario has been saved. You can view it in your dashboard.'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Sticky CTA Card (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Main CTA Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary-600">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Ready to Lock In Your Savings?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Complete your application in just 5 minutes and start saving.
                  </p>

                  {/* Primary CTA */}
                  <Link
                    href="/start"
                    className="block w-full bg-primary-600 text-white text-center py-4 px-6 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg mb-4"
                  >
                    Let's Start Now →
                  </Link>

                  {/* Secondary CTA */}
                  <button
                    onClick={handleCallSpecialist}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Talk to a Specialist
                  </button>

                  {/* Trust Bullets */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">No Impact on Credit</div>
                        <div className="text-xs text-gray-600">Check your rate without affecting your score</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Fast Processing</div>
                        <div className="text-xs text-gray-600">Most applications reviewed within 24 hours</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Expert Guidance</div>
                        <div className="text-xs text-gray-600">Dedicated support throughout your journey</div>
                      </div>
                    </div>
                  </div>

                  {/* Recalculate Link */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 underline">
                      Recalculate with different numbers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
