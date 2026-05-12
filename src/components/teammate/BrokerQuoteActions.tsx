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
}

// Action row on the broker quote detail page. Replaces the disabled
// placeholders from PR 5 with:
//   - Send to borrower / Resend (real, wired)
//   - Copy share link (client-only clipboard write)
//   - Convert to closing (still disabled, lands in a later PR)

export default function BrokerQuoteActions({
  quoteId,
  status,
  shareToken,
  hasBorrowerEmail,
  publicViewBaseUrl,
}: Props) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

      <span
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed"
        title="Quote-to-closing conversion arrives in a later PR."
      >
        Convert to closing (coming soon)
      </span>

      {sendMsg && (
        <span className="text-xs text-emerald-700">{sendMsg}</span>
      )}
      {sendError && (
        <span className="text-xs text-red-700">{sendError}</span>
      )}
    </div>
  )
}
