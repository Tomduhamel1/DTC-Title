'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  buildShareMessage,
  generateRefId,
  logShareEvent,
} from '@/lib/lender-request-stub'
import LenderRequestForm from './LenderRequestForm'

interface ShareWithTeamSheetProps {
  open: boolean
  onClose: () => void
  savingsEstimate?: number
  source: string
}

type View = 'menu' | 'we-email'

export default function ShareWithTeamSheet({
  open,
  onClose,
  savingsEstimate,
  source,
}: ShareWithTeamSheetProps) {
  const [view, setView] = useState<View>('menu')
  const [toast, setToast] = useState<string | null>(null)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const refId = useMemo(() => generateRefId(), [])

  const message = useMemo(
    () => buildShareMessage({ savingsEstimate, refId }),
    [savingsEstimate, refId]
  )

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  // Reset to menu whenever sheet reopens
  useEffect(() => {
    if (open) setView('menu')
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

  const handleSms = () => {
    logShareEvent({ channel: 'sms', refId, source, savingsEstimate })
    const href = `sms:?&body=${encodeURIComponent(message.full)}`
    window.location.href = href
  }

  const handleMailto = () => {
    logShareEvent({ channel: 'mailto', refId, source, savingsEstimate })
    const subject = encodeURIComponent("Let's use BetterClose for our closing")
    const body = encodeURIComponent(message.full)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleCopy = async () => {
    logShareEvent({ channel: 'copy_link', refId, source, savingsEstimate })
    try {
      await navigator.clipboard.writeText(message.full)
      showToast('Link copied. Paste it anywhere.')
    } catch {
      showToast('Could not copy — please try another option.')
    }
  }

  const handleNativeShare = async () => {
    logShareEvent({ channel: 'native_share', refId, source, savingsEstimate })
    try {
      await navigator.share({
        title: 'BetterClose for our closing',
        text: message.text,
        url: message.url,
      })
    } catch {
      // user canceled
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
              {view === 'menu' ? 'Send a link to BetterClose' : "We'll email your lender"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {view === 'menu'
                ? 'Choose how you’d like to share.'
                : 'Pre-written, professional. We CC you.'}
            </p>
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
              icon="📱"
              title="Text it (SMS)"
              hint="Opens your messages app"
              onClick={handleSms}
            />
            <ChannelRow
              icon="✉️"
              title="Email it (your mail app)"
              hint="Opens your email app, prefilled"
              onClick={handleMailto}
            />
            <ChannelRow
              icon="✨"
              title="We’ll email your lender for you"
              hint="Pre-written, professional. We CC you."
              onClick={() => setView('we-email')}
              highlight
            />
            <ChannelRow
              icon="🔗"
              title="Copy link"
              hint="Paste it anywhere"
              onClick={handleCopy}
            />
            {canNativeShare && (
              <ChannelRow
                icon="📤"
                title="More…"
                hint="WhatsApp, Slack, anything"
                onClick={handleNativeShare}
              />
            )}
          </div>
        ) : (
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
  icon: string
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
      <span className="text-2xl flex-shrink-0" aria-hidden="true">
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
