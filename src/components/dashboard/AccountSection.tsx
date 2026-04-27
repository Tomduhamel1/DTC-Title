'use client'

import { useState } from 'react'
import ShareWithTeamSheet from '@/components/lender-request/ShareWithTeamSheet'
import SectionShell from './SectionShell'
import StatusNode, { type StepStatus } from './StatusNode'
import { AccountIcon } from './SectionIcons'

export type AccountStepKey = 'account' | 'invite' | 'order'

export type AccountStep = {
  key: AccountStepKey
  status: StepStatus
  title: string
  detail: string
  completedAt?: Date | string | null
}

interface AccountSectionProps {
  accountSteps: AccountStep[]
}

export default function AccountSection({ accountSteps }: AccountSectionProps) {
  const [shareOpen, setShareOpen] = useState(false)

  const inviteStep = accountSteps.find((s) => s.key === 'invite')
  const orderStep = accountSteps.find((s) => s.key === 'order')
  const showPrimaryCta = inviteStep?.status === 'active'
  const showResendCtas = inviteStep?.status === 'done' && orderStep?.status === 'active'

  return (
    <>
      <SectionShell title="BetterClose Account" icon={<AccountIcon />} iconBare>
        <ol className="space-y-5">
          {accountSteps.map((step) => (
            <li key={step.key} className="flex gap-3">
              <div className="flex-shrink-0 pt-0.5">
                <StatusNode status={step.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[15px] leading-tight ${
                    step.status === 'pending'
                      ? 'text-gray-400'
                      : step.status === 'active'
                      ? 'font-bold text-dark-900'
                      : 'font-semibold text-dark-900'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-[12px] mt-0.5 ${
                    step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {step.detail}
                </div>

                {step.key === 'invite' && showPrimaryCta && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShareOpen(true)}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-colors"
                    >
                      Send BetterClose to my team →
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Takes 30 seconds. Text, email, or copy a link — your choice.
                    </p>
                  </div>
                )}

                {step.key === 'invite' && showResendCtas && (
                  <div className="mt-3 flex flex-wrap gap-2">
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
                )}
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="dashboard_account"
      />
    </>
  )
}
