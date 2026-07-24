// Regenerates src/lib/stateSavings.generated.ts — the per-state savings
// anchors behind every marketing savings number (see src/lib/stateSavings.ts).
//
// For each state's representative ZIP (src/lib/representativeZip.ts) this
// runs the SAME code path as a real quote — fetchElendFeeEstimate →
// computeTotals — at a fixed anchor scenario, and records the resulting
// "save at closing" figure. No marketing math, no separate model: whatever
// the quote flow would show a borrower in that scenario is what the hero and
// calculators advertise.
//
//   Anchor scenario: $500,000 purchase with an 80% LTV loan ($400,000);
//   refinance of a $400,000 note on the same property value.
//
// Run:
//   npx tsx scripts/build-state-savings.ts
//
// Honors FEE_CALC_API_URL (defaults to the current upstream stage).
// States whose upstream call fails after a retry are omitted from the table
// (the runtime falls back to the national anchor) and listed in the output.

import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchElendFeeEstimate } from '../src/lib/elendCalc'
import { computeTotals } from '../src/lib/feeReport'
import { REPRESENTATIVE_ZIP_BY_STATE } from '../src/lib/representativeZip'

const ANCHOR_HOME_VALUE = 500_000
const ANCHOR_LOAN_AMOUNT = 400_000
// The upstream "test" stage 500s under concurrent load — keep this low and
// sequential per state or most states come back as failures.
const CONCURRENCY = 2

interface ModeAnchor {
  save: number
  ourTotal: number
}

interface StateAnchor {
  purchase: ModeAnchor
  refinance: ModeAnchor
}

async function savingsFor(
  zip: string,
  transactionType: 'purchase' | 'refinance',
): Promise<ModeAnchor> {
  const report = await fetchElendFeeEstimate({
    transactionType,
    zip,
    homeValue: transactionType === 'purchase' ? ANCHOR_HOME_VALUE : 0,
    loanAmount: ANCHOR_LOAN_AMOUNT,
  })
  const totals = computeTotals(report)
  return { save: Math.round(totals.estimatedSavings), ourTotal: Math.round(totals.ourTotal) }
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
  const states = Object.keys(REPRESENTATIVE_ZIP_BY_STATE).sort()
  const anchors: Record<string, StateAnchor> = {}
  const failed: string[] = []

  let cursor = 0
  async function worker() {
    while (cursor < states.length) {
      const state = states[cursor++]
      const zip = REPRESENTATIVE_ZIP_BY_STATE[state]
      try {
        // Sequential per state — the upstream throttles concurrent calls.
        const purchase = await withRetry(() => savingsFor(zip, 'purchase'))
        const refinance = await withRetry(() => savingsFor(zip, 'refinance'))
        anchors[state] = { purchase, refinance }
        console.log(
          `${state} (${zip}): purchase save $${purchase.save} / total $${purchase.ourTotal} · refi save $${refinance.save} / total $${refinance.ourTotal}`,
        )
      } catch (err) {
        failed.push(state)
        console.error(`${state} (${zip}): FAILED —`, err instanceof Error ? err.message : err)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  // Failure tolerance: a state whose upstream calls fail this run KEEPS its
  // anchor from the previous generated file (stale beats absent — absent
  // silently falls back to the national average on the live site). Only
  // states with no previous value are truly omitted.
  if (failed.length > 0) {
    try {
      const prev = await import('../src/lib/stateSavings.generated')
      for (const st of [...failed]) {
        const prevAnchor = (prev.STATE_ANCHORS as Record<string, StateAnchor>)[st]
        if (prevAnchor) {
          anchors[st] = prevAnchor
          failed.splice(failed.indexOf(st), 1)
          console.log(`${st}: retained previous anchor (upstream failed this run)`)
        }
      }
    } catch {
      // no previous file — nothing to retain
    }
  }

  const done = Object.keys(anchors).sort()
  if (done.length === 0) throw new Error('every state failed — refusing to write an empty table')

  const avg = (pick: (a: StateAnchor) => number) =>
    Math.round(done.reduce((sum, s) => sum + pick(anchors[s]), 0) / done.length)
  const national: StateAnchor = {
    purchase: { save: avg((a) => a.purchase.save), ourTotal: avg((a) => a.purchase.ourTotal) },
    refinance: { save: avg((a) => a.refinance.save), ourTotal: avg((a) => a.refinance.ourTotal) },
  }

  const fmtAnchor = (a: StateAnchor) =>
    `{ purchase: { save: ${a.purchase.save}, ourTotal: ${a.purchase.ourTotal} }, refinance: { save: ${a.refinance.save}, ourTotal: ${a.refinance.ourTotal} } }`
  const lines = done.map((s) => `  ${s}: ${fmtAnchor(anchors[s])},`)

  const out = `// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-savings.ts
//
// Per-state "save at closing" anchors, computed by running the production
// quote engine (fetchElendFeeEstimate → computeTotals) at the anchor scenario
// below against each state's representative ZIP. See src/lib/stateSavings.ts
// for how these are consumed.
${failed.length ? `//\n// States omitted after upstream failures (runtime falls back to the\n// national anchor): ${failed.join(', ')}\n` : ''}
export const GENERATED_AT = '${new Date().toISOString()}'

// Anchor scenario: $${ANCHOR_HOME_VALUE.toLocaleString('en-US')} purchase, $${ANCHOR_LOAN_AMOUNT.toLocaleString('en-US')} loan (80% LTV);
// refinance of a $${ANCHOR_LOAN_AMOUNT.toLocaleString('en-US')} note.
export const ANCHOR_HOME_VALUE = ${ANCHOR_HOME_VALUE}

export interface ModeAnchor {
  /** Engine-computed "save at closing" for the anchor scenario. */
  save: number
  /** Engine-computed all-in buyer-side total (title, settlement, recording). */
  ourTotal: number
}

export interface StateAnchor {
  purchase: ModeAnchor
  refinance: ModeAnchor
}

// Mean across generated states.
export const NATIONAL_ANCHOR: StateAnchor = ${fmtAnchor(national)}

export const STATE_ANCHORS: Record<string, StateAnchor> = {
${lines.join('\n')}
}
`

  const target = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'src',
    'lib',
    'stateSavings.generated.ts',
  )
  writeFileSync(target, out)
  console.log(`\nWrote ${target} (${done.length} states${failed.length ? `, ${failed.length} failed: ${failed.join(', ')}` : ''})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
