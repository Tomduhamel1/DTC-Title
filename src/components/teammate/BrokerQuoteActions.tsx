'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  quoteId: string
  status: string
  shareToken: string
  // Whether borrowerEmail is present on the quote — the Send button is
  // disabled when there's no recipient, since the server would reject.
  hasBorrowerEmail: boolean
  // For the public-view URL the broker copies to clipboard.
  publicViewBaseUrl: string
  // Convert-button gating:
  //   - companyVerified=false → Convert disabled with tooltip
  //   - convertedClosingId set → button replaced with "View closing" link
  companyVerified: boolean
  convertedClosingId: string | null
}

// Action row on the broker quote detail page. Replaces the disabled
// placeholders from PR 5 with:
//   - Send to borrower / Resend (real, wired)
//   - Copy share link (client-only clipboard write)
//   - Convert to closing (wired in PR 7; gated on companyVerified + expiry)

export default function BrokerQuoteActions({
  quoteId,
  status,
  shareToken,
  hasBorrowerEmail,
  publicViewBaseUrl,
  companyVerified,
  convertedClosingId,
}: Props) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertError, setConvertError] = useState<string | null>(null)

  const canSend = hasBorrowerEmail && status !== 'converted' && status !== 'expired'
  const isResend = status === 'sent' || status === 'viewed'
  const sendLabel = isResend ? 'Resend' : 'Send to borrower'

  async function onSend() {
    if (!canSend || sending) return
    setSending(true)
    setSendError(null)
    setSendMsg(null)
    try {
      const res = await fetch(`/api/broker/quotes/${quoteId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSendError(json.error || `Failed (${res.status})`)
        return
      }
      setSendMsg(
        json.kind === 'resent'
          ? `Resent to borrower (status: ${json.status}).`
          : `Sent to borrower (status: ${json.status}).`,
      )
      router.refresh()
    } finally {
      setSending(false)
    }
  }

  async function onCopyLink() {
    const url = `${publicViewBaseUrl}/quote/view?token=${shareToken}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Some browsers refuse clipboard writes outside a top-level user
      // gesture; fall back to a prompt with the URL pre-selected.
      window.prompt('Copy this link:', url)
    }
  }

  // Convert eligibility — UI-side mirror of the server gates. Server is the
  // authoritative check (re-validated under an advisory lock); these
  // computed flags just decide whether to render the button as enabled,
  // disabled-with-tooltip, or replaced by the "View closing" link.
  const alreadyConverted = Boolean(convertedClosingId)
  const canConvert =
    !alreadyConverted &&
    companyVerified &&
    hasBorrowerEmail &&
    status !== 'expired' &&
    status !== 'converted'
  const convertDisabledReason = alreadyConverted
    ? null
    : !companyVerified
    ? 'Your broker company must be verified before you can convert quotes. Contact your admin.'
    : !hasBorrowerEmail
    ? 'Add a borrower email on the quote to convert.'
    : status === 'expired'
    ? 'This quote has expired.'
    : status === 'converted'
    ? 'This quote has already been converted.'
    : null

  async function onConvert() {
    if (!canConvert || converting) return
    if (
      !confirm(
        'Convert this quote into a real closing? This creates a Closing file ' +
          'and emails the borrower a welcome message if they don’t already ' +
          'have an account.',
      )
    ) {
      return
    }
    setConverting(true)
    setConvertError(null)
    try {
      const res = await fetch(`/api/broker/quotes/${quoteId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setConvertError(json.error || `Failed (${res.status})`)
        return
      }
      // Success — refresh so the detail page picks up convertedClosingId
      // and re-renders the "View closing" link in place of the button.
      router.refresh()
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        type="button"
        disabled={!canSend || sending}
        onClick={onSend}
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          canSend
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
            : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
        }`}
        title={
          !hasBorrowerEmail
            ? 'Add a borrower email on the quote to send.'
            : status === 'converted'
            ? 'This quote was converted to a closing.'
            : status === 'expired'
            ? 'This quote has expired.'
            : undefined
        }
      >
        {sending ? '…' : sendLabel}
      </button>

      <button
        type="button"
        onClick={onCopyLink}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:border-gray-400"
      >
        {copied ? 'Copied!' : 'Copy share link'}
      </button>

      {alreadyConverted && convertedClosingId ? (
        <a
          href={`/teammate/dashboard/${convertedClosingId}`}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
        >
          View closing →
        </a>
      ) : canConvert ? (
        <button
          type="button"
          disabled={converting}
          onClick={onConvert}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {converting ? 'Converting…' : 'Convert to closing'}
        </button>
      ) : (
        <span
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed"
          title={convertDisabledReason || undefined}
        >
          Convert to closing
        </span>
      )}

      {sendMsg && (
        <span className="text-xs text-emerald-700">{sendMsg}</span>
      )}
      {sendError && (
        <span className="text-xs text-red-700">{sendError}</span>
      )}
      {convertError && (
        <span className="text-xs text-red-700">{convertError}</span>
      )}
    </div>
  )
}
