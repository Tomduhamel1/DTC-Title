'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { formatCurrency, type FeeReport } from '@/lib/feeReport'

type FileDocument = { id: string; fileName: string; fileSize: number; status: string; revision: number;
  origin: string; canConfirm: boolean; recipientUserIds?: string[] }
type Version = { revision: number; source: string; report: FeeReport; assumptions: string[]; createdAt: string }
type Workspace = { enabled: boolean; documents: FileDocument[]; canManage: boolean; uploadsEnabled: boolean;
  recipients: { id: string; label: string }[]; estimates: { versions: Version[]; closed: boolean; missingFields: string[];
    basis: { transactionType: string | null; zip: string | null; homeValue: number | null; loanAmount: number | null } } }
const panel = 'bg-white rounded-2xl border border-gray-200 shadow-sm p-5'
const button = 'rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50'

export default function FileWorkspace({ closingId }: { closingId: string }) {
  const [data, setData] = useState<Workspace | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [sharing, setSharing] = useState<string | null>(null)
  const [recipients, setRecipients] = useState<string[]>([])
  const [version, setVersion] = useState<number | null>(null)
  const endpoint = `/api/closings/${encodeURIComponent(closingId)}/workspace`
  const currentFile = useRef(closingId); currentFile.current = closingId
  const refresh = useCallback(async () => {
    const response = await fetch(endpoint, { cache: 'no-store' })
    const body = await response.json()
    if (!response.ok) throw new Error(body.error || 'Unable to load the file workspace')
    if (currentFile.current === closingId) setData(body)
  }, [endpoint, closingId])
  useEffect(() => { setData(null); setSharing(null); setVersion(null); setError(''); setNotice(''); setBusy(false); refresh().catch(e => { if (currentFile.current === closingId) setError(e.message) }) }, [refresh, closingId])
  async function action(body: unknown) {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'The request could not be completed')
    return result
  }
  async function run(work: () => Promise<void>) {
    setBusy(true); setError(''); setNotice('')
    try { await work(); if (currentFile.current === closingId) await refresh() } catch (e) { if (currentFile.current === closingId) setError(e instanceof Error ? e.message : 'Please try again') }
    finally { if (currentFile.current === closingId) setBusy(false) }
  }
  async function upload(file: File) {
    if (!file.size || file.size > 20 * 1024 * 1024) throw new Error('Choose a file between 1 byte and 20 MB')
    const bytes = await file.arrayBuffer()
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('')
    const result = await action({ action: 'begin', fileName: file.name, fileSize: file.size, mimeType: file.type, sha256: hash })
    const put = await fetch(result.upload.url, { method: 'PUT', headers: result.upload.headers, body: bytes })
    if (!put.ok) throw new Error('The upload did not complete. Please retry with the file selected again.')
    await action({ action: 'confirm', documentId: result.document.id, revision: result.document.revision })
    setNotice('Uploaded for you and the closing team. Downloads become available after the security scan. No email was sent.')
  }
  if (data && !data.enabled) return null
  const versions = data?.estimates.versions || []
  const selected = versions.find(v => v.revision === version) || versions.at(-1)
  return <div className="space-y-4 text-dark-900" aria-label="File documents and estimate">
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error} <button className="underline" onClick={() => run(refresh)}>Retry</button></div>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
    {!data && !error && <p className="text-sm text-gray-500">Loading documents and estimate…</p>}
    {data?.enabled && <>
      <section className={panel} aria-label="Documents">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">Documents</h2>
          <label className={`${button} ${busy || !data.uploadsEnabled ? 'opacity-50' : 'cursor-pointer'}`}>
            Upload document<input className="sr-only" type="file" disabled={busy || !data.uploadsEnabled}
              accept=".pdf,.png,.jpg,.jpeg,.txt,.docx,.xlsx" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) run(() => upload(file)) }} />
          </label>
        </div>
        <p className="my-3 text-sm text-gray-600">Uploads are private to you and the closing team. The closing team controls which documents are shared with other people on this file.</p>
        {!data.uploadsEnabled && <p className="text-sm text-amber-800">Secure document uploads are not enabled yet.</p>}
        {!data.documents.length ? <p className="py-5 text-sm text-gray-500">No documents shared with you yet.</p> : <ul className="divide-y divide-gray-100">
          {data.documents.map(doc => <li key={doc.id} className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><p className="font-semibold break-words">{doc.fileName}</p><p className="text-xs text-gray-500">{Math.ceil(doc.fileSize / 1024)} KB · {doc.status === 'uploaded' ? 'Uploaded' : doc.status === 'revoked' ? 'Sharing revoked' : 'Upload not yet confirmed'}</p></div>
              <div className="flex flex-wrap gap-2">
                {doc.status === 'uploaded' && <button className={button} disabled={busy} onClick={() => run(async () => { const result = await action({ action: 'download', documentId: doc.id }); window.location.assign(result.url) })}>Download</button>}
                {doc.canConfirm && <button className={button} disabled={busy} onClick={() => run(async () => { await action({ action: 'confirm', documentId: doc.id, revision: doc.revision }) })}>Verify upload</button>}
                {data.canManage && doc.status === 'uploaded' && <button className={button} disabled={busy} onClick={() => { setSharing(doc.id); setRecipients(doc.recipientUserIds || []) }}>Manage sharing</button>}
                {data.canManage && doc.status !== 'revoked' && <button className={button} disabled={busy} onClick={() => run(async () => { await action({ action: 'revoke', documentId: doc.id, revision: doc.revision }); setNotice('Further downloads are blocked. Previously downloaded copies cannot be recalled; an already-issued download link expires within 60 seconds.') })}>Revoke access</button>}
              </div>
            </div>
            {sharing === doc.id && <fieldset className="mt-3 rounded-xl bg-gray-50 p-4"><legend className="text-sm font-bold">Who can see this document?</legend>
              <p className="mb-2 text-xs text-gray-600">The uploader and closing team retain access. Only people who have signed in and are linked to this file appear below.</p>
              {data.recipients.map(r => <label key={r.id} className="my-2 flex gap-2 text-sm"><input type="checkbox" checked={recipients.includes(r.id)} onChange={e => setRecipients(e.target.checked ? [...recipients, r.id] : recipients.filter(id => id !== r.id))} />{r.label}</label>)}
              <button className={button} disabled={busy} onClick={() => run(async () => { await action({ action: 'share', documentId: doc.id, revision: doc.revision, recipientUserIds: recipients }); setSharing(null); setNotice('Document sharing updated. No email was sent.') })}>Save sharing</button>{' '}
              <button className={button} onClick={() => setSharing(null)}>Cancel</button>
            </fieldset>}
          </li>)}
        </ul>}
      </section>
      <section className={panel} aria-label="Closing estimate">
        <h2 className="text-lg font-bold">Closing estimate</h2>
        <p className="my-3 text-sm text-gray-600">Your starting estimate and later revisions stay on this file. These are estimates, not final settlement charges.</p>
        {selected ? <>
          <label className="text-sm font-semibold">Estimate version <select className="ml-2 rounded-lg border p-2" value={selected.revision} onChange={e => setVersion(Number(e.target.value))}>
            {versions.map(v => <option key={v.revision} value={v.revision}>{v.revision === 1 ? 'Starting estimate' : `Revision ${v.revision}`} {v.revision === versions.at(-1)?.revision ? '(latest)' : ''}</option>)}
          </select></label>
          <p className="my-3 text-xs text-gray-500">{selected.source === 'linked_quote' ? 'Preserved from the original website quote' : 'Calculated using the website fee engine'} · Saved {new Date(selected.createdAt).toLocaleString()}</p>
          {selected.source === 'linked_quote' && selected.report.generatedAt && <p className="mb-3 text-xs text-gray-500">Original quote generated {new Date(selected.report.generatedAt).toLocaleString()}</p>}
          <p className="mb-3 text-sm">{selected.report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {selected.report.zip || selected.report.state} · {selected.report.transactionType === 'purchase' ? `Purchase price ${formatCurrency(selected.report.homeValue)}` : `Loan ${formatCurrency(selected.report.loanAmount || 0)}`}</p>
          {selected.assumptions.map(note => <p key={note} className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{note}</p>)}
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Estimated charge</th><th className="py-2 text-right">Amount</th></tr></thead>
            <tbody>{selected.report.lineItems.map((item, i) => <tr key={`${item.id}-${i}`} className="border-b border-gray-100"><td className="py-2 pr-4">{item.label}</td><td className="whitespace-nowrap py-2 text-right">{formatCurrency(item.ourCost)}</td></tr>)}</tbody>
            {selected.report.frozenTotals && <tfoot><tr className="font-bold"><td className="pt-3">Estimated total</td><td className="pt-3 text-right">{formatCurrency(selected.report.frozenTotals.ourTotal)}</td></tr></tfoot>}
          </table></div>
        </> : <p className="my-4 text-sm text-gray-600">{data.estimates.missingFields.length ? 'The closing team needs to confirm the transaction type, ZIP or amount before preparing the starting estimate.' : 'The starting estimate is pending. The closing team can generate it below.'}</p>}
        {data.canManage && !data.estimates.closed && <details className="mt-5"><summary className="cursor-pointer text-sm font-semibold">{versions.length ? 'Create a revised estimate' : 'Prepare starting estimate'}</summary>
          <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); run(async () => {
            await action({ action: 'estimate', expectedRevision: versions.at(-1)?.revision || 0, input: {
              transactionType: form.get('transactionType'), zip: form.get('zip'),
              homeValue: form.get('homeValue') ? Number(form.get('homeValue')) : null,
              loanAmount: form.get('loanAmount') ? Number(form.get('loanAmount')) : null,
            } }); setVersion(null); setNotice('Estimate saved. Prior versions are unchanged.')
          }) }}>
            <label className="text-sm">Transaction type<select name="transactionType" required defaultValue={data.estimates.basis.transactionType || ''} className="mt-1 block w-full rounded border p-2"><option value="" disabled>Select</option><option value="purchase">Purchase</option><option value="refinance">Refinance</option></select></label>
            <label className="text-sm">Property ZIP<input name="zip" required pattern="[0-9]{5}" defaultValue={data.estimates.basis.zip || ''} className="mt-1 block w-full rounded border p-2" /></label>
            <label className="text-sm">Purchase price<input name="homeValue" type="number" min="0.01" step="0.01" defaultValue={data.estimates.basis.homeValue || ''} className="mt-1 block w-full rounded border p-2" /></label>
            <label className="text-sm">Loan amount<input name="loanAmount" type="number" min="0.01" step="0.01" defaultValue={data.estimates.basis.loanAmount || ''} className="mt-1 block w-full rounded border p-2" /></label>
            <p className="text-xs text-gray-600 sm:col-span-2">These inputs apply only to this estimate, not the file’s financial records. For a purchase with no loan amount, the website’s 80% assumption will be shown explicitly. Cash purchases need separate pricing review.</p>
            <button className={button} disabled={busy} type="submit">{busy ? 'Working…' : 'Save estimate version'}</button>
          </form>
        </details>}
      </section>
    </>}
  </div>
}
