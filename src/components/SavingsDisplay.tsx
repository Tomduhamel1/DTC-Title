'use client'

import { SavingsBreakdown } from '@/lib/savingsCalculator'

interface SavingsDisplayProps {
  savings: SavingsBreakdown
  isUpdating?: boolean
}

export default function SavingsDisplay({ savings, isUpdating = false }: SavingsDisplayProps) {
  const monthlySavings = savings.averageMonthlyImpact - savings.estimatedMonthlyImpact

  return (
    <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-200 transition-all duration-300 ${
      isUpdating ? 'scale-105 shadow-xl' : ''
    }`}>
      {/* Main Savings Number */}
      <div className="text-center mb-4">
        <div className="text-sm font-semibold text-green-700 mb-1">ESTIMATED SAVINGS</div>
        <div className={`text-6xl font-black text-green-600 mb-2 transition-all duration-500 ${
          isUpdating ? 'scale-110' : ''
        }`}>
          ${savings.totalSavings.toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">on your closing costs</div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-200 my-4"></div>

      {/* Detailed Comparison */}
      <div className="space-y-3">
        {/* Closing Costs Comparison */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2">ESTIMATED CLOSING COSTS</div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">You:</span>
              <span className="text-2xl font-bold text-dark-900">
                ${savings.estimatedClosingCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">vs Avg:</span>
              <span className="text-lg font-semibold text-gray-400 line-through">
                ${savings.averageClosingCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Payment Impact */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2">MONTHLY PAYMENT IMPACT (if financed)</div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">You:</span>
              <span className="text-2xl font-bold text-dark-900">
                ${savings.estimatedMonthlyImpact.toLocaleString()}/mo
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">vs Avg:</span>
              <span className="text-lg font-semibold text-gray-400 line-through">
                ${savings.averageMonthlyImpact.toLocaleString()}/mo
              </span>
            </div>
          </div>
          <div className="text-xs text-green-700 font-semibold mt-1">
            Save ${monthlySavings.toLocaleString()}/month over 30 years
          </div>
        </div>
      </div>

      {/* Update Animation Indicator */}
      {isUpdating && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating your savings...
          </div>
        </div>
      )}
    </div>
  )
}
