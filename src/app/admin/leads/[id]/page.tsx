import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      quotes: {
        orderBy: { createdAt: 'desc' },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
      },
      mortgageScenarios: {
        orderBy: { createdAt: 'desc' },
      },
      mortgageReferrals: {
        include: {
          partner: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!lead) {
    notFound()
  }

  return lead
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  const lead = await getLead(id)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-emerald-100 text-emerald-800'
      case 'closed':
        return 'bg-purple-100 text-purple-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
            <Link href="/admin" className="text-primary-600 hover:text-primary-700">
              Back to Leads
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <p className="text-gray-600">{lead.email}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                  <p className="text-gray-900">{lead.phone || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                  <p className="text-gray-900">
                    {lead.address}
                    <br />
                    {lead.city}, {lead.state} {lead.zipCode}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property Type</h3>
                  <p className="text-gray-900 capitalize">
                    {lead.propertyType?.replace('_', ' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Source</h3>
                  <p className="text-gray-900 capitalize">{lead.source || 'N/A'}</p>
                </div>
              </div>

              {lead.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900">{lead.notes}</p>
                </div>
              )}
            </div>

            {/* Financial Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Home Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(lead.homeValue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Mortgage Balance</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(lead.mortgageBalance)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Current Rate</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {lead.currentRate ? `${lead.currentRate}%` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Credit Score</div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {lead.creditScore || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes */}
            {lead.quotes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quotes ({lead.quotes.length})
                </h3>
                <div className="space-y-4">
                  {lead.quotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(quote.createdAt)}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Monthly Savings</div>
                          <div className="text-xl font-bold text-primary-600">
                            {formatCurrency(quote.monthlySavings)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Current Payment</div>
                          <div className="font-semibold">
                            {formatCurrency(quote.currentMonthlyPayment)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">New Payment</div>
                          <div className="font-semibold">
                            {formatCurrency(quote.newMonthlyPayment)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Lifetime Savings</div>
                          <div className="font-semibold">
                            {formatCurrency(quote.lifetimeSavings)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Mortgage Information */}
            {(lead.mortgageScenarios.length > 0 || lead.mortgageReferrals.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Purchase Mortgage Activity
                </h3>

                {/* Mortgage Scenarios */}
                {lead.mortgageScenarios.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Lender Scenarios ({lead.mortgageScenarios.length})
                    </h4>
                    <div className="space-y-4">
                      {lead.mortgageScenarios.map((scenario) => (
                        <div key={scenario.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {scenario.lenderName || 'Unnamed Lender'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Added {formatDate(scenario.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Monthly Payment</div>
                              <div className="text-lg font-bold text-blue-700">
                                {formatCurrency(scenario.totalMonthly)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Loan Amount</div>
                              <div className="font-semibold">
                                {formatCurrency(scenario.loanAmount)}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Interest Rate</div>
                              <div className="font-semibold">{scenario.interestRate}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Term</div>
                              <div className="font-semibold">{scenario.term / 12} years</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Upfront Costs</div>
                              <div className="font-semibold">
                                {formatCurrency(scenario.totalUpfront)}
                              </div>
                            </div>
                          </div>

                          {(scenario.points || scenario.lenderFees) && (
                            <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-4 text-sm">
                              {scenario.points && (
                                <div>
                                  <div className="text-gray-600">Points</div>
                                  <div className="font-semibold">{scenario.points}%</div>
                                </div>
                              )}
                              {scenario.lenderFees && (
                                <div>
                                  <div className="text-gray-600">Lender Fees</div>
                                  <div className="font-semibold">
                                    {formatCurrency(scenario.lenderFees)}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mortgage Referrals */}
                {lead.mortgageReferrals.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Partner Referrals ({lead.mortgageReferrals.length})
                    </h4>
                    <div className="space-y-4">
                      {lead.mortgageReferrals.map((referral) => (
                        <div key={referral.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {referral.partner?.name || 'Unassigned'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {referral.partner?.email}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Requested {formatDate(referral.createdAt)}
                              </div>
                            </div>
                            <div>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  referral.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : referral.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : referral.status === 'quoted'
                                    ? 'bg-purple-100 text-purple-800'
                                    : referral.status === 'closed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {referral.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Credit Band</div>
                              <div className="font-semibold capitalize">
                                {referral.creditBand}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Property Type</div>
                              <div className="font-semibold capitalize">
                                {referral.propertyType.replace('_', ' ')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Occupancy</div>
                              <div className="font-semibold capitalize">
                                {referral.occupancy}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Down Payment</div>
                              <div className="font-semibold">{referral.downPaymentPct}%</div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-emerald-200 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Term Preference</div>
                              <div className="font-semibold">
                                {referral.termPreference.replace('_', ' ')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Contact Via</div>
                              <div className="font-semibold capitalize">
                                {referral.contactPreference}
                              </div>
                            </div>
                          </div>

                          {referral.requestedLoanAmount && (
                            <div className="mt-3 pt-3 border-t border-emerald-200">
                              <div className="text-gray-600 text-sm">Requested Loan Amount</div>
                              <div className="font-bold text-lg text-emerald-700">
                                {formatCurrency(referral.requestedLoanAmount)}
                              </div>
                            </div>
                          )}

                          {referral.notes && (
                            <div className="mt-3 pt-3 border-t border-emerald-200">
                              <div className="text-gray-600 text-sm">Notes</div>
                              <div className="text-gray-800 text-sm mt-1">{referral.notes}</div>
                            </div>
                          )}

                          {referral.partnerContactedAt && (
                            <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-gray-500">
                              Partner contacted on {formatDate(referral.partnerContactedAt)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {lead.activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No activity yet</p>
                ) : (
                  lead.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Created</h3>
              <p className="text-gray-900">{formatDate(lead.createdAt)}</p>
              <h3 className="text-sm font-medium text-gray-500 mb-2 mt-4">Last Updated</h3>
              <p className="text-gray-900">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
