import Link from 'next/link'

export default function IntakeDocumentsNotice() {
  return (
    <section className="space-y-6" aria-labelledby="intake-documents-heading">
      <h2 id="intake-documents-heading" className="text-2xl font-bold text-gray-900">
        Documents for your closing
      </h2>
      <p className="text-gray-600">
        Documents are shared from the Documents section of your closing file, not this form.
        No documents are required to finish this form.
      </p>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <p className="text-gray-700">
          If your file is already open, sign in, choose the file, and open Documents.
        </p>
        <Link
          href="/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Open my files<span className="sr-only"> (opens in a new tab)</span>
        </Link>
        <p className="text-sm text-gray-500">Opens in a new tab so you can keep this form open.</p>
      </div>
      <p className="text-gray-600">
        If your file is not open yet, contact your closing team to arrange document sharing.
      </p>
    </section>
  )
}
