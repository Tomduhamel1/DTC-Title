'use client'

import { getMockFeeReport } from '@/lib/feeReport'
import DesignSplit from '@/components/feeReportDesigns/DesignSplit'
import DesignReceipt from '@/components/feeReportDesigns/DesignReceipt'
import DesignCards from '@/components/feeReportDesigns/DesignCards'
import DesignInvoice from '@/components/feeReportDesigns/DesignInvoice'
import DesignDashboard from '@/components/feeReportDesigns/DesignDashboard'
import DesignList from '@/components/feeReportDesigns/DesignList'
import DesignBigNumber from '@/components/feeReportDesigns/DesignBigNumber'
import DesignTimeline from '@/components/feeReportDesigns/DesignTimeline'
import DesignLedger from '@/components/feeReportDesigns/DesignLedger'
import DesignStatement from '@/components/feeReportDesigns/DesignStatement'

const round2Designs = [
  {
    id: 'list',
    name: 'Option 6 · Sticky-summary list',
    blurb:
      'iOS-style minimal list. No bars, no decoration. Each fee = name + price + small typical-range hint. Sticky savings panel pinned to the bottom.',
    Component: DesignList,
  },
  {
    id: 'big-number',
    name: 'Option 7 · Big number + collapsibles',
    blurb:
      'Hero savings number first. Side-by-side you-vs-typical. Line items live behind tappable category accordions so the page loads small and expands on demand.',
    Component: DesignBigNumber,
  },
  {
    id: 'timeline',
    name: 'Option 8 · Vertical timeline',
    blurb:
      'Fees as nodes on a vertical spine. Variable items get bigger emerald nodes; fixed items are visually quieter so attention flows to where savings are.',
    Component: DesignTimeline,
  },
  {
    id: 'ledger',
    name: 'Option 9 · Ledger',
    blurb:
      'Three columns: item · you · typical. Comparison via tight tabular numbers, no graphics. Strong total row, full-width emerald savings strip at bottom.',
    Component: DesignLedger,
  },
  {
    id: 'statement',
    name: 'Option 10 · Premium statement',
    blurb:
      'Apple Card / private-banking feel. Hero total at the top in 64px black numerals. Savings revealed at the bottom via a clean financial summary. No decoration.',
    Component: DesignStatement,
  },
]

const round1Designs = [
  {
    id: 'split',
    name: 'Option 1 · You vs. Typical',
    blurb: 'From round 1.',
    Component: DesignSplit,
  },
  {
    id: 'dashboard',
    name: 'Option 2 · Dashboard',
    blurb: 'From round 1.',
    Component: DesignDashboard,
  },
  {
    id: 'cards',
    name: 'Option 3 · Cards',
    blurb: 'From round 1.',
    Component: DesignCards,
  },
  {
    id: 'invoice',
    name: 'Option 4 · Invoice',
    blurb: 'From round 1.',
    Component: DesignInvoice,
  },
  {
    id: 'receipt',
    name: 'Option 5 · Receipt',
    blurb: 'From round 1.',
    Component: DesignReceipt,
  },
]

export default function DesignsPage() {
  const report = getMockFeeReport({
    state: 'Texas',
    homeValue: 500000,
    transactionType: 'purchase',
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Fee Report — design exploration
            </div>
            <div className="text-sm font-medium text-dark-900">
              Round 2 · mobile-first · same mock data
            </div>
          </div>
          <nav className="flex items-center gap-1 flex-wrap">
            {round2Designs.map((d) => (
              <a
                key={d.id}
                href={`#${d.id}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
              >
                {d.name.split(' · ')[0]}
              </a>
            ))}
            <span className="w-px h-4 bg-gray-300 mx-1" />
            {round1Designs.map((d) => (
              <a
                key={d.id}
                href={`#${d.id}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                {d.name.split(' · ')[0]}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Round 2 — the new designs */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-dark-900 mb-2">Round 2 · Mobile-first</h1>
          <p className="text-gray-600 max-w-3xl">
            5 new directions. All assume mobile is the primary surface. No "pass-through" language.
            No confusing progress bars on individual line items. Every variant ends with a clear
            savings summary.
          </p>
        </div>

        <div className="space-y-20">
          {round2Designs.map(({ id, name, blurb, Component }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-dark-900 mb-2">{name}</h2>
                <p className="text-gray-600 max-w-3xl">{blurb}</p>
              </div>
              <Component report={report} />
            </section>
          ))}
        </div>

        {/* Round 1 collapsed for reference */}
        <div className="mt-24 pt-12 border-t-2 border-gray-300">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-500 mb-2">Round 1 · For reference</h2>
            <p className="text-gray-500 max-w-3xl">
              Original five for side-by-side comparison.
            </p>
          </div>
          <div className="space-y-20 opacity-90">
            {round1Designs.map(({ id, name, Component }) => (
              <section key={id} id={id} className="scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-700 mb-5">{name}</h3>
                <Component report={report} />
              </section>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 pt-12 pb-4">
          End of designs. Tell me which direction you like and I'll refine it.
        </div>
      </div>
    </div>
  )
}
