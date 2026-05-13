'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Client-side inline picker for the "How are you involved in this closing?"
// prompt on /teammate/dashboard. Renders one block per unknown-role
// TeammateClosing row passed in via props. Each block has a 4-option
// selector. On selection, PATCHes /api/teammate/closings/[id]/role.
//
// After a successful save of role='broker' or 'lender', if the user has no
// BrokerMembership (hasBrokerMembership=false), shows a soft mailto CTA
// pointing at partners@betterclose.co. No auto-grant of portal access.
//
// router.refresh() runs after every successful save so the parent server
// page recomputes unknownRows and the banner clears naturally when all rows
// have a concrete role.

interface UnknownRow {
  membershipId: string
  closingId: string
  propertyAddress: string | null
  borrowerLabel: string | null
}

interface Props {
  rows: UnknownRow[]
  hasBrokerMembership: boolean
}

type Role = 'broker' | 'lender' | 'realtor' | 'unknown'

interface Option {
  label: string
  role: Role
}

const OPTIONS: Option[] = [
  { label: 'Mortgage broker', role: 'broker' },
  { label: 'Loan officer / lender', role: 'lender' },
  { label: 'Real estate agent', role: 'realtor' },
  { label: 'Other closing team member', role: 'unknown' },
]

interface SavedState {
  role: Role
  // True when the soft "Request portal access" CTA should appear for this row
  // (broker/lender selected + user has no BrokerMembership).
  showPortalCta: boolean
}

export default function RoleSelfIdentifyPicker({ rows, hasBrokerMembership }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [saved, setSaved] = useState<Record<string, SavedState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSelect(membershipId: string, role: Role) {
    if (busyId) return
    setBusyId(membershipId)
    setErrors((e) => ({ ...e, [membershipId]: '' }))
    try {
      const res = await fetch(`/api/teammate/closings/${membershipId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors((e) => ({ ...e, [membershipId]: json.error || `Failed (${res.status})` }))
        return
      }
      const showPortalCta =
        (role === 'broker' || role === 'lender') && !hasBrokerMembership
      setSaved((s) => ({ ...s, [membershipId]: { role, showPortalCta } }))
      // Refresh server props so the banner recomputes unknown count and clears
      // when the last unknown row is upgraded to a concrete role.
      router.refresh()
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [membershipId]: err instanceof Error ? err.message : 'Network error',
      }))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const savedState = saved[row.membershipId]
        const fileLabel =
          row.propertyAddress || row.borrowerLabel || 'BetterClose file'
        const err = errors[row.membershipId]

        return (
          <div
            key={row.membershipId}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              File
            </div>
            <div className="text-sm font-bold text-dark-900 mb-3 truncate">
              {fileLabel}
            </div>

            {savedState ? (
              <SavedRow state={savedState} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.role + opt.label}
                    type="button"
                    disabled={busyId === row.membershipId}
                    onClick={() => onSelect(row.membershipId, opt.role)}
                    className="text-left text-sm px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {err && (
              <div className="mt-2 text-xs text-red-700">{err}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SavedRow({ state }: { state: SavedState }) {
  const niceLabel =
    state.role === 'broker'
      ? 'Mortgage broker'
      : state.role === 'lender'
      ? 'Loan officer / lender'
      : state.role === 'realtor'
      ? 'Real estate agent'
      : 'Other closing team member'

  return (
    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-900">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">✓</span>
        <span>
          Saved as <strong>{niceLabel}</strong>.
        </span>
      </div>
      {state.showPortalCta && (
        <div className="mt-2 text-emerald-900 text-[13px] leading-relaxed">
          Want to create quotes and track all your BetterClose files?{' '}
          <a
            href="mailto:partners@betterclose.co?subject=Broker%20portal%20access%20request&body=Hi%20BetterClose%20team%2C%0A%0AWe%27d%20like%20to%20request%20access%20to%20the%20broker%2FLO%20portal.%0A%0ACompany%20name%3A%0ANPN%3A%0AState%20licenses%3A%0AApproximate%20monthly%20closings%3A%0AHow%20you%20found%20us%3A%0A%0AThanks%2C%0A"
            className="font-bold underline underline-offset-2 hover:text-emerald-700"
          >
            Request broker/LO portal access →
          </a>
        </div>
      )}
    </div>
  )
}
