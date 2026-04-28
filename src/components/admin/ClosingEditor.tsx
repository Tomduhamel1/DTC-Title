'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MILESTONE_KINDS, MILESTONE_LABELS, type MilestoneKind } from '@/lib/closing'

type Status = 'pending' | 'active' | 'done'

interface MilestoneShape {
  id: string
  kind: string
  status: string
  completedAt: string | Date | null
  notifiedAt: string | Date | null
}

interface ClosingShape {
  id: string
  status: string
  propertyAddress: string | null
  propertyCity: string | null
  propertyState: string | null
  propertyZip: string | null
  propertyType: string | null
  salePrice: number | null
  loanAmount: number | null
  closingDate: string | Date | null
  borrowerEmail: string | null
  borrowerPhone: string | null
  lenderName: string | null
  lenderCompany: string | null
  lenderEmail: string | null
  lenderPhone: string | null
  lenderNmls: string | null
  agentName: string | null
  agentCompany: string | null
  agentEmail: string | null
  agentPhone: string | null
  titleUnderwriter: string | null
  titlePolicyNo: string | null
  closingLocation: string | null
  milestones: MilestoneShape[]
}

export default function ClosingEditor({ closing }: { closing: ClosingShape }) {
  const router = useRouter()
  const [draft, setDraft] = useState<Record<string, string>>(() => initialDraft(closing))
  const [savingFields, setSavingFields] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [milestoneSaving, setMilestoneSaving] = useState<string | null>(null)
  const [lastEmailNotice, setLastEmailNotice] = useState<string | null>(null)

  const onField = (key: string, value: string) => setDraft({ ...draft, [key]: value })

  const onSaveFields = async () => {
    setSavingFields(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(draft)) {
        // Empty strings become null so admin can clear a field.
        payload[k] = v === '' ? null : v
      }
      const res = await fetch(`/api/admin/closing/${closing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`update failed: ${res.status}`)
      setSavedAt(new Date())
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'save failed')
    } finally {
      setSavingFields(false)
    }
  }

  const onMilestone = async (kind: MilestoneKind, status: Status) => {
    setMilestoneSaving(kind)
    setLastEmailNotice(null)
    try {
      const res = await fetch(`/api/admin/closing/${closing.id}/milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `update failed: ${res.status}`)
      if (json.emailed) {
        setLastEmailNotice(
          kind === 'closed'
            ? `Sent the closing-completed email${json.snapshotted ? ' (with savings snapshot)' : ' (no snapshot — check inputs)'}.`
            : `Sent the "${MILESTONE_LABELS[kind]}" update email.`,
        )
      }
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'milestone update failed')
    } finally {
      setMilestoneSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <Section title="Property">
        <Grid>
          <TextField label="Address" value={draft.propertyAddress} onChange={(v) => onField('propertyAddress', v)} className="sm:col-span-2" />
          <TextField label="City" value={draft.propertyCity} onChange={(v) => onField('propertyCity', v)} />
          <TextField label="State" value={draft.propertyState} onChange={(v) => onField('propertyState', v)} />
          <TextField label="ZIP" value={draft.propertyZip} onChange={(v) => onField('propertyZip', v)} />
          <SelectField
            label="Type"
            value={draft.propertyType}
            options={[
              { value: '', label: '—' },
              { value: 'purchase', label: 'Purchase' },
              { value: 'refinance', label: 'Refinance' },
            ]}
            onChange={(v) => onField('propertyType', v)}
          />
          <TextField label="Sale price ($)" value={draft.salePrice} onChange={(v) => onField('salePrice', v)} />
          <TextField label="Loan amount ($)" value={draft.loanAmount} onChange={(v) => onField('loanAmount', v)} />
          <TextField label="Closing date" type="date" value={draft.closingDate} onChange={(v) => onField('closingDate', v)} />
        </Grid>
      </Section>

      <Section title="Borrower">
        <Grid>
          <TextField label="Email" type="email" value={draft.borrowerEmail} onChange={(v) => onField('borrowerEmail', v)} />
          <TextField label="Phone" type="tel" value={draft.borrowerPhone} onChange={(v) => onField('borrowerPhone', v)} />
        </Grid>
      </Section>

      <Section title="Lender / loan officer">
        <Grid>
          <TextField label="Name" value={draft.lenderName} onChange={(v) => onField('lenderName', v)} />
          <TextField label="Company" value={draft.lenderCompany} onChange={(v) => onField('lenderCompany', v)} />
          <TextField label="Email" type="email" value={draft.lenderEmail} onChange={(v) => onField('lenderEmail', v)} />
          <TextField label="Phone" type="tel" value={draft.lenderPhone} onChange={(v) => onField('lenderPhone', v)} />
          <TextField label="NMLS" value={draft.lenderNmls} onChange={(v) => onField('lenderNmls', v)} />
        </Grid>
      </Section>

      <Section title="Agent">
        <Grid>
          <TextField label="Name" value={draft.agentName} onChange={(v) => onField('agentName', v)} />
          <TextField label="Company" value={draft.agentCompany} onChange={(v) => onField('agentCompany', v)} />
          <TextField label="Email" type="email" value={draft.agentEmail} onChange={(v) => onField('agentEmail', v)} />
          <TextField label="Phone" type="tel" value={draft.agentPhone} onChange={(v) => onField('agentPhone', v)} />
        </Grid>
      </Section>

      <Section title="Title">
        <Grid>
          <TextField label="Underwriter" value={draft.titleUnderwriter} onChange={(v) => onField('titleUnderwriter', v)} />
          <TextField label="Policy number" value={draft.titlePolicyNo} onChange={(v) => onField('titlePolicyNo', v)} />
          <TextField label="Closing location" value={draft.closingLocation} onChange={(v) => onField('closingLocation', v)} className="sm:col-span-2" />
        </Grid>
      </Section>

      <Section title="Closing status (overall)">
        <SelectField
          label="Status"
          value={draft.status}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'active', label: 'Active' },
            { value: 'closed', label: 'Closed' },
          ]}
          onChange={(v) => onField('status', v)}
        />
        <p className="text-xs text-gray-500 mt-2">
          Note: marking the <strong>Closed</strong> milestone below also flips
          this to <code>closed</code> and sends the celebratory email.
        </p>
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-lg px-5 py-3">
        <button
          onClick={onSaveFields}
          disabled={savingFields}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {savingFields ? 'Saving…' : 'Save changes'}
        </button>
        {savedAt && (
          <span className="text-xs text-emerald-700 font-semibold">
            Saved at {savedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      <Section title="Milestones">
        <p className="text-xs text-gray-500 mb-4">
          Marking a milestone as <strong>Done</strong> sends the borrower an
          email — but only on the first transition (we track <code>notifiedAt</code>).
          The Closed milestone also snapshots the fee report and includes the
          savings summary in its email.
        </p>
        {lastEmailNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-2 text-sm font-semibold mb-4">
            ✓ {lastEmailNotice}
          </div>
        )}
        <div className="space-y-3">
          {MILESTONE_KINDS.map((kind) => {
            const m = closing.milestones.find((x) => x.kind === kind)
            const status = (m?.status || 'pending') as Status
            return (
              <div
                key={kind}
                className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div>
                  <div className="text-sm font-bold text-dark-900">{MILESTONE_LABELS[kind]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {m?.completedAt
                      ? `Completed ${new Date(m.completedAt).toLocaleDateString()}`
                      : 'Not yet completed'}
                    {m?.notifiedAt ? ` · emailed ${new Date(m.notifiedAt).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <div className="flex gap-1">
                  {(['pending', 'active', 'done'] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onMilestone(kind, s)}
                      disabled={milestoneSaving === kind}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        status === s
                          ? s === 'done'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : s === 'active'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-300 text-gray-700 border-gray-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────

function initialDraft(c: ClosingShape): Record<string, string> {
  const out: Record<string, string> = {}
  const keys = [
    'status',
    'propertyAddress','propertyCity','propertyState','propertyZip','propertyType',
    'salePrice','loanAmount','closingDate',
    'borrowerEmail','borrowerPhone',
    'lenderName','lenderCompany','lenderEmail','lenderPhone','lenderNmls',
    'agentName','agentCompany','agentEmail','agentPhone',
    'titleUnderwriter','titlePolicyNo','closingLocation',
  ] as const
  for (const k of keys) {
    const v = (c as unknown as Record<string, unknown>)[k]
    if (v == null) out[k] = ''
    else if (k === 'closingDate' && v instanceof Date) out[k] = v.toISOString().slice(0, 10)
    else if (k === 'closingDate' && typeof v === 'string') out[k] = v.slice(0, 10)
    else out[k] = String(v)
  }
  return out
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
