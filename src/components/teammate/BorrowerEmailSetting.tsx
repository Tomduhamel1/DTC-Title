'use client'
import { useState } from 'react'
import { BORROWER_EMAIL_CHOICES } from '@/lib/closing/notificationChoices'

export default function BorrowerEmailSetting({ closingId, initialEnabled = false, initialTypes = [],
  initialVersion = null, recipient = '', self = false, defaults = false }: {
  closingId?: string; initialEnabled?: boolean; initialTypes?: string[]; initialVersion?: string | null;
  recipient?: string; self?: boolean; defaults?: boolean
}) {
  const [types, setTypes] = useState(initialTypes)
  const [selected, setSelected] = useState(defaults || initialEnabled
    ? BORROWER_EMAIL_CHOICES.filter(choice => initialTypes.includes(choice.kind)).map(choice => choice.kind as string) : [])
  const [version, setVersion] = useState(initialVersion)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  async function save() {
    setBusy(true); setError(''); setSaved(false)
    try {
      const response = await fetch(defaults ? '/api/settings/borrower-notifications' :
        `/api/closings/${encodeURIComponent(closingId!)}/borrower-notifications`, {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(defaults
          ? { types: selected, expectedTypes: types } : { types: selected, expectedVersion: version, recipient }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) throw new Error(response.status === 409 ? result.error : 'Could not save. Please try again.')
      setTypes(result.types); setSelected(result.types); setVersion(result.version ?? null); setSaved(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save.') }
    finally { setBusy(false) }
  }
  return <section className="bg-white rounded-2xl border border-gray-200 p-5" aria-label={defaults ? 'Default borrower notifications' : 'File notifications'}>
    <h2 className="font-bold text-dark-900">{defaults ? 'Borrower email defaults for new files' : self ? 'My file emails' : 'Borrower emails for this file'}</h2>
    <p className="text-sm text-gray-600 mt-2">{defaults
      ? 'Choose which updates to send to borrowers on new files you order. All start off. Existing files keep their own settings.'
      : self ? 'Choose the updates you want for this file.' : 'These choices are shared by the authorized Pros on this file. Your own file updates are separate.'}</p>
    {!defaults && !recipient ? <p className="mt-3 text-sm text-gray-600">No borrower email is on this file yet. Ask the closing team to add it before choosing borrower updates.</p> : <>
      {!defaults && <p className="mt-3 text-sm text-gray-700">Send to: {recipient}</p>}
      <fieldset disabled={busy} className="my-4 space-y-3"><legend className="sr-only">Email types</legend>
        {BORROWER_EMAIL_CHOICES.map(choice => <label key={choice.kind} className="flex items-start gap-3 text-sm">
          <input className="mt-1" type="checkbox" checked={selected.includes(choice.kind)} onChange={e => {
            setSaved(false); setSelected(e.target.checked ? [...selected, choice.kind] : selected.filter(kind => kind !== choice.kind))
          }} /><span><span className="font-semibold text-dark-900">{choice.label}</span><span className="block text-gray-600">{choice.description}</span></span>
        </label>)}
      </fieldset>
      <p className="mb-4 text-xs text-gray-600">{defaults ? 'Defaults apply only when your verified Pro identity is attached at file creation. If Pros disagree, or the borrower is missing, emails stay off until chosen on the file. ' : ''}Saving sends no email and never resends earlier updates. Sign-in emails are separate.</p>
      <button disabled={busy} onClick={save} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : defaults ? 'Save defaults' : 'Save file preferences'}</button>
    </>}
    {saved && <p role="status" className="text-sm text-emerald-800 mt-3">Saved. No email was sent.</p>}
    {error && <p role="alert" className="text-sm text-red-700 mt-3">{error}</p>}
  </section>
}
