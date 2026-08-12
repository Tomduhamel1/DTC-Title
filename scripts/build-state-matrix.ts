// Regenerates src/lib/stateMatrix.generated.ts — the six-scenario economics
// matrix behind the /admin/states console.
//
// For each state's representative ZIP this runs the SAME code path as a real
// quote (fetchElendFeeEstimate → computeTotals) at six scenarios:
// {purchase, refinance} × {$500k, $1MM, $2MM} home value at 80% LTV — and
// records, per scenario: combined policy premiums, our settlement line,
// BetterClose Bucks, package savings, borrower total, headline savings, and
// "our portion" (settlement + conservativeSplit × premiums − Bucks, using
// src/lib/underwriterSplits.ts at build time).
//
// Runs with skipAvailabilityCheck — OFF states are priced too, because the
// console exists to decide whether to turn them on.
//
// Run:
//   npx tsx scripts/build-state-matrix.ts
//
// Honors FEE_CALC_API_URL. States whose upstream calls fail after retries
// retain their previous matrix entry when one exists ("stale beats absent")
// and are listed in the output.

import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchElendFeeEstimate } from '../src/lib/elendCalc'
import { computeTotals } from '../src/lib/feeReport'
import { REPRESENTATIVE_ZIP_BY_STATE } from '../src/lib/representativeZip'
import { conservativeSplitFor } from '../src/lib/underwriterSplits'

const HOME_VALUES = [500_000, 1_000_000, 2_000_000] as const
const MODES = ['purchase', 'refinance'] as const
const CONCURRENCY = 2

interface ScenarioEcon {
  premiums: number
  // Rate-engine premium split, so the console can show the numbers aren't
  // generalizations: owner's + lender's exactly as upstream priced them.
  owners: number
  lenders: number
  settlement: number
  bucks: number
  pkg: number
  pay: number
  save: number
  ourPortion: number
}

type StateMatrix = {
  split: number
  purchase: Record<string, ScenarioEcon>
  refinance: Record<string, ScenarioEcon>
}

async function scenarioFor(
  zip: string,
  state: string,
  mode: (typeof MODES)[number],
  homeValue: number,
): Promise<ScenarioEcon> {
  const loanAmount = Math.round(homeValue * 0.8)
  const report = await fetchElendFeeEstimate(
    {
      transactionType: mode,
      zip,
      homeValue: mode === 'purchase' ? homeValue : 0,
      loanAmount,
    },
    { skipAvailabilityCheck: true },
  )
  const totals = computeTotals(report)
  const premiums = report.lineItems
    .filter((li) => !li.isCredit && /title insurance/i.test(li.label))
    .reduce((s, li) => s + li.ourCost, 0)
  const owners = report.lineItems
    .filter((li) => !li.isCredit && /owner's title insurance/i.test(li.label))
    .reduce((s, li) => s + li.ourCost, 0)
  const lenders = report.lineItems
    .filter((li) => !li.isCredit && /lender's title insurance/i.test(li.label))
    .reduce((s, li) => s + li.ourCost, 0)
  const settlement = report.lineItems
    .filter((li) => !li.isCredit && /settlement fee/i.test(li.label))
    .reduce((s, li) => s + li.ourCost, 0)
  const bucks = totals.breakdown.promotional_credit ?? 0
  const split = conservativeSplitFor(state)
  return {
    premiums,
    owners,
    lenders,
    settlement,
    bucks,
    pkg: totals.serviceStack?.savings ?? 0,
    pay: Math.round(totals.ourTotal),
    save: Math.round(totals.estimatedSavings),
    ourPortion: Math.round(settlement + split * premiums - bucks),
  }
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  const delaysMs = [3000, 8000, 15000]
  let lastErr: unknown
  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < delaysMs.length) await new Promise((r) => setTimeout(r, delaysMs[attempt]))
    }
  }
  throw lastErr
}

async function main() {
  const only = process.argv[2] ? process.argv[2].split(',').map((s) => s.toUpperCase()) : null
  const states = Object.keys(REPRESENTATIVE_ZIP_BY_STATE)
    .filter((s) => !only || only.includes(s))
    .sort()
  const matrix: Record<string, StateMatrix> = {}
  const failed: string[] = []

  let cursor = 0
  async function worker() {
    while (cursor < states.length) {
      const state = states[cursor++]
      const zip = REPRESENTATIVE_ZIP_BY_STATE[state]
      try {
        const entry: StateMatrix = {
          split: conservativeSplitFor(state),
          purchase: {},
          refinance: {},
        }
        // Sequential per state — the upstream throttles concurrent calls.
        for (const mode of MODES) {
          for (const hv of HOME_VALUES) {
            entry[mode][String(hv)] = await withRetry(() => scenarioFor(zip, state, mode, hv))
          }
        }
        matrix[state] = entry
        const p5 = entry.purchase['500000']
        console.log(
          `${state} (${zip}): P500k pay $${p5.pay} save $${p5.save} ours $${p5.ourPortion} · split ${entry.split}`,
        )
      } catch (err) {
        failed.push(state)
        console.error(`${state}: FAILED —`, err instanceof Error ? err.message : err)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  // Stale beats absent: keep the previous entry for failed states.
  if (failed.length) {
    try {
      const prev = await import('../src/lib/stateMatrix.generated')
      for (const s of failed) {
        if (prev.STATE_MATRIX[s]) {
          matrix[s] = prev.STATE_MATRIX[s]
          console.log(`${s}: retained previous matrix entry`)
        }
      }
    } catch {
      // first run — nothing to retain
    }
  }

  const done = Object.keys(matrix).sort()
  if (done.length === 0) throw new Error('every state failed — refusing to write an empty matrix')

  const out = `// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// Six-scenario economics per state for the /admin/states console:
// {purchase, refinance} × {$500k, $1MM, $2MM} at 80% LTV, real engine output.
// ourPortion = settlement + split × premiums − bucks (split = conservative
// underwriter share from src/lib/underwriterSplits.ts at build time).
// SENSITIVE (margin data): server-side use only.
${failed.filter((s) => !matrix[s]).length ? `//\n// States with no data after upstream failures: ${failed.filter((s) => !matrix[s]).join(', ')}\n` : ''}
export const MATRIX_GENERATED_AT = '${new Date().toISOString()}'

export interface ScenarioEcon {
  premiums: number
  owners: number
  lenders: number
  settlement: number
  bucks: number
  pkg: number
  pay: number
  save: number
  ourPortion: number
}

export interface StateMatrix {
  split: number
  purchase: Record<string, ScenarioEcon>
  refinance: Record<string, ScenarioEcon>
}

export const MATRIX_HOME_VALUES = [500000, 1000000, 2000000]

export const STATE_MATRIX: Record<string, StateMatrix> = {
${done.map((s) => `  ${s}: ${JSON.stringify(matrix[s])},`).join('\n')}
}
`

  const target = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'src',
    'lib',
    'stateMatrix.generated.ts',
  )
  writeFileSync(target, out)
  console.log(
    `\nWrote ${target} (${done.length} states${failed.length ? `, ${failed.length} failed: ${failed.join(', ')}` : ''})`,
  )

  // ── Public curve subset ───────────────────────────────────────────────────
  // Marketing surfaces interpolate savings across the three anchor values
  // (stateSavings.ts). This file carries ONLY save/pay — no margin fields —
  // so it is safe for client bundles, unlike the matrix above.
  const curvePts = (m: StateMatrix, mode: (typeof MODES)[number]) =>
    HOME_VALUES.map((hv) => {
      const s = m[mode][String(hv)]
      return { save: s.save, pay: s.pay }
    })
  const curves: Record<string, { purchase: { save: number; pay: number }[]; refinance: { save: number; pay: number }[] }> = {}
  for (const s of done) {
    curves[s] = { purchase: curvePts(matrix[s], 'purchase'), refinance: curvePts(matrix[s], 'refinance') }
  }
  const meanAt = (mode: (typeof MODES)[number], i: number, k: 'save' | 'pay') =>
    Math.round(done.reduce((sum, s) => sum + curves[s][mode][i][k], 0) / done.length)
  const nationalCurve = {
    purchase: HOME_VALUES.map((_, i) => ({ save: meanAt('purchase', i, 'save'), pay: meanAt('purchase', i, 'pay') })),
    refinance: HOME_VALUES.map((_, i) => ({ save: meanAt('refinance', i, 'save'), pay: meanAt('refinance', i, 'pay') })),
  }
  const curveOut = `// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// PUBLIC subset of the state economics matrix: engine-computed savings and
// borrower totals at the three anchor home values, for marketing-surface
// interpolation (src/lib/stateSavings.ts). Contains NO margin fields —
// safe for client bundles (unlike stateMatrix.generated.ts).

export const CURVE_GENERATED_AT = '${new Date().toISOString()}'
export const CURVE_HOME_VALUES = ${JSON.stringify([...HOME_VALUES])}

export interface CurvePoint { save: number; pay: number }
export interface StateCurve { purchase: CurvePoint[]; refinance: CurvePoint[] }

export const NATIONAL_CURVE: StateCurve = ${JSON.stringify(nationalCurve)}

export const STATE_CURVES: Record<string, StateCurve> = {
${done.map((s) => `  ${s}: ${JSON.stringify(curves[s])},`).join('\n')}
}
`
  const curveTarget = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'src',
    'lib',
    'stateSavingsCurve.generated.ts',
  )
  writeFileSync(curveTarget, curveOut)
  console.log(`Wrote ${curveTarget}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
