'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  buildShareMessage,
  generateRefId,
  logShareEvent,
} from '@/lib/lender-request-stub'
import LenderRequestForm from './LenderRequestForm'
import TrackThisClosingPrompt from './TrackThisClosingPrompt'

interface ShareWithTeamSheetProps {
  open: boolean
  onClose: () => void
  savingsEstimate?: number
  source: string
}

type View = 'menu' | 'we-email' | 'shared'

export default function ShareWithTeamSheet({
  open,
  onClose,
  savingsEstimate,
  source,
}: ShareWithTeamSheetProps) {
  const [view, setView] = useState<View>('menu')
  const [sharedChannel, setSharedChannel] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const refId = useMemo(() => generateRefId(), [])

  const message = useMemo(
    () => buildShareMessage({ savingsEstimate, refId }),
    [savingsEstimate, refId]
  )

  // Reset to menu whenever sheet reopens
  useEffect(() => {
    if (open) {
      setView('menu')
      setSharedChannel(null)
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const goToShared = (channel: string) => {
    // Stash the refId so the post-share sign-up can claim this invite onto
    // the new account once auth completes.
    try {
      sessionStorage.setItem('pendingInviteClaim', refId)
    } catch {}
    setSharedChannel(channel)
    setView('shared')
  }

  const handleSms = () => {
    logShareEvent({ channel: 'sms', refId, source, savingsEstimate })
    const href = `sms:?&body=${encodeURIComponent(message.full)}`
    window.open(href, '_blank')
    goToShared('sms')
  }

  const handleMailto = () => {
    logShareEvent({ channel: 'mailto', refId, source, savingsEstimate })
    const subject = encodeURIComponent("Let's use BetterClose for our closing")
    const body = encodeURIComponent(message.full)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
    goToShared('mailto')
  }

  const handleCopy = async () => {
    logShareEvent({ channel: 'copy_link', refId, source, savingsEstimate })
    try {
      await navigator.clipboard.writeText(message.full)
      goToShared('copy_link')
    } catch {
      showToast('Could not copy — please try another option.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send a link to BetterClose"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_240ms_ease-out] sm:animate-[fadeIn_200ms_ease-out] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-dark-900">
              {view === 'menu'
                ? 'Send a link to BetterClose'
                : view === 'we-email'
                ? "We'll email your lender"
                : 'Done — one more step'}
            </h2>
            {view !== 'shared' && (
              <p className="text-sm text-gray-500 mt-0.5">
                {view === 'menu'
                  ? "Choose how you'd like to share BetterClose with your lender, broker, or agent."
                  : 'Pre-written, professional. We CC you.'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {view === 'menu' ? (
          <div className="p-3">
            <ChannelRow
              icon={<MailIcon />}
              title="Email it from your inbox"
              hint="Recommended — comes directly from you, not us"
              onClick={handleMailto}
              highlight
            />
            <ChannelRow
              icon={<SmsIcon />}
              title="Text it (SMS)"
              hint="Opens your messages app"
              onClick={handleSms}
            />
            <ChannelRow
              icon={<LinkIcon />}
              title="Copy link"
              hint="Paste it anywhere"
              onClick={handleCopy}
            />
            <ChannelRow
              icon={<SparkleIcon />}
              title="We'll send it on your behalf"
              hint="Last resort — easier to ignore than a note from you"
              onClick={() => setView('we-email')}
            />
          </div>
        ) : view === 'we-email' ? (
          <div className="p-6">
            <button
              onClick={() => setView('menu')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to share options
            </button>
            <LenderRequestForm
              refId={refId}
              source={source}
              savingsEstimate={savingsEstimate}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-2 mb-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-3 animate-[pop_320ms_ease-out]">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-900 mb-1.5">
                {sharedChannel === 'copy_link'
                  ? 'Link copied!'
                  : sharedChannel === 'sms'
                  ? 'Message ready to send'
                  : sharedChannel === 'mailto'
                  ? 'Email ready to send'
                  : 'Shared!'}
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                {sharedChannel === 'copy_link'
                  ? 'Paste it wherever you talk to your team — text, email, Slack, anywhere.'
                  : sharedChannel === 'sms'
                  ? "We opened your messages app with the link prefilled. Hit send when you're ready."
                  : sharedChannel === 'mailto'
                  ? "We opened your email app with the link prefilled. Hit send when you're ready."
                  : 'Nice — your team has the link.'}
              </p>
            </div>
            <TrackThisClosingPrompt />
            <button
              onClick={() => setView('menu')}
              className="block mx-auto mt-4 text-xs text-gray-500 hover:text-gray-700"
            >
              Send to someone else
            </button>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg z-[110]"
          >
            {toast}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function ChannelRow({
  icon,
  title,
  hint,
  onClick,
  highlight = false,
}: {
  icon: React.ReactNode
  title: string
  hint: string
  onClick: () => void
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-colors ${
        highlight ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full ${
          highlight ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-700'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-dark-900">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{hint}</div>
      </div>
      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

const baseIconProps = {
  className: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  strokeWidth: 1.75,
} as const

function SmsIcon() {
  return (
    <svg {...baseIconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg {...baseIconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg {...baseIconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3.5 8L24 13l-7.5 2L13 23l-3.5-8L2 13l7.5-2L13 3z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg {...baseIconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}
