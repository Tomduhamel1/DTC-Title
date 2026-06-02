// Shape of the broker estimate's lead-capture payload. This sits in
// sessionStorage under the key `brokerEstimateContext`, alongside the
// calculator inputs/results (`feeReportInputs` / `feeReport`).
//
// Why a separate key from feeReportInputs:
//   - feeReportInputs is what /quote/working posts to /api/fee-estimate.
//     Bloating it with non-calc fields would either widen the Zod schema or
//     force a strip step. Separating keeps calc payload and lead payload
//     orthogonal.
//   - Only this payload travels through the login redirect into the broker
//     builder for hydration; the calc result also travels but as `feeReport`.
//
// Fields are split into two groups by what is supported downstream today:
//   supportedFields ─ already on the FeeQuote schema + carried into
//                     createClosingFromOrder; safe to hydrate the builder.
//   parkedFields    ─ captured here for display continuity, but NOT yet on
//                     FeeQuote. Will surface in the builder's success banner
//                     so the broker re-enters them only once schema lands.

export interface BrokerEstimateContext {
  // ── Property identity (carried into the broker quote and the order/file) ──
  propertyAddress?: string
  propertyCity?: string
  propertyState?: string // 2-letter
  // The ACTUAL property ZIP for the file. Distinct from the calc-time ZIP on
  // feeReportInputs — which may be a representative ZIP we substituted when
  // the broker only gave us a state. Order/file prefill must use this field,
  // never the calc payload's ZIP.
  propertyZip?: string

  // ── Section 2: Optional file details ──
  borrowerName?: string
  borrowerEmail?: string
  borrowerPhone?: string

  // Parked fields — captured but NOT persisted to FeeQuote yet (no DB
  // migration in this pass). The broker builder will show them in the
  // success banner so the broker knows they were heard.
  targetClosingDate?: string // ISO date "YYYY-MM-DD"
  lenderName?: string
  lenderCompany?: string
  lenderEmail?: string
}

export const BROKER_ESTIMATE_CONTEXT_KEY = 'brokerEstimateContext'

export function readBrokerEstimateContext(): BrokerEstimateContext | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(BROKER_ESTIMATE_CONTEXT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as BrokerEstimateContext
  } catch {
    return null
  }
}

export function writeBrokerEstimateContext(ctx: BrokerEstimateContext) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(BROKER_ESTIMATE_CONTEXT_KEY, JSON.stringify(ctx))
}

export function clearBrokerEstimateContext() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(BROKER_ESTIMATE_CONTEXT_KEY)
}
