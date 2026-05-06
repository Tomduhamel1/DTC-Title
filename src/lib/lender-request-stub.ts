// Client-side helpers for the share-with-team flow.
// Calls the real /api/lender-request endpoint.

export type LenderRequestPayload = {
  lenderEmail: string
  lenderFirstName?: string
  clientName?: string
  clientEmail?: string
  note?: string
  savingsEstimate?: number
  source: string
  refId: string
}

export async function submitLenderRequest(p: LenderRequestPayload) {
  const res = await fetch('/api/lender-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...p, channel: 'we_email' }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false as const, requestId: null, error: err.error || 'send failed' }
  }
  const data = await res.json()
  return { ok: true as const, requestId: data.requestId as string, messageId: data.messageId as string | undefined }
}

export type ShareEvent = {
  channel: 'sms' | 'mailto' | 'we_email' | 'copy_link' | 'native_share'
  refId: string
  source: string
  savingsEstimate?: number
}

/**
 * Fire-and-forget: persists the share event to the DB so we can analyze the
 * funnel by channel. Doesn't send any emails.
 */
export function logShareEvent(e: ShareEvent) {
  // Don't await; this is best-effort tracking
  fetch('/api/lender-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(e),
    keepalive: true,
  }).catch(() => {
    /* swallow */
  })
}

export function buildShareMessage(opts: { savingsEstimate?: number; refId: string }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/for-my-team?ref=${opts.refId}`
  const savingsLine = opts.savingsEstimate
    ? ` That's about $${opts.savingsEstimate.toLocaleString()} I'd be saving over the life of the loan, on the same A-rated underwriters.`
    : ''
  const text = `Quick heads-up — I'm using BetterClose for title and settlement on my closing.${savingsLine} Here's everything you need to send the order their way:`
  return { text, url, full: `${text} ${url}` }
}

export function generateRefId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}
