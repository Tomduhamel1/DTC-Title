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
  // Whether the quote already has the full minimum order set required to
  // convert (borrower name + email + full property address). When false and
  // the broker clicks Convert, the "Complete order details" panel opens.
  hasMinimumOrderFields: boolean
  // Current borrower/property values, so the panel prefills what's known and
  // only asks for blanks.
  initial: {
    borrowerName: string | null
    borrowerEmail: string | null
    borrowerPhone: string | null
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
  }
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
  hasMinimumOrderFields,
  initial,
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
  // then add details at the moment they Send or Convert. We track locally
  // whether email is present (gates Send) and whether the full minimum order
  // set is present (gates Convert), so the buttons flip live after a save.
  const [emailPresent, setEmailPresent] = useState(hasBorrowerEmail)
  const [orderComplete, setOrderComplete] = useState(hasMinimumOrderFields)
  // The action the broker intended when they clicked while details were
  // missing, so we can auto-continue it after the panel saves.
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
    orderComplete &&
    status !== 'expired' &&
    status !== 'converted'
  // Whether convert is blocked ONLY by missing order details (vs. a hard
  // block like unverified company / expired). Missing details are recoverable
  // inline via the "Complete order details" panel; the others are not.
  const convertBlockedByMissingOrder =
    !alreadyConverted &&
    companyVerified &&
    !orderComplete &&
    status !== 'expired' &&
    status !== 'converted'
  const convertDisabledReason = alreadyConverted
    ? null
    : !companyVerified
    ? 'Your broker company must be verified before you can convert quotes. Contact your admin.'
    : !orderComplete
    ? 'Complete the order details (borrower + property address) to convert.'
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

  // Click intercepts: Send needs only borrower email; Convert needs the full
  // minimum order set. If what's required for the action is missing, open the
  // details panel and remember which action to continue after saving.
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
    if (canConvert) {
      onConvert()
    } else if (convertBlockedByMissingOrder) {
      setPendingAction('convert')
      setPanelOpen(true)
    }
    // Hard blocks (unverified/expired) don't render a clickable button.
  }

  // Called by the details panel after a successful PATCH. Flip the local
  // gates true, close the panel, and auto-continue the intended action. Send
  // needs only email; convert needs the full set — the panel enforces the
  // right requirement per action before calling this.
  function onDetailsSaved() {
    setEmailPresent(true)
    if (pendingAction === 'convert') setOrderComplete(true)
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
  // order details (panel-recoverable). Hard blocks (unverified/expired) stay
  // disabled.
  const convertClickable = canConvert || convertBlockedByMissingOrder

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
              convertBlockedByMissingOrder
                ? 'We’ll ask for the order details, then convert.'
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
        <CompleteOrderDetailsPanel
          quoteId={quoteId}
          intendedAction={pendingAction}
          initial={initial}
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

// Inline panel shown when a broker tries to Send/Convert a quote that's
// missing the details that action requires. PATCHes the existing quote (no
// rerun, fee report untouched), then the parent auto-continues the action.
//
// Requirement differs by action:
//   - send    → borrower email only (lighter)
//   - convert → full minimum order set: borrower name + email + full property
//               address (address, city, state, ZIP)
// Fields prefill from the quote's current values; the broker only fills blanks.
function CompleteOrderDetailsPanel({
  quoteId,
  intendedAction,
  initial,
  onCancel,
  onSaved,
}: {
  quoteId: string
  intendedAction: 'send' | 'convert' | null
  initial: {
    borrowerName: string | null
    borrowerEmail: string | null
    borrowerPhone: string | null
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
  }
  onCancel: () => void
  onSaved: () => void
}) {
  const isConvert = intendedAction === 'convert'

  const [name, setName] = useState(initial.borrowerName ?? '')
  const [email, setEmail] = useState(initial.borrowerEmail ?? '')
  const [phone, setPhone] = useState(initial.borrowerPhone ?? '')
  const [address, setAddress] = useState(initial.propertyAddress ?? '')
  const [city, setCity] = useState(initial.propertyCity ?? '')
  const [stateCode, setStateCode] = useState(initial.propertyState ?? '')
  const [zip, setZip] = useState(initial.propertyZip ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const zipValid = /^\d{5}$/.test(zip.trim())

  // Send needs only a valid email. Convert needs the full minimum order set.
  const ready = isConvert
    ? emailValid &&
      name.trim().length > 0 &&
      address.trim().length > 0 &&
      city.trim().length > 0 &&
      stateCode.trim().length > 0 &&
      zipValid
    : emailValid

  const continueLabel = isConvert ? 'Save & convert' : 'Save & send'
  const heading = isConvert ? 'Complete order details' : 'Add borrower details'

  async function onSave() {
    if (!ready || saving) return
    setSaving(true)
    setError(null)
    try {
      const body: Record<string, string | null> = {
        borrowerName: name.trim() || null,
        borrowerEmail: email.trim(),
        borrowerPhone: phone.trim() || null,
      }
      if (isConvert) {
        body.propertyAddress = address.trim() || null
        body.propertyCity = city.trim() || null
        body.propertyState = stateCode.trim() || null
        body.propertyZip = zip.trim() || null
      }
      const res = await fetch(`/api/broker/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  const inputCls = 'text-sm rounded-lg border border-gray-300 px-3 py-2'

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
        {heading}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isConvert ? 'Borrower name (required)' : 'Borrower name'}
          className={inputCls}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Borrower email (required)"
          className={inputCls}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className={inputCls}
        />
      </div>

      {isConvert && (
        <div className="grid sm:grid-cols-4 gap-2 mt-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Property address (required)"
            className={`${inputCls} sm:col-span-2`}
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (required)"
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              maxLength={2}
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="State"
              className={`${inputCls} uppercase font-mono`}
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
              placeholder="ZIP"
              className={`${inputCls} font-mono`}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          type="button"
          disabled={!ready || saving}
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
        {!ready && (
          <span className="text-xs text-gray-500">
            {isConvert
              ? 'Borrower name + email and full property address are required to convert.'
              : 'Enter a valid borrower email.'}
          </span>
        )}
        {error && <span className="text-xs text-red-700">{error}</span>}
      </div>
    </div>
  )
}
