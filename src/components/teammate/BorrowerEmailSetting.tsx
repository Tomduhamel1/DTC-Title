'use client'
import { useState } from 'react'

export default function BorrowerEmailSetting({ closingId, initialEnabled, self = false }: {
  closingId: string; initialEnabled: boolean; self?: boolean
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function toggle() {
    setBusy(true); setError('')
    try {
      const response = await fetch(`/api/closings/${encodeURIComponent(closingId)}/borrower-notifications`, {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ enabled: !enabled }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) throw new Error('Could not save the notification setting. Please try again.')
      setEnabled(result.enabled)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save the setting.') }
    finally { setBusy(false) }
  }
  return <section className="bg-white rounded-2xl border border-gray-200 p-5">
    <label className="flex items-center gap-3 font-semibold text-dark-900">
      <input type="checkbox" checked={enabled} disabled={busy} onChange={toggle} />
      {self ? 'Email me file updates' : 'Email the borrower file updates'}
    </label>
    <p className="text-sm text-gray-600 mt-2">{self
      ? 'Applies to future automatic updates for this file. Sign-in emails are separate.'
      : 'Off by default. Includes opening, milestone and completion emails for this file. This does not change your own updates.'}
      {' '}Turning this on does not send past updates.</p>
    {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
  </section>
}
