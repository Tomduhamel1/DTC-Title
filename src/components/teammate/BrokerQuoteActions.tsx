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

  // Fast-quote support: a broker can generate a quote with only ZIP + amount,
  // then add borrower details at the moment they Send or Convert. We track
  // whether borrower email is present locally so the panel can flip the
  // buttons live after a save without a full reload.
  const [emailPresent, setEmailPresent] = useState(hasBorrowerEmail)
  // The action the broker intended when they clicked while email was missing,
  // so we can auto-continue it after the details panel saves.
  const [pendingAction, setPendingAction] = useState<'send' | 'convert' | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const canSend = emailPresent && status !== 'converted' && status !== 'expired'
  const isResend = status === 'sent' || status === 'viewed'
  const sendLabel = isResend ? 'Resend' : 'Send to borrower'

  async function onSend(force = false) {
    // `force` is used by the post-save auto-continue, where emailPresent has
    // just been set true but this closure may still see the stale value.
    if ((!force && !canSend) || sending) return
    if (status === 'converted' || status === 'expired') return
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
    emailPresent &&
    status !== 'expired' &&
    status !== 'converted'
  // Whether convert is blocked ONLY by missing borrower email (vs. a hard
  // block like unverified company / expired). Missing-email is recoverable
  // inline via the details panel; the others are not.
  const convertBlockedOnlyByEmail =
    !alreadyConverted &&
    companyVerified &&
    !emailPresent &&
    status !== 'expired' &&
    status !== 'converted'
  const convertDisabledReason = alreadyConverted
    ? null
    : !companyVerified
    ? 'Your broker company must be verified before you can convert quotes. Contact your admin.'
    : !emailPresent
    ? 'Add borrower details to convert.'
    : status === 'expired'
    ? 'This quote has expired.'
    : status === 'converted'
    ? 'This quote has already been converted.'
    : null

  async function onConvert(force = false) {
    // `force` (post-save auto-continue) bypasses the stale emailPresent guard;
    // the hard gates (verified company, not expired/converted) are still
    // enforced by the server under an advisory lock.
    if ((!force && !canConvert) || converting) return
    if (status === 'converted' || status === 'expired' || !companyVerified) return
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

  // Click intercepts: if borrower email is already present, run the action as
  // before. If it's missing, open the "Add borrower details" panel and
  // remember which action to continue after the details are saved.
  function handleSendClick() {
    if (status === 'converted' || status === 'expired') return
    if (emailPresent) {
      onSend()
    } else {
      setPendingAction('send')
      setPanelOpen(true)
    }
  }
  function handleConvertClick() {
    if (emailPresent) {
      onConvert()
    } else if (convertBlockedOnlyByEmail) {
      setPendingAction('convert')
      setPanelOpen(true)
    }
    // If convert is blocked for a hard reason (unverified/expired), the button
    // isn't rendered as clickable, so we never reach here for those.
  }

  // Called by the details panel after a successful PATCH. emailPresent flips
  // true, the panel closes, and we auto-continue the intended action.
  function onDetailsSaved() {
    setEmailPresent(true)
    setPanelOpen(false)
    const next = pendingAction
    setPendingAction(null)
    // Defer so state has settled before the follow-on action reads it.
    if (next === 'send') setTimeout(() => onSend(true), 0)
    else if (next === 'convert') setTimeout(() => onConvert(true), 0)
    router.refresh()
  }

  // Send is clickable whenever the quote isn't converted/expired — if email is
  // missing, the click opens the details panel instead of being a dead button.
  const sendClickable = status !== 'converted' && status !== 'expired'
  // Convert is clickable when it can convert OR is blocked only by missing
  // email (panel-recoverable). Hard blocks (unverified/expired) stay disabled.
  const convertClickable = canConvert || convertBlockedOnlyByEmail

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          disabled={!sendClickable || sending}
          onClick={handleSendClick}
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            sendClickable
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
              : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
          title={
            status === 'converted'
              ? 'This quote was converted to a closing.'
              : status === 'expired'
              ? 'This quote has expired.'
              : !emailPresent
              ? 'We’ll ask for borrower details, then send.'
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
        ) : convertClickable ? (
          <button
            type="button"
            disabled={converting}
            onClick={handleConvertClick}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            title={
              convertBlockedOnlyByEmail
                ? 'We’ll ask for borrower details, then convert.'
                : undefined
            }
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

      {panelOpen && (
        <AddBorrowerDetailsPanel
          quoteId={quoteId}
          intendedAction={pendingAction}
          onCancel={() => {
            setPanelOpen(false)
            setPendingAction(null)
          }}
          onSaved={onDetailsSaved}
        />
      )}
    </div>
  )
}

// Inline panel shown when a broker tries to Send/Convert a fast quote that has
// no borrower email yet. Collects name + email (+ optional phone), PATCHes the
// existing quote (no rerun, fee report untouched), then the parent
// auto-continues the intended action.
function AddBorrowerDetailsPanel({
  quoteId,
  intendedAction,
  onCancel,
  onSaved,
}: {
  quoteId: string
  intendedAction: 'send' | 'convert' | null
  onCancel: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const continueLabel =
    intendedAction === 'send'
      ? 'Save & send'
      : intendedAction === 'convert'
      ? 'Save & convert'
      : 'Save'

  async function onSave() {
    if (!emailValid || saving) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/broker/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: name.trim() || null,
          borrowerEmail: email.trim(),
          borrowerPhone: phone.trim() || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || `Failed (${res.status})`)
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
        Add borrower details
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Borrower name"
          className="text-sm rounded-lg border border-gray-300 px-3 py-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Borrower email (required)"
          className="text-sm rounded-lg border border-gray-300 px-3 py-2"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="text-sm rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          disabled={!emailValid || saving}
          onClick={onSave}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : continueLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-dark-900"
        >
          Cancel
        </button>
        {!emailValid && email.length > 0 && (
          <span className="text-xs text-gray-500">Enter a valid email.</span>
        )}
        {error && <span className="text-xs text-red-700">{error}</span>}
      </div>
    </div>
  )
}
