import { buildSampleFeeReport, PURCHASE_SAMPLE_LOCATION } from '@/lib/sampleReport'
import { computeTotals, formatCurrency } from '@/lib/feeReport'

// Never combine a client's savings headline with unrelated sample fee rows.
export default function MarketingFeeSample() {
  const report = buildSampleFeeReport()
  const totals = computeTotals(report)
  return (
    <div data-marketing-fee-sample className="bg-white text-dark-900 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 text-[11px] text-gray-600">
        Purchase example · {PURCHASE_SAMPLE_LOCATION}
      </div>
      <div className="p-5">
        <h3 className="text-sm font-bold text-dark-900 mb-2">Transparent pricing, line by line</h3>
        <p className="text-xs text-gray-500 mb-4">
          {formatCurrency(report.homeValue)} purchase with a {formatCurrency(report.loanAmount!)} loan.
          {' '}Calculated with our quote engine. Not your client&apos;s quote.
        </p>
        <dl className="space-y-3">
          {report.lineItems.map(item => (
            <div key={item.id} data-sample-fee={item.id} className="flex items-start justify-between gap-3 text-xs">
              <dt className="text-gray-700">{item.label}</dt>
              <dd className="font-semibold text-dark-900 tabular-nums whitespace-nowrap">{formatCurrency(item.ourCost)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-3 text-sm font-bold">
            <dt>Sample total</dt><dd data-sample-total>{formatCurrency(totals.ourTotal)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-xs">
            <dt>Comparison range</dt><dd className="whitespace-nowrap">{formatCurrency(totals.marketLow)}–{formatCurrency(totals.marketHigh)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-xs text-emerald-700 font-semibold">
            <dt>Sample savings</dt><dd data-sample-savings>{formatCurrency(totals.estimatedSavings)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] text-gray-500">
          Savings use the low end of the service comparison plus any BetterClose
          Bucks credit shown above. Premiums and government fees are not discounted.
          Your property&apos;s estimate may differ.
        </p>
      </div>
    </div>
  )
}
