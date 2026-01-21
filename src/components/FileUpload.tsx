'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  leadId: string
  documentType: string
  label: string
  accept?: string
  maxSize?: number // bytes
  onSuccess?: (document: any) => void
  onError?: (error: string) => void
}

export default function FileUpload({
  leadId,
  documentType,
  label,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx',
  maxSize = 10 * 1024 * 1024, // 10MB default
  onSuccess,
  onError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      const error = `File size exceeds maximum of ${maxSize / 1024 / 1024}MB`
      if (onError) onError(error)
      return
    }

    setFileName(file.name)
    setUploading(true)
    setProgress(0)

    try {
      // Step 1: Get presigned upload URL
      const uploadResponse = await fetch('/api/intake/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          documentType,
        }),
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to get upload URL')
      }

      const { uploadUrl, key } = uploadData

      // Step 2: Upload to S3
      setProgress(30)

      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!s3Response.ok) {
        throw new Error('Failed to upload file to S3')
      }

      setProgress(70)

      // Step 3: Confirm upload
      const confirmResponse = await fetch('/api/intake/upload/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          key,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          documentType,
        }),
      })

      const confirmData = await confirmResponse.json()

      if (!confirmResponse.ok) {
        throw new Error(confirmData.error || 'Failed to confirm upload')
      }

      setProgress(100)
      setUploaded(true)

      if (onSuccess) {
        onSuccess(confirmData.document)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      if (onError) {
        onError(errorMessage)
      }
      setUploaded(false)
      setFileName(null)
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setUploaded(false)
    setFileName(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="label">{label}</label>

      {!uploaded ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">⏳</span>
                <span>Uploading... {progress}%</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>📎</span>
                <span>Click to select file</span>
              </div>
            )}
          </button>

          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Accepted formats: PDF, Images, Word, Excel. Max size: {maxSize / 1024 / 1024}MB
      </p>
    </div>
  )
}
