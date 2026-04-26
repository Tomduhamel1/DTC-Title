import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.APP_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey:
      process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export interface UploadToS3Params {
  buffer: Buffer
  key: string
  contentType: string
  bucket?: string
}

/**
 * Upload a file to S3
 */
export async function uploadToS3({
  buffer,
  key,
  contentType,
  bucket,
}: UploadToS3Params): Promise<string> {
  const bucketName = bucket || process.env.AWS_S3_BUCKET || ''

  if (!bucketName) {
    throw new Error('S3 bucket name not configured')
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
    // Make publicly readable if needed, or use signed URLs
    // ACL: 'public-read',
  })

  await s3Client.send(command)

  // Return the S3 URL
  const region = process.env.AWS_REGION || 'us-east-1'
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string, bucket?: string): Promise<void> {
  const bucketName = bucket || process.env.AWS_S3_BUCKET || ''

  if (!bucketName) {
    throw new Error('S3 bucket name not configured')
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Generate a unique S3 key for a PDF file
 */
export function generatePdfKey(quoteId: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `quotes/${quoteId}/quote-${timestamp}-${randomStr}.pdf`
}
