export default function SavingsExamples() {
  const examples = [
    {
      location: 'San Francisco, CA',
      transactionType: 'Purchase',
      homeValue: 850000,
      savings: 1420,
    },
    {
      location: 'Austin, TX',
      transactionType: 'Refinance',
      homeValue: 425000,
      savings: 890,
    },
    {
      location: 'Miami, FL',
      transactionType: 'Purchase',
      homeValue: 650000,
      savings: 1180,
    },
    {
      location: 'Denver, CO',
      transactionType: 'Purchase',
      homeValue: 575000,
      savings: 1050,
    },
    {
      location: 'Seattle, WA',
      transactionType: 'Refinance',
      homeValue: 725000,
      savings: 1280,
    },
    {
      location: 'Phoenix, AZ',
      transactionType: 'Purchase',
      homeValue: 480000,
      savings: 940,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Closing Cost Savings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Representative examples of typical savings on title insurance and settlement services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {examples.map((example, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold text-gray-900">{example.location}</div>
                  <div className="text-sm text-gray-600">{example.transactionType}</div>
                </div>
                <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                  New
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Home Value</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(example.homeValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Savings</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatCurrency(example.savings)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Compared to traditional closing costs for title insurance and settlement services.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            Examples shown are representative of typical transactions and savings percentages.
            Actual savings vary based on property value, location, and transaction specifics.
            All calculations use the same underwriter rates with BetterClose's discounted fees.
          </p>
        </div>
      </div>
    </div>
  )
}
