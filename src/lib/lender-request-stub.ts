// Frontend prototype stub. Replace with real fetch('/api/lender-request', ...) once backend lands.

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
  // eslint-disable-next-line no-console
  console.log('[prototype] would send lender email:', p)
  await new Promise((r) => setTimeout(r, 800))
  return { ok: true, requestId: 'prototype-' + p.refId }
}

export type ShareEvent = {
  channel: 'sms' | 'mailto' | 'we_email' | 'copy_link' | 'native_share'
  refId: string
  source: string
  savingsEstimate?: number
}

export function logShareEvent(e: ShareEvent) {
  // eslint-disable-next-line no-console
  console.log('[prototype] share event:', e)
}

export function buildShareMessage(opts: { savingsEstimate?: number; refId: string }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/for-my-lender?ref=${opts.refId}`
  const savingsLine = opts.savingsEstimate
    ? `they estimate ~$${opts.savingsEstimate.toLocaleString()} in savings on the same A-rated underwriters. `
    : ''
  const text = `I'd like to use BetterClose for our closing — ${savingsLine}Would you take a look?`
  return { text, url, full: `${text} ${url}` }
}

export function generateRefId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}
