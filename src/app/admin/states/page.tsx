import { requireAdmin } from '@/lib/auth/admin'
import { AdminHeader, Stat } from '@/components/admin/AdminChrome'
import { STATE_MASTER, STATE_NAMES, StateMasterEntry } from '@/lib/stateMaster'
import { premiumRegimeFor, serviceBandFor } from '@/lib/marketBaseline'
import { BETTERCLOSE_SERVICE_FEES, FeeAmount } from '@/lib/betterCloseFees'
import { BUCKS_EXCLUDED_STATES, BUCKS_RATE } from '@/lib/betterCloseBucks'
import { splitsForState } from '@/lib/underwriterSplits'
import { GENERATED_AT, NATIONAL_ANCHOR, STATE_ANCHORS } from '@/lib/stateSavings.generated'
import {
  MATRIX_GENERATED_AT,
  MATRIX_HOME_VALUES,
  STATE_MATRIX,
} from '@/lib/stateMatrix.generated'
import { formatCurrency } from '@/lib/feeReport'

// Margin data — never index, never cache.
export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'States — Admin',
  robots: { index: false, follow: false },
}

const fmtDate = (iso: string) => iso.slice(0, 10)
const fmtFee = (v: FeeAmount) =>
  typeof v === 'number'
    ? formatCurrency(v)
    : ['purchase' in v ? `P ${formatCurrency(v.purchase!)}` : null, 'refinance' in v ? `R ${formatCurrency(v.refinance!)}` : null]
        .filter(Boolean)
        .join(' / ')

function OfferBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        on ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
      }`}
    >
      {label} {on ? 'on' : 'off'}
    </span>
  )
}

function ChangeHint({ what, file }: { what: string; file: string }) {
  return (
    <div className="text-[11px] text-gray-400">
      {what}: <code className="text-gray-500">{file}</code>
    </div>
  )
}

export default async function AdminStatesPage() {
  const admin = await requireAdmin()

  const codes = Object.keys(STATE_MASTER).sort()
  const onCount = codes.filter((c) => STATE_MASTER[c].offer.purchase || STATE_MASTER[c].offer.refinance).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdminHeader admin={admin} active="states" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="States offering service" value={onCount} accent="emerald" />
          <Stat label="States off" value={codes.length - onCount} />
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Data freshness</div>
            <div className="text-sm font-semibold text-dark-900 mt-1">
              Matrix {fmtDate(MATRIX_GENERATED_AT)} · Anchors {fmtDate(GENERATED_AT)}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Regenerate: <code>build-state-matrix.ts</code> / <code>build-state-savings.ts</code>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Levers in force</div>
            <div className="text-sm font-semibold text-dark-900 mt-1">
              Bucks {Math.round(BUCKS_RATE * 100)}% of policies
              {BUCKS_EXCLUDED_STATES.size > 0
                ? ` (off in ${Array.from(BUCKS_EXCLUDED_STATES).join(', ')})`
                : ' (all states)'}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              National anchor: save {formatCurrency(NATIONAL_ANCHOR.purchase.save)} P / {formatCurrency(NATIONAL_ANCHOR.refinance.save)} R
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {codes.map((code) => (
            <StateRow key={code} code={code} entry={STATE_MASTER[code]} />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Where each lever lives (edits go through Claude)
          </div>
          <ChangeHint what="Availability, counties, comp sources, notes" file="src/lib/stateMaster.ts" />
          <ChangeHint what="BetterClose service fees (e.g. settlement)" file="src/lib/betterCloseFees.ts" />
          <ChangeHint what="Market comparison bands" file="src/lib/marketBaseline.ts" />
          <ChangeHint what="Bucks rate + per-state exclusions" file="src/lib/betterCloseBucks.ts" />
          <ChangeHint what="Underwriter premium splits" file="src/lib/underwriterSplits.ts" />
        </div>
      </div>
    </div>
  )
}

function StateRow({ code, entry }: { code: string; entry: StateMasterEntry }) {
  const anchor = STATE_ANCHORS[code]
  const matrix = STATE_MATRIX[code]
  const bandP = serviceBandFor(code, 'purchase')
  const bandR = serviceBandFor(code, 'refinance')
  const overrides = BETTERCLOSE_SERVICE_FEES.byState[code]
  const splits = splitsForState(code)
  const regime = premiumRegimeFor(code)
  const anyOn = entry.offer.purchase || entry.offer.refinance
  const flags: string[] = []
  if (anyOn && matrix && matrix.purchase['500000']?.pkg === 0) flags.push('no package savings @500k')
  if (anyOn && !entry.marketLowSource) flags.push('no comp source recorded')

  return (
    <details className={`bg-white rounded-2xl border ${anyOn ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}>
      <summary className="cursor-pointer list-none px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="w-40 font-bold text-dark-900">
          {STATE_NAMES[code] ?? code} <span className="text-gray-400 font-semibold">{code}</span>
        </span>
        <span className="flex gap-1">
          <OfferBadge on={entry.offer.purchase} label="P" />
          <OfferBadge on={entry.offer.refinance} label="R" />
        </span>
        <span className="text-xs text-gray-500 tabular-nums">
          band {bandP.low}–{bandP.high}× <span className="text-gray-400">({bandP.basis}{bandP.providers ? ` · ${bandP.providers}` : ''})</span>
        </span>
        <span className="text-xs text-gray-500">
          {overrides ? `fees: ${Object.entries(overrides).map(([k, v]) => `${k} ${fmtFee(v)}`).join(', ')}` : 'fees: FNTE'}
        </span>
        {anchor && (
          <span className="text-xs font-semibold text-emerald-700 tabular-nums">
            save {formatCurrency(anchor.purchase.save)} P / {formatCurrency(anchor.refinance.save)} R
          </span>
        )}
        {flags.length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            {flags.join(' · ')}
          </span>
        )}
      </summary>

      <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Availability</div>
            <div className="text-gray-700">
              Purchase {entry.offer.purchase ? 'offered' : 'not offered'} · Refinance {entry.offer.refinance ? 'offered' : 'not offered'}
            </div>
            {entry.excludedCounties?.length ? (
              <div className="text-gray-700">Excluded counties: {entry.excludedCounties.join(', ')}</div>
            ) : null}
            {entry.availabilityNote && <div className="text-amber-700 text-xs mt-1">{entry.availabilityNote}</div>}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Comparison & premiums
            </div>
            <div className="text-gray-700 text-xs">
              Premium regime: {regime} (premiums never counted toward savings). Purchase band {bandP.low}–{bandP.high}× ({bandP.basis}
              {bandP.providers ? `, ${bandP.providers} providers` : ''}); refi band {bandR.low}–{bandR.high}× ({bandR.basis}).
            </div>
            {entry.marketLowSource && (
              <div className="text-gray-500 text-xs mt-1">Source: {entry.marketLowSource}</div>
            )}
          </div>
        </div>

        {matrix ? (
          <div className="overflow-x-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Economics (engine-generated {fmtDate(MATRIX_GENERATED_AT)} · split {Math.round(matrix.split * 100)}%)
            </div>
            <table className="w-full text-xs tabular-nums">
              <thead>
                <tr className="text-left text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-1 pr-3">Scenario</th>
                  <th className="py-1 pr-3 text-right">Policies</th>
                  <th className="py-1 pr-3 text-right">Bucks</th>
                  <th className="py-1 pr-3 text-right">Pkg save</th>
                  <th className="py-1 pr-3 text-right">Borrower pays</th>
                  <th className="py-1 pr-3 text-right">Save headline</th>
                  <th className="py-1 text-right">Our portion</th>
                </tr>
              </thead>
              <tbody>
                {(['purchase', 'refinance'] as const).flatMap((mode) =>
                  MATRIX_HOME_VALUES.map((hv) => {
                    const s = matrix[mode][String(hv)]
                    if (!s) return null
                    return (
                      <tr key={`${mode}-${hv}`} className="border-t border-gray-100">
                        <td className="py-1 pr-3 font-semibold text-gray-700">
                          {mode === 'purchase' ? 'P' : 'R'} {formatCurrency(hv)}
                        </td>
                        <td className="py-1 pr-3 text-right">{formatCurrency(s.premiums)}</td>
                        <td className="py-1 pr-3 text-right text-emerald-700">−{formatCurrency(s.bucks)}</td>
                        <td className="py-1 pr-3 text-right">{formatCurrency(s.pkg)}</td>
                        <td className="py-1 pr-3 text-right font-semibold">{formatCurrency(s.pay)}</td>
                        <td className="py-1 pr-3 text-right font-semibold text-emerald-700">{formatCurrency(s.save)}</td>
                        <td className="py-1 text-right font-bold">{formatCurrency(s.ourPortion)}</td>
                      </tr>
                    )
                  }),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-gray-400">No matrix data yet — rerun scripts/build-state-matrix.ts.</div>
        )}

        <div className="text-xs text-gray-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-2">Underwriter splits</span>
          {splits.map((s) => `${s.underwriter.split(' ')[0]} ${Math.round(s.companyShare * 100)}%${s.fallback ? ' (fallback)' : ''}`).join(' · ')}
          {BUCKS_EXCLUDED_STATES.has(code) && <span className="ml-2 text-amber-700 font-semibold">Bucks excluded here</span>}
        </div>

        {entry.notes && <div className="text-xs text-gray-500">Notes: {entry.notes}</div>}
      </div>
    </details>
  )
}
