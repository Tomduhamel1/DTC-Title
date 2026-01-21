'use client'

import { useState } from 'react'

interface QuotePdfButtonProps {
  quoteId: string
  variant?: 'primary' | 'secondary'
  sendEmail?: boolean
  onSuccess?: (pdfUrl: string) => void
  onError?: (error: string) => void
}

export default function QuotePdfButton({
  quoteId,
  variant = 'primary',
  sendEmail = true,
  onSuccess,
  onError,
}: QuotePdfButtonProps) {
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleGeneratePdf = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/quote/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          sendEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate PDF')
      }

      setPdfUrl(data.pdfUrl)

      if (onSuccess) {
        onSuccess(data.pdfUrl)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const buttonClasses =
    variant === 'primary'
      ? 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
      : 'btn-secondary disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="space-y-4">
      <button onClick={handleGeneratePdf} disabled={loading} className={buttonClasses}>
        {loading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            {sendEmail ? 'Generating & Sending...' : 'Generating PDF...'}
          </>
        ) : (
          <>{sendEmail ? 'Email Quote PDF' : 'Download Quote PDF'}</>
        )}
      </button>

      {pdfUrl && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-2">
            {sendEmail ? '✓ PDF generated and sent!' : '✓ PDF generated!'}
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 underline"
          >
            View PDF
          </a>
        </div>
      )}
    </div>
  )
}
