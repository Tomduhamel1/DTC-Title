'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '@/lib/phone'

export interface SectionField {
  key: string
  label: string
  value: string | null | undefined
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
}

interface EditableFieldsProps {
  closingId: string
  fields: SectionField[]
  emptyHint: string
  /** Optional footnote rendered below the fields (e.g. "Or change lender →"). */
  footnote?: React.ReactNode
}

/**
 * Display + inline-edit for a set of closing fields. Lives inside a
 * SectionShell — has no card chrome of its own.
 */
export default function EditableFields({
  closingId,
  fields,
  emptyHint,
  footnote,
}: EditableFieldsProps) {
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
    <div>
      {!editing && allEmpty ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
            Pending
          </span>
          <span className="text-sm text-gray-500">{emptyHint}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-semibold text-primary-700 hover:text-primary-800"
          >
            + Add now
          </button>
        </div>
      ) : !editing ? (
        <>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {fields.map((f) =>
              f.value ? (
                <div key={f.key}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-dark-900 font-medium mt-0.5 break-words">
                    {f.value}
                  </dd>
                </div>
              ) : null,
            )}
          </dl>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 text-xs font-semibold text-primary-700 hover:text-primary-800"
          >
            Edit
          </button>
        </>
      ) : (
        <div>
          <div className="grid sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.key === 'propertyAddress' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {f.label}
                </label>
                <input
                  type={f.type || 'text'}
                  value={draft[f.key] || ''}
                  onChange={(e) => {
                    const next = f.type === 'tel' ? formatPhoneInput(e.target.value) : e.target.value
                    setDraft({ ...draft, [f.key]: next })
                  }}
                  placeholder={f.placeholder || ''}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setEditing(false)
                setDraft(Object.fromEntries(fields.map((f) => [f.key, f.value || ''])))
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
      {footnote && !editing && <div className="mt-4">{footnote}</div>}
    </div>
  )
}
