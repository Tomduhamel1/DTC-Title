'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import FileUpload from '@/components/FileUpload'

type Step = 'contact' | 'address' | 'property' | 'financial' | 'documents'

export default function StartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<Step>('contact')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [resumeToken, setResumeToken] = useState<string | null>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [saveMessage, setSaveMessage] = useState('')

  const [formData, setFormData] = useState({
    // Contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Address
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Property details
    propertyType: '',
    homeValue: '',

    // Financial info
    mortgageBalance: '',
    currentRate: '',
    creditScore: '',
  })

  const steps: Step[] = ['contact', 'address', 'property', 'financial', 'documents']
  const stepIndex = steps.indexOf(currentStep)

  // Load saved data from URL if resuming
  useEffect(() => {
    const savedData = searchParams.get('data')
    if (savedData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedData))
        setFormData(parsed.formData || {})
        setLeadId(parsed.leadId || null)
        setResumeToken(parsed.resumeToken || null)
        setCompletionPercentage(parsed.completionPercentage || 0)
      } catch (e) {
        console.error('Failed to parse saved data:', e)
      }
    }
  }, [searchParams])

  // Auto-save on form change (debounced)
  const autoSave = useCallback(
    async (data: typeof formData) => {
      if (!data.email) return // Need email to save

      try {
        const response = await fetch('/api/intake/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            data,
            resumeToken,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setLeadId(result.leadId)
          setResumeToken(result.resumeToken)
          setCompletionPercentage(result.completionPercentage)
          setSaveMessage('Progress saved')
          setTimeout(() => setSaveMessage(''), 2000)
        }
      } catch (e) {
        console.error('Auto-save failed:', e)
      }
    },
    [resumeToken]
  )

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave(formData)
    }, 1000) // Save after 1 second of inactivity

    return () => clearTimeout(timer)
  }, [formData, autoSave])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'contact':
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      case 'address':
        return !!(formData.address && formData.city && formData.state && formData.zipCode)
      case 'property':
        return !!(formData.propertyType && formData.homeValue)
      case 'financial':
        return !!(formData.mortgageBalance && formData.currentRate && formData.creditScore)
      case 'documents':
        return true // Documents are optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!validateStep()) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    const nextIndex = stepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep()) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          homeValue: parseFloat(formData.homeValue),
          mortgageBalance: parseFloat(formData.mortgageBalance),
          currentRate: parseFloat(formData.currentRate),
          source: 'progressive_intake',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      // Success - redirect to pricing
      router.push('/pricing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Let's start with your contact information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="label">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                We'll send you a magic link to resume this application anytime
              </p>
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>
        )

      case 'address':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Where is your property located?</h2>
            <div>
              <label htmlFor="address" className="label">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="city" className="label">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="label">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="CA"
                  maxLength={2}
                  required
                />
              </div>
            </div>
            <div className="max-w-xs">
              <label htmlFor="zipCode" className="label">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        )

      case 'property':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tell us about your property</h2>
            <div>
              <label htmlFor="propertyType" className="label">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select property type</option>
                <option value="single_family">Single Family Home</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="multi_family">Multi-Family (2-4 units)</option>
              </select>
            </div>
            <div>
              <label htmlFor="homeValue" className="label">Estimated Home Value *</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="homeValue"
                  name="homeValue"
                  value={formData.homeValue}
                  onChange={handleChange}
                  className="input-field pl-8"
                  placeholder="500,000"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 'financial':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial details</h2>
            <div>
              <label htmlFor="mortgageBalance" className="label">Current Mortgage Balance *</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="mortgageBalance"
                  name="mortgageBalance"
                  value={formData.mortgageBalance}
                  onChange={handleChange}
                  className="input-field pl-8"
                  placeholder="400,000"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="currentRate" className="label">Current Interest Rate *</label>
              <div className="relative">
                <input
                  type="number"
                  id="currentRate"
                  name="currentRate"
                  value={formData.currentRate}
                  onChange={handleChange}
                  className="input-field pr-8"
                  placeholder="4.5"
                  step="0.125"
                  required
                />
                <span className="absolute right-4 top-2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label htmlFor="creditScore" className="label">Credit Score Range *</label>
              <select
                id="creditScore"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select your credit score range</option>
                <option value="excellent">Excellent (760+)</option>
                <option value="good">Good (700-759)</option>
                <option value="fair">Fair (650-699)</option>
                <option value="poor">Poor (&lt;650)</option>
              </select>
            </div>
          </div>
        )

      case 'documents':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload supporting documents (Optional)</h2>
            <p className="text-gray-600">
              Upload documents to speed up your application. You can always add these later.
            </p>

            {leadId ? (
              <div className="space-y-4">
                <FileUpload
                  leadId={leadId}
                  documentType="pay_stub"
                  label="Recent Pay Stub"
                  onSuccess={() => console.log('Pay stub uploaded')}
                  onError={(err) => console.error('Upload error:', err)}
                />

                <FileUpload
                  leadId={leadId}
                  documentType="bank_statement"
                  label="Bank Statement"
                  onSuccess={() => console.log('Bank statement uploaded')}
                  onError={(err) => console.error('Upload error:', err)}
                />

                <FileUpload
                  leadId={leadId}
                  documentType="tax_return"
                  label="Tax Return (Most Recent)"
                  onSuccess={() => console.log('Tax return uploaded')}
                  onError={(err) => console.error('Upload error:', err)}
                />

                <FileUpload
                  leadId={leadId}
                  documentType="id_document"
                  label="Photo ID"
                  onSuccess={() => console.log('ID uploaded')}
                  onError={(err) => console.error('Upload error:', err)}
                />
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Please complete the previous steps first to enable document uploads.
                </p>
              </div>
            )}
          </div>
        )
    }
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
              {saveMessage && (
                <span className="text-sm text-green-600">✓ {saveMessage}</span>
              )}
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

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progress: {completionPercentage}%
              </span>
              <span className="text-sm text-gray-600">
                Step {stepIndex + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between max-w-2xl mx-auto mt-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index <= stepIndex
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < stepIndex ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                )}
                {stepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Complete Application'}
                  </button>
                )}
              </div>
            </form>

            {resumeToken && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Save this link to resume later:</strong>
                </p>
                <p className="text-xs text-blue-600 break-all mt-1">
                  {typeof window !== 'undefined' && `${window.location.origin}/resume/${resumeToken}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
