'use client'

interface LenderEmailPreviewProps {
  lenderFirstName?: string
  clientName?: string
  clientEmail?: string
  note?: string
  savingsEstimate?: number
  refId: string
}

export default function LenderEmailPreview({
  lenderFirstName,
  clientName,
  clientEmail,
  note,
  savingsEstimate,
  refId,
}: LenderEmailPreviewProps) {
  const greeting = lenderFirstName ? `Hi ${lenderFirstName},` : 'Hi there,'
  const client = clientName || 'Your client'
  const subject = `${clientName || 'Your client'} is using BetterClose for title & settlement on their closing`

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
      {/* Email metadata */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 text-xs space-y-1">
        <div className="flex gap-2">
          <span className="text-gray-400 w-14 flex-shrink-0">From:</span>
          <span className="text-gray-700">BetterClose &lt;noreply@betterclose.co&gt;</span>
        </div>
        {clientEmail && (
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 flex-shrink-0">CC:</span>
            <span className="text-gray-700">{clientEmail}</span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-gray-400 w-14 flex-shrink-0">Subject:</span>
          <span className="text-gray-900 font-medium">{subject}</span>
        </div>
      </div>

      {/* Email body */}
      <div className="px-5 py-5 text-sm text-gray-800 leading-relaxed space-y-3 bg-white">
        <p>{greeting}</p>
        <p>
          <strong>{client} is using BetterClose for title and settlement on their upcoming closing</strong> and asked us to send you everything you need to place the order.
        </p>
        <p>
          BetterClose uses the same A-rated underwriters you already work with (First American, AmTrust, Westcor, Old Republic) and integrates with SmartFees, Encompass, Qualia, and ResWare. Same coverage, transparent flat-rate pricing.
        </p>
        {savingsEstimate ? (
          <p>
            <strong>Estimated savings for {client} on this closing: ${savingsEstimate.toLocaleString()}</strong> over the life of the loan, on the same A-rated underwriters.
          </p>
        ) : null}
        {note && (
          <p className="italic text-gray-600 border-l-2 border-gray-200 pl-3">
            "{note}"
          </p>
        )}
        <p>
          <a
            href={`/for-my-lender?ref=${refId}`}
            className="inline-block bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-lg no-underline"
          >
            Get the order details →
          </a>
        </p>
        <p>
          If you have questions about the file, reply to this email — we'll get back to you in minutes, not days.
        </p>
        <p className="pt-2">
          Thanks,
          <br />
          The BetterClose Team
          <br />
          <span className="italic text-gray-500">On behalf of {client}</span>
        </p>
        <hr className="border-gray-100" />
        <p className="text-xs text-gray-400 italic">
          Sent at the request of {client}
          {clientEmail ? ` (${clientEmail})` : ''}.
        </p>
      </div>
    </div>
  )
}
