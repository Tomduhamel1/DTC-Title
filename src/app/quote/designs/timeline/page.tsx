'use client'

import { ComponentType } from 'react'
import Link from 'next/link'
import { FeeReport, getMockFeeReport } from '@/lib/feeReport'
import DesignTimeline from '@/components/feeReportDesigns/DesignTimeline'
import DesignTimelineC from '@/components/feeReportDesigns/DesignTimelineC'
import DesignTimelineE from '@/components/feeReportDesigns/DesignTimelineE'
import DesignTimelineF from '@/components/feeReportDesigns/DesignTimelineF'
import DesignTimelineG from '@/components/feeReportDesigns/DesignTimelineG'
import DesignTimelineH from '@/components/feeReportDesigns/DesignTimelineH'
import DesignTimelineI from '@/components/feeReportDesigns/DesignTimelineI'
import DesignTimelineJ from '@/components/feeReportDesigns/DesignTimelineJ'

interface Variation {
  id: string
  name: string
  blurb: string
  Component: ComponentType<{ report: FeeReport }>
  group: 'previous' | 'new'
}

const variations: Variation[] = [
  // Previous favorites
  {
    id: 'original',
    name: 'Original (Option 8)',
    blurb: 'The starting point — left spine, emerald nodes for variable, gray for fixed.',
    Component: DesignTimeline,
    group: 'previous',
  },
  {
    id: 'c',
    name: 'C · Status-aware (with progress demo)',
    blurb: 'Nodes carry done / active / pending state. Spine fills as items complete.',
    Component: DesignTimelineC,
    group: 'previous',
  },
  {
    id: 'e',
    name: 'E · Bold typographic, hairline spine',
    blurb: 'Hairline spine, ring nodes, premium typography. Most statement-like.',
    Component: DesignTimelineE,
    group: 'previous',
  },
  // New round
  {
    id: 'f',
    name: 'F · Quiet emerald (refined Original)',
    blurb:
      'The Original toned down. Smaller spine and nodes. Prices unified in dark-900 (no emerald-colored prices) so the row feels like one document. Emerald is a cue, not the star.',
    Component: DesignTimelineF,
    group: 'new',
  },
  {
    id: 'g',
    name: 'G · Two-track timeline',
    blurb:
      'Each variable item has TWO nodes: a filled emerald dot (you) and a hollow gray dot (typical), connected by a tiny line. Visual you-vs-typical without progress bars.',
    Component: DesignTimelineG,
    group: 'new',
  },
  {
    id: 'h',
    name: 'H · Dual-mode (toggle Fees ↔ Tracker)',
    blurb:
      'Pure fee-report look by default — no fake progress. A toggle in the header flips the same component into closing-tracker mode with done/active/pending states. Click the toggle to see both.',
    Component: DesignTimelineH,
    group: 'new',
  },
  {
    id: 'i',
    name: 'I · Refined E (savings glyph)',
    blurb:
      'E with two refinements: variable nodes are filled emerald with a halo (so they pop against fixed items), and each variable price gets a small "↓ $X under" microcopy underneath. Adds the savings story without competing.',
    Component: DesignTimelineI,
    group: 'new',
  },
  {
    id: 'j',
    name: 'J · Hybrid synthesis',
    blurb:
      'Combines: hairline spine (E), filled emerald node + halo for variable / hollow ring for fixed, unified dark price + tiny "save $X" eyebrow on variable items. Trying to land all three of Original/C/E at once.',
    Component: DesignTimelineJ,
    group: 'new',
  },
]

export default function TimelineDesignsPage() {
  const report = getMockFeeReport({
    state: 'Texas',
    homeValue: 500000,
    transactionType: 'purchase',
  })
  // Legacy design explorations predate credit lines (BetterClose Bucks) and
  // assume every non-fixed line has a typicalRange — filter credits out so
  // prerendering this archive page doesn't crash.
  report.lineItems = report.lineItems.filter((li) => !li.isCredit)

  const newVariations = variations.filter((v) => v.group === 'new')
  const previousVariations = variations.filter((v) => v.group === 'previous')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link href="/quote/designs" className="text-xs text-gray-500 hover:text-gray-700">
              ← All designs
            </Link>
            <div className="text-sm font-medium text-dark-900">
              Timeline variations · desktop + mobile views
            </div>
          </div>
          <nav className="flex items-center gap-1 flex-wrap">
            {newVariations.map((v) => (
              <a
                key={v.id}
                href={`#${v.id}`}
                className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
              >
                {v.id.toUpperCase()}
              </a>
            ))}
            <span className="w-px h-4 bg-gray-300 mx-1" />
            {previousVariations.map((v) => (
              <a
                key={v.id}
                href={`#${v.id}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                {v.id === 'original' ? 'Orig' : v.id.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-dark-900 mb-3">Timeline · round 2</h1>
          <p className="text-gray-600 max-w-3xl mb-2">
            Five new variations (F–J), plus your previous favorites (Original, C, E) for reference.
            Each is rendered <strong>twice</strong> — desktop on the left, mobile on the right —
            so you can see how the layout adapts.
          </p>
        </div>

        <div className="space-y-24">
          {[...newVariations, ...previousVariations].map((v) => (
            <VariationBlock key={v.id} variation={v} report={report} />
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 pt-12 pb-4">
          Tell me which variation lands and I'll polish into <code className="bg-gray-200 px-1 rounded">/quote/results</code>.
        </div>
      </div>
    </div>
  )
}

function VariationBlock({
  variation,
  report,
}: {
  variation: Variation
  report: FeeReport
}) {
  const { id, name, blurb, Component, group } = variation
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-black text-dark-900">{name}</h2>
          {group === 'previous' && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2 py-0.5 rounded-full bg-gray-200">
              previous
            </span>
          )}
        </div>
        <p className="text-gray-600 max-w-3xl text-sm">{blurb}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Desktop view */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
            <DesktopIcon />
            Desktop
          </div>
          <Component report={report} />
        </div>
        {/* Mobile view (in a phone-frame) */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
            <MobileIcon />
            Mobile (375px)
          </div>
          <div className="mx-auto" style={{ maxWidth: '375px' }}>
            <Component report={report} />
          </div>
        </div>
      </div>
    </section>
  )
}

function DesktopIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path strokeLinecap="round" d="M9 20h6M12 16v4" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path strokeLinecap="round" d="M11 18h2" />
    </svg>
  )
}
