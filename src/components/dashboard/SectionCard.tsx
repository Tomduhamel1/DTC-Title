'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface SectionField {
  key: string
  label: string
  value: string | null | undefined
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
}

interface SectionCardProps {
  closingId: string
  title: string
  emoji: string
  fields: SectionField[]
  emptyHint: string
}

export default function SectionCard({
  closingId,
  title,
  emoji,
  fields,
  emptyHint,
}: SectionCardProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [draft, setDraft] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value || ''])),
  )

  const allEmpty = fields.every((f) => !f.value)

  const onSave = async () => {
    setSubmitting(true)
    const res = await fetch('/api/closing/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ closingId, ...draft }),
    })
    if (res.ok) {
      setEditing(false)
      router.refresh()
    } else {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl" aria-hidden="true">{emoji}</span>
          <h3 className="text-base font-bold text-dark-900">{title}</h3>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 hover:text-primary-800"
          >
            {allEmpty ? '+ Add' : 'Edit'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(false)
                setDraft(Object.fromEntries(fields.map((f) => [f.key, f.value || ''])))
              }}
              className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={submitting}
              className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="px-5 py-4">
        {!editing && allEmpty ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
              Pending
            </span>
            <span className="text-xs">{emptyHint}</span>
          </div>
        ) : !editing ? (
          <dl className="space-y-2">
            {fields.map((f) =>
              f.value ? (
                <div key={f.key} className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-gray-500">{f.label}</dt>
                  <dd className="text-sm text-dark-900 font-medium text-right">{f.value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        ) : (
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {f.label}
                </label>
                <input
                  type={f.type || 'text'}
                  value={draft[f.key] || ''}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  placeholder={f.placeholder || ''}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
