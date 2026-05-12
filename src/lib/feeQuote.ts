// FeeQuote helpers — input normalization, hashing, token generation,
// expiration default, and resolve-amounts logic.
//
// Pure, server-side, no Prisma. Consumed by:
//   - POST /api/broker/quotes (broker-originated quote creation)
//   - any future code path that needs to dedupe quotes or generate tokens

import crypto from 'crypto'

// 30-day expiration is BC's chosen default. Title fee tables move slowly
// but they DO move; a 30-day frozen quote balances "convert later without
// fresh quoting" against "don't honor stale numbers indefinitely".
export const DEFAULT_QUOTE_EXPIRY_DAYS = 30

// Length of a base64url shareToken — 24 random bytes produce a 32-char
// base64url string with no padding. Long enough to be unguessable.
const SHARE_TOKEN_BYTES = 24

export type TransactionType = 'purchase' | 'refinance'

// What the helper accepts before normalization. Strings are trimmed,
// optional fields may be undefined.
export interface RawFeeQuoteInput {
  transactionType: TransactionType
  zip: string
  homeValue?: number
  loanAmount?: number
  // Borrower contact (all optional at the schema level; the form may collect
  // them but the broker can save a draft without a borrower attached).
  borrowerName?: string | null
  borrowerEmail?: string | null
  borrowerPhone?: string | null
  // Property address pieces
  propertyAddress?: string | null
  propertyCity?: string | null
  propertyState?: string | null
  propertyZip?: string | null
}

// Canonical normalized shape stored as inputJson. Field order is fixed so
// inputHash is stable across calls with the same logical input.
export interface NormalizedFeeQuoteInput {
  transactionType: TransactionType
  zip: string
  homeValue: number | null
  loanAmount: number | null
  borrowerName: string | null
  borrowerEmail: string | null
  borrowerPhone: string | null
  propertyAddress: string | null
  propertyCity: string | null
  propertyState: string | null
  propertyZip: string | null
}

function normalizePhone(s: string | null | undefined): string | null {
  if (!s) return null
  const digits = s.replace(/[^0-9]/g, '')
  if (digits.length < 10) return null
  return digits.slice(-10)
}

function trimOrNull(s: string | null | undefined): string | null {
  if (!s) return null
  const t = s.trim()
  return t || null
}

export function normalizeFeeQuoteInput(raw: RawFeeQuoteInput): NormalizedFeeQuoteInput {
  return {
    transactionType: raw.transactionType,
    zip: raw.zip,
    homeValue: typeof raw.homeValue === 'number' && raw.homeValue > 0 ? raw.homeValue : null,
    loanAmount: typeof raw.loanAmount === 'number' && raw.loanAmount > 0 ? raw.loanAmount : null,
    borrowerName: trimOrNull(raw.borrowerName),
    borrowerEmail: raw.borrowerEmail ? raw.borrowerEmail.trim().toLowerCase() || null : null,
    borrowerPhone: normalizePhone(raw.borrowerPhone),
    propertyAddress: trimOrNull(raw.propertyAddress),
    propertyCity: trimOrNull(raw.propertyCity),
    propertyState: raw.propertyState ? raw.propertyState.trim().toUpperCase().slice(0, 2) || null : null,
    propertyZip: trimOrNull(raw.propertyZip),
  }
}

export function computeInputHash(normalized: NormalizedFeeQuoteInput): string {
  // JSON.stringify produces deterministic output here because every field
  // in NormalizedFeeQuoteInput is declared in fixed order and contains only
  // primitives (string | number | null).
  return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}

export function generateShareToken(): string {
  return crypto.randomBytes(SHARE_TOKEN_BYTES).toString('base64url')
}

export function defaultExpiresAt(now: Date = new Date()): Date {
  return new Date(now.getTime() + DEFAULT_QUOTE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
}

// Mirrors the purchase/refinance resolution rules in /api/fee-estimate.
// Replicated here (not imported) to keep the public route untouched and let
// the broker route compute amounts identically.
//
// Returns { ok, homeValue, loanAmount } on success or { ok: false, error }
// on a validation failure that should bubble back to the caller as 400.
export function resolveAmounts(input: {
  transactionType: TransactionType
  homeValue: number | null
  loanAmount: number | null
}):
  | { ok: true; homeValue: number; loanAmount: number }
  | { ok: false; error: string } {
  let homeValue = input.homeValue ?? 0
  let loanAmount = input.loanAmount ?? 0

  if (input.transactionType === 'refinance') {
    if (!loanAmount) return { ok: false, error: 'loanAmount required for refinance' }
    homeValue = 0
  } else {
    if (!homeValue) return { ok: false, error: 'homeValue required for purchase' }
    if (!loanAmount) loanAmount = Math.round(homeValue * 0.8)
  }

  return { ok: true, homeValue, loanAmount }
}
