import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectTaggingCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { WorkspaceError } from './access'

// Never fall back to the legacy public-assets bucket. Configuration is a
// release gate: private/versioned bucket + malware scanning + restrictive IAM.
export function storageEnabled() {
  return process.env.BC_DOCUMENTS_ENABLED === 'true' && Boolean(process.env.BC_DOCUMENT_BUCKET)
}
function config() {
  if (!storageEnabled()) throw new WorkspaceError(503, 'Document uploads are not enabled yet')
  const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
  return { Bucket: process.env.BC_DOCUMENT_BUCKET!, client: new S3Client({
    region: process.env.APP_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
    ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {}),
  }) }
}

export async function signUpload(input: { key: string; mimeType: string; size: number; sha256: string }) {
  const { Bucket, client } = config()
  const checksum = Buffer.from(input.sha256, 'hex').toString('base64')
  const url = await getSignedUrl(client, new PutObjectCommand({ Bucket, Key: input.key,
    ContentType: input.mimeType, ContentLength: input.size, ChecksumSHA256: checksum, IfNoneMatch: '*',
    ServerSideEncryption: 'AES256',
  }), { expiresIn: 300, unhoistableHeaders: new Set(['x-amz-checksum-sha256', 'x-amz-server-side-encryption']),
    signableHeaders: new Set(['content-type', 'if-none-match']) })
  return { url, headers: { 'Content-Type': input.mimeType, 'x-amz-checksum-sha256': checksum,
    'If-None-Match': '*', 'x-amz-server-side-encryption': 'AES256' } }
}

export async function verifyUpload(input: { key: string; mimeType: string; size: number; sha256: string }) {
  const { Bucket, client } = config()
  const head = await client.send(new HeadObjectCommand({ Bucket, Key: input.key, ChecksumMode: 'ENABLED' }))
  if (head.ContentLength !== input.size || head.ContentType !== input.mimeType ||
      head.ChecksumSHA256 !== Buffer.from(input.sha256, 'hex').toString('base64') ||
      !head.VersionId || head.VersionId === 'null') {
    throw new WorkspaceError(409, 'Upload verification failed; the file has not been published')
  }
  return head.VersionId
}

export async function signDownload(input: { key: string; version: string; fileName: string }) {
  const { Bucket, client } = config()
  const scan = await client.send(new GetObjectTaggingCommand({ Bucket, Key: input.key, VersionId: input.version }))
  if (!scan.TagSet?.some(tag => tag.Key === 'GuardDutyMalwareScanStatus' && tag.Value === 'NO_THREATS_FOUND')) {
    throw new WorkspaceError(409, 'This document is awaiting a successful security scan. Please try again later.')
  }
  const filename = input.fileName.replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 180)
  return getSignedUrl(client, new GetObjectCommand({ Bucket, Key: input.key, VersionId: input.version,
    ResponseContentDisposition: `attachment; filename="${filename}"`, ResponseContentType: 'application/octet-stream',
    ResponseCacheControl: 'private, no-store',
  }), { expiresIn: 60 })
}
