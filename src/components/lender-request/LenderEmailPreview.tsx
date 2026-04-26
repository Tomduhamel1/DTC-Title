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
  const subject = `${clientName || 'Your client'} would like you to consider BetterClose for their closing`

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
          {client} is preparing for their upcoming home closing and asked us to introduce you to BetterClose, an alternative title and closing company they'd like considered for the transaction.
        </p>
        <p>
          <strong>Why your client is reaching out:</strong> Closing costs vary widely between title companies — often by thousands of dollars on the same transaction. BetterClose offers transparent flat-rate pricing, the same A-rated underwriters you already work with (First American, Old Republic, Stewart, Fidelity), and full digital coordination.
          {savingsEstimate ? (
            <>
              {' '}
              <em>Estimated savings on this closing: ${savingsEstimate.toLocaleString()}.</em>
            </>
          ) : null}
        </p>
        <p>
          <strong>What we're asking:</strong> Take 60 seconds to review BetterClose at the link below. If it works for the file, you can place the title order directly — or find us in SmartFees, Encompass, Qualia, or ResWare.
        </p>
        {note && (
          <p className="italic text-gray-600 border-l-2 border-gray-200 pl-3">
            "{note}"
          </p>
        )}
        <p>
          <a
            href={`/for-my-lender?ref=${refId}`}
            className="inline-block bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg no-underline"
          >
            Review BetterClose →
          </a>
        </p>
        <p>
          Questions? Just reply to this email.
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
