'use client'

import { useState } from 'react'
import ShareWithTeamSheet from '@/components/lender-request/ShareWithTeamSheet'
import SectionShell from './SectionShell'

interface AccountSectionProps {
  userEmail: string
  // Optional: when we wire up LenderRequest tracking, pass the most recent
  // invite here. For now this is always undefined and the section shows the
  // "no invite yet" state.
  lastInvite?: {
    lenderEmail: string
    sentAt: Date | string
    confirmed: boolean
  }
}

export default function AccountSection({ userEmail, lastInvite }: AccountSectionProps) {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <SectionShell number={1} title="BetterClose Account" emoji="🟢">
        {!lastInvite ? (
          <>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              You're signed in as <strong>{userEmail}</strong>. Now tell your lender or
              realtor that you'd like to use BetterClose for this closing — that's how
              the order gets to us.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Not yet sent
              </span>
              <span className="text-xs text-gray-500">No invite has been sent to your team.</span>
            </div>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-colors"
            >
              Send BetterClose to my team →
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Takes 30 seconds. Text, email, or copy a link — your choice.
            </p>
          </>
        ) : lastInvite.confirmed ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                ✓ Confirmed
              </span>
              <span className="text-xs text-gray-500">
                Your team is using BetterClose for this closing.
              </span>
            </div>
            <p className="text-sm text-gray-700">
              Order placed by <strong>{lastInvite.lenderEmail}</strong>.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                Sent
              </span>
              <span className="text-xs text-gray-500">
                Sent {new Date(lastInvite.sentAt).toLocaleDateString()} to{' '}
                <strong className="text-gray-700">{lastInvite.lenderEmail}</strong>
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              We'll mark this confirmed when your lender places the order.
              Haven't heard back?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Resend
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Send to a different lender
              </button>
            </div>
          </>
        )}
      </SectionShell>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="dashboard_account"
      />
    </>
  )
}

