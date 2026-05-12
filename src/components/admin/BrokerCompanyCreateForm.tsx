'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Inline create form on /admin/broker-companies. Posts to
// /api/admin/broker-companies and refreshes the list on success.

export default function BrokerCompanyCreateForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [primaryDomain, setPrimaryDomain] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/broker-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          primaryDomain: primaryDomain.trim() || null,
          notes: notes.trim() || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || `Failed (${res.status})`)
        return
      }
      // Success — clear form and refresh the list. Don't navigate away;
      // admin may want to add another.
      setName('')
      setSlug('')
      setPrimaryDomain('')
      setNotes('')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
      <h3 className="text-sm font-bold text-dark-900 mb-3">New broker company</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cardinal Financial"
            className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </Field>
        <Field label="Slug (auto-derived if blank)">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="cardinal-financial"
            className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
          />
        </Field>
        <Field label="Primary domain (informational)">
          <input
            type="text"
            value={primaryDomain}
            onChange={(e) => setPrimaryDomain(e.target.value)}
            placeholder="cardinal.example"
            className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
          />
        </Field>
        <Field label="Notes (admin only)">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything ops should know"
            className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2"
          />
        </Field>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={!name.trim() || submitting}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-bold disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create company'}
        </button>
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  )
}
