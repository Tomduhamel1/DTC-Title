// Underwriter premium splits — BetterClose's retained share of the title
// policy premium, per underwriter per state. Source of truth:
// underwriter-split-master.csv (Tom's Desktop, imported 2026-08-10).
//
// Rules encoded from that CSV:
//   - Fallback: any underwriter/state pair NOT listed retains DEFAULT_SPLIT.
//   - EXCEPTION: Westcor Land Title has NO fallback — an unlisted Westcor
//     state requires an explicit per-file split and is excluded from the
//     conservative calculation entirely.
//
// SENSITIVE (margin data): server-side / analysis use only. Do not import
// from client components.

export const DEFAULT_SPLIT = 0.85

export const NO_FALLBACK_UNDERWRITERS = new Set(['Westcor Land Title'])

// Company-retained fraction by underwriter and state.
export const UNDERWRITER_SPLITS: Record<string, Record<string, number>> = {
  'AmTrust Title Insurance Company': { CO: 0.85, CT: 0.6, DE: 0.88, FL: 0.7, GA: 0.85, IL: 0.85, IN: 0.85, KY: 0.85, MA: 0.7, MD: 0.85, ME: 0.85, MI: 0.85, MN: 0.7, MT: 0.85, NC: 0.85, ND: 0.85, NH: 0.85, NJ: 0.85, NY: 0.85, OH: 0.85, PA: 0.88, RI: 0.85, SC: 0.6, TN: 0.85, VT: 0.85, WV: 0.85 },
  'CATIC Title': { CT: 0.6, FL: 0.7, MA: 0.8, ME: 0.85, NH: 0.85, RI: 0.85 },
  'First American Title Insurance Company': { AZ: 0.85, CO: 0.85, DC: 0.85, DE: 0.85, FL: 0.7, GA: 0.85, IL: 0.85, IN: 0.85, KY: 0.85, MA: 0.85, MD: 0.85, ME: 0.85, MI: 0.85, MN: 0.85, MO: 0.5, MS: 0.85, NC: 0.75, ND: 0.85, NH: 0.85, NJ: 0.85, NY: 0.85, OH: 0.85, PA: 0.85, RI: 0.85, SC: 0.6, TN: 0.85, VA: 0.8, VT: 0.7, WI: 0.85, WV: 0.85 },
  'Westcor Land Title': { CO: 0.85, CT: 0.6, FL: 0.7, MA: 0.85, RI: 0.85 },
}

export interface StateSplit {
  underwriter: string
  companyShare: number
  fallback: boolean
}

/** Every underwriter's applicable split in a state (fallbacks included;
 *  Westcor omitted where unlisted — no fallback exists for it). */
export function splitsForState(stateCode: string): StateSplit[] {
  const st = stateCode.toUpperCase()
  const out: StateSplit[] = []
  for (const [underwriter, byState] of Object.entries(UNDERWRITER_SPLITS)) {
    const listed = byState[st]
    if (listed !== undefined) {
      out.push({ underwriter, companyShare: listed, fallback: false })
    } else if (!NO_FALLBACK_UNDERWRITERS.has(underwriter)) {
      out.push({ underwriter, companyShare: DEFAULT_SPLIT, fallback: true })
    }
  }
  return out
}

/** Lowest applicable company share in the state — the conservative number
 *  the economics matrix uses for "our portion". */
export function conservativeSplitFor(stateCode: string): number {
  const splits = splitsForState(stateCode)
  if (splits.length === 0) return DEFAULT_SPLIT
  return Math.min(...splits.map((s) => s.companyShare))
}
