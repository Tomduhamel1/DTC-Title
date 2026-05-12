'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompanyShape {
  id: string
  name: string
  slug: string
  primaryDomain: string | null
  notes: string | null
  verifiedAt: string | null
}

interface MemberShape {
  id: string
  role: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
    accountType: string
  }
}

interface Props {
  company: CompanyShape
  members: MemberShape[]
}

// Detail-page editor. Three sections:
//   1. Company fields (name/slug/primaryDomain/notes) — PATCH on save.
//   2. Verified toggle — PATCH { verified: bool }.
//   3. Members — list + add-by-email form + remove buttons.
//
// All saves are explicit (no auto-save) to keep behavior predictable.

export default function BrokerCompanyEditor({ company, members }: Props) {
  const router = useRouter()
  const [draft, setDraft] = useState({
    name: company.name,
    slug: company.slug,
    primaryDomain: company.primaryDomain ?? '',
    notes: company.notes ?? '',
  })
  const [fieldsSaving, setFieldsSaving] = useState(false)
  const [fieldsError, setFieldsError] = useState<string | null>(null)
  const [fieldsSavedAt, setFieldsSavedAt] = useState<Date | null>(null)

  const [verifiedSaving, setVerifiedSaving] = useState(false)
  const [verifiedError, setVerifiedError] = useState<string | null>(null)

  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<'member' | 'owner'>('member')
  const [memberAdding, setMemberAdding] = useState(false)
  const [memberAddMsg, setMemberAddMsg] = useState<string | null>(null)
  const [memberAddError, setMemberAddError] = useState<string | null>(null)

  const [removing, setRemoving] = useState<string | null>(null)

  const dirty =
    draft.name !== company.name ||
    draft.slug !== company.slug ||
    draft.primaryDomain !== (company.primaryDomain ?? '') ||
    draft.notes !== (company.notes ?? '')

  async function saveFields() {
    setFieldsSaving(true)
    setFieldsError(null)
    try {
      const res = await fetch(`/api/admin/broker-companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          slug: draft.slug,
          primaryDomain: draft.primaryDomain || null,
          notes: draft.notes || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFieldsError(json.error || `Failed (${res.status})`)
        return
      }
      setFieldsSavedAt(new Date())
      router.refresh()
    } finally {
      setFieldsSaving(false)
    }
  }

  async function toggleVerified() {
    const next = !company.verifiedAt
    setVerifiedSaving(true)
    setVerifiedError(null)
    try {
      const res = await fetch(`/api/admin/broker-companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: next }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setVerifiedError(json.error || `Failed (${res.status})`)
        return
      }
      router.refresh()
    } finally {
      setVerifiedSaving(false)
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault()
    if (!newMemberEmail.trim() || memberAdding) return
    setMemberAdding(true)
    setMemberAddError(null)
    setMemberAddMsg(null)
    try {
      const res = await fetch(`/api/admin/broker-companies/${company.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMemberEmail.trim(),
          name: newMemberName.trim() || undefined,
          role: newMemberRole,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMemberAddError(json.error || `Failed (${res.status})`)
        return
      }
      const flags: string[] = []
      if (json.userCreated) flags.push('user row created')
      if (json.accountTypeUpgraded) flags.push('accountType → professional')
      if (json.membershipCreated) flags.push('membership added')
      else flags.push('already a member')
      setMemberAddMsg(flags.join(' · '))
      setNewMemberEmail('')
      setNewMemberName('')
      setNewMemberRole('member')
      router.refresh()
    } finally {
      setMemberAdding(false)
    }
  }

  async function removeMember(membershipId: string) {
    if (!confirm('Remove this membership? (User row + accountType are preserved.)')) return
    setRemoving(membershipId)
    try {
      const res = await fetch(
        `/api/admin/broker-companies/${company.id}/members/${membershipId}`,
        { method: 'DELETE' },
      )
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        alert(json.error || `Failed (${res.status})`)
        return
      }
      router.refresh()
    } finally {
      setRemoving(null)
    }
  }

  return (
    <>
      {/* Fields */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm font-bold text-dark-900">Company details</h3>
          {fieldsSavedAt && !dirty && (
            <span className="text-[11px] text-emerald-700">
              Saved {fieldsSavedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="Slug">
            <input
              type="text"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 font-mono"
            />
          </Field>
          <Field label="Primary domain (informational)">
            <input
              type="text"
              value={draft.primaryDomain}
              onChange={(e) => setDraft({ ...draft, primaryDomain: e.target.value })}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
          <Field label="Notes (admin only)">
            <input
              type="text"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            />
          </Field>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            disabled={!dirty || fieldsSaving}
            onClick={saveFields}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-bold disabled:opacity-50"
          >
            {fieldsSaving ? 'Saving…' : 'Save'}
          </button>
          {fieldsError && <span className="text-sm text-red-700">{fieldsError}</span>}
        </div>
      </div>

      {/* Verified */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-bold text-dark-900">Verification</h3>
            <p className="text-xs text-gray-500 mt-1">
              Future broker→Closing conversion will require this company to be verified.
              {company.verifiedAt
                ? ` Verified at ${new Date(company.verifiedAt).toLocaleString()}.`
                : ' Not verified yet.'}
            </p>
          </div>
          <button
            type="button"
            disabled={verifiedSaving}
            onClick={toggleVerified}
            className={`px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 ${
              company.verifiedAt
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {verifiedSaving
              ? 'Saving…'
              : company.verifiedAt
              ? 'Mark unverified'
              : 'Mark verified'}
          </button>
        </div>
        {verifiedError && <p className="text-sm text-red-700 mt-2">{verifiedError}</p>}
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-baseline justify-between">
          <h3 className="text-sm font-bold text-dark-900">Members ({members.length})</h3>
          <span className="text-[10px] text-gray-500">Idempotent — re-adding same email is a no-op</span>
        </div>

        {/* Add form */}
        <form onSubmit={addMember} className="px-5 py-4 border-b border-gray-100 grid sm:grid-cols-12 gap-2 items-end">
          <div className="sm:col-span-5">
            <Field label="Email">
              <input
                type="email"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="broker@example.com"
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
              />
            </Field>
          </div>
          <div className="sm:col-span-4">
            <Field label="Name (optional, only used if creating a new User)">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Role">
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as 'member' | 'owner')}
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 bg-white"
              >
                <option value="member">member</option>
                <option value="owner">owner</option>
              </select>
            </Field>
          </div>
          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={!newMemberEmail.trim() || memberAdding}
              className="w-full px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-bold disabled:opacity-50"
            >
              {memberAdding ? '…' : 'Add'}
            </button>
          </div>
          {memberAddMsg && (
            <div className="sm:col-span-12 text-xs text-emerald-700">{memberAddMsg}</div>
          )}
          {memberAddError && (
            <div className="sm:col-span-12 text-xs text-red-700">{memberAddError}</div>
          )}
        </form>

        {members.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No members yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map((m) => (
              <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <a
                      href={`/admin/users/${m.user.id}`}
                      className="font-semibold text-dark-900 hover:text-primary-600 truncate"
                    >
                      {m.user.email}
                    </a>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {m.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        m.user.accountType === 'professional'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.user.accountType === 'admin'
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.user.accountType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {m.user.name || '(no name)'}
                    {' · added '}
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={removing === m.id}
                  onClick={() => removeMember(m.id)}
                  className="text-xs text-red-700 hover:underline disabled:opacity-50"
                >
                  {removing === m.id ? 'Removing…' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </span>
      {children}
    </label>
  )
}
