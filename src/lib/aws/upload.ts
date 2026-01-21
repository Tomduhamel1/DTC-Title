import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export interface GenerateUploadUrlParams {
  leadId: string
  fileName: string
  fileType: string
  documentType: string
}

export interface UploadUrlResponse {
  uploadUrl: string
  key: string
  expiresIn: number
}

/**
 * Generate a presigned URL for S3 upload
 */
export async function generateUploadUrl({
  leadId,
  fileName,
  fileType,
  documentType,
}: GenerateUploadUrlParams): Promise<UploadUrlResponse> {
  const bucketName = process.env.AWS_S3_BUCKET || ''

  if (!bucketName) {
    throw new Error('S3 bucket name not configured')
  }

  // Generate unique key
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `leads/${leadId}/${documentType}/${timestamp}-${randomStr}-${sanitizedFileName}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    ServerSideEncryption: 'AES256',
  })

  const expiresIn = 300 // 5 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn })

  return {
    uploadUrl,
    key,
    expiresIn,
  }
}

/**
 * Get document URL from S3 key
 */
export function getDocumentUrl(key: string): string {
  const bucketName = process.env.AWS_S3_BUCKET || ''
  const region = process.env.AWS_REGION || 'us-east-1'
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Allowed file types for uploads
 */
export const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg,.jpeg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
}

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Validate file for upload
 */
export function validateFile(
  fileName: string,
  fileSize: number,
  fileType: string
): { valid: boolean; error?: string } {
  // Check file size
  if (fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Check file type
  if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileType)) {
    return {
      valid: false,
      error: 'File type not allowed. Allowed types: PDF, images, Word, Excel',
    }
  }

  return { valid: true }
}
