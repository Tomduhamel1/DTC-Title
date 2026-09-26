'use client'
import { useState } from 'react'
import { BORROWER_EMAIL_CHOICES } from '@/lib/closing/notificationChoices'

export default function BorrowerEmailSetting({ closingId, initialEnabled = false, initialTypes = [],
  initialVersion = null, initialPending = false, accountDefaults, recipient = '', self = false, defaults = false }: {
  closingId?: string; initialEnabled?: boolean; initialTypes?: string[]; initialVersion?: string | null;
  initialPending?: boolean; accountDefaults?: string[]; recipient?: string; self?: boolean; defaults?: boolean
}) {
  // Old rows have all event kinds as a schema default even when never opted in.
  // Only a real saved permission/draft may use those values as checked choices.
  const startsFromDefaults = !defaults && !self && !initialVersion && !initialEnabled && accountDefaults !== undefined
  const initialChoices = defaults || initialEnabled || initialPending ? initialTypes : startsFromDefaults ? accountDefaults : []
  const [types, setTypes] = useState(initialTypes)
  const [selected, setSelected] = useState(BORROWER_EMAIL_CHOICES.filter(choice => initialChoices.includes(choice.kind)).map(choice => choice.kind as string))
  const [version, setVersion] = useState(initialVersion)
  const [pending, setPending] = useState(initialPending)
  const [usingDefaults, setUsingDefaults] = useState(startsFromDefaults)
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
      setTypes(result.types); setSelected(result.types); setVersion(result.version ?? null)
      setPending(Boolean(result.pendingRecipientConfirmation)); setUsingDefaults(false); setSaved(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save.') }
    finally { setBusy(false) }
  }
  return <section className="bg-white rounded-2xl border border-gray-200 p-5" aria-label={defaults ? 'Default borrower notifications' : 'File notifications'}>
    <h2 className="font-bold text-dark-900">{defaults ? 'Borrower / buyer email defaults' : self ? 'My file emails' : 'Borrower / buyer updates'}</h2>
    <p className="text-sm text-gray-600 mt-2">{defaults
      ? 'Choose the emails you want your borrower or buyer to receive on new files you order. You can change these choices on each file. Everything starts off until you choose it.'
      : self ? 'Choose the updates you want for this file.' : 'Choose which emails your borrower or buyer receives about this file. This does not change the updates you receive.'}</p>
      {!defaults && <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
        {recipient ? <><p>Recipient: <span className="font-medium break-all">{recipient}</span></p>
          {pending && <p className="mt-1">Your choices are saved, but emails are not active. Check this address and save to start future updates.</p>}</>
          : <p>No borrower / buyer email has been added to this file yet. You can choose and save the updates below now. Once the closing team adds the address, check it here and save to start future updates.</p>}
      </div>}
      {!defaults && !self && accountDefaults !== undefined && <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" disabled={busy} className="rounded-lg border border-gray-300 px-3 py-2 font-semibold disabled:opacity-50" onClick={() => {
          setSelected(BORROWER_EMAIL_CHOICES.filter(choice => accountDefaults.includes(choice.kind)).map(choice => choice.kind))
          setUsingDefaults(true); setSaved(false); setError('')
        }}>Use my defaults</button>
        <a className="text-emerald-700 underline" href="/settings">Edit my defaults</a>
        {usingDefaults && <p className="w-full text-gray-600">Your account defaults are selected. Save to apply them to this file.</p>}
      </div>}
      <fieldset disabled={busy} className="my-4 space-y-3"><legend className="sr-only">Email types</legend>
        {BORROWER_EMAIL_CHOICES.map(choice => <label key={choice.kind} className="flex items-start gap-3 text-sm">
          <input className="mt-1" type="checkbox" checked={selected.includes(choice.kind)} onChange={e => {
            setSaved(false); setUsingDefaults(false); setSelected(e.target.checked ? [...selected, choice.kind] : selected.filter(kind => kind !== choice.kind))
          }} /><span><span className="font-semibold text-dark-900">{choice.label}</span><span className="block text-gray-600">{choice.description}</span></span>
        </label>)}
      </fieldset>
      <p className="mb-4 text-xs text-gray-600">{defaults ? 'New files linked to your verified ordering email use these defaults. Existing files keep their own choices; use “Use my defaults” on a file to apply them there. ' : ''}Saving sends no email and never resends earlier updates. Sign-in emails are separate.</p>
      <button disabled={busy} onClick={save} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : defaults ? 'Save defaults' : 'Save file preferences'}</button>
    {saved && <p role="status" className="text-sm text-emerald-800 mt-3">{pending ? 'Choices saved. Emails will stay off until you confirm the borrower / buyer address here.' : 'Saved.'} No email was sent.</p>}
    {error && <p role="alert" className="text-sm text-red-700 mt-3">{error}</p>}
  </section>
}
