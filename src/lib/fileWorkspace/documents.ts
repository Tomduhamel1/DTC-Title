import crypto from 'crypto'
import { z } from 'zod'
import type { ClosingDocument, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { fileRecipients, requireStaff, WorkspaceError, type FileActor } from './access'
import { signUpload, verifyUpload, signDownload, storageEnabled } from './storage'

export const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024
const MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] as const
const Begin = z.object({
  action: z.literal('begin'), fileName: z.string().trim().min(1).max(180).refine(v => !/[\\/\x00-\x1f\x7f]/.test(v)),
  fileSize: z.number().int().positive().max(MAX_DOCUMENT_BYTES), mimeType: z.enum(MIME_TYPES),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  sourceDocumentId: z.string().uuid().optional(), sourceVersion: z.string().min(1).max(128).optional(),
}).strict()
const Action = z.discriminatedUnion('action', [Begin,
  z.object({ action: z.literal('confirm'), documentId: z.string().min(1), revision: z.number().int().positive() }).strict(),
  z.object({ action: z.literal('share'), documentId: z.string().min(1), revision: z.number().int().positive(), recipientUserIds: z.array(z.string().min(1)).max(100) }).strict(),
  z.object({ action: z.literal('revoke'), documentId: z.string().min(1), revision: z.number().int().positive() }).strict(),
  z.object({ action: z.literal('download'), documentId: z.string().min(1) }).strict(),
  z.object({ action: z.literal('preview'), documentId: z.string().min(1) }).strict(),
])

function visible(doc: ClosingDocument, actor: FileActor) {
  return actor.staff || (doc.status !== 'revoked' && (doc.uploaderId === actor.id ||
    (doc.status === 'uploaded' && doc.recipientUserIds.includes(actor.id))))
}
function dto(doc: ClosingDocument, actor: FileActor) {
  return { id: doc.id, fileName: doc.fileName, fileSize: doc.fileSize, mimeType: doc.mimeType,
    origin: doc.origin, status: doc.status, revision: doc.revision, createdAt: doc.createdAt,
    // Never return storage keys, permanent URLs, other participants' IDs or audit data to a recipient.
    ...(actor.staff ? { recipientUserIds: doc.recipientUserIds, sourceDocumentId: doc.sourceDocumentId } : {}),
    canConfirm: doc.status === 'pending' && (actor.staff || doc.uploaderId === actor.id),
    canPreview: doc.status === 'uploaded' && ['application/pdf', 'image/jpeg', 'image/png'].includes(doc.mimeType),
  }
}
export async function listDocuments(closingId: string, actor: FileActor) {
  const docs = await prisma.closingDocument.findMany({ where: { closingId, ...(actor.staff ? {} : {
    status: { not: 'revoked' }, OR: [{ uploaderId: actor.id }, { status: 'uploaded', recipientUserIds: { has: actor.id } }],
  }) }, orderBy: { createdAt: 'desc' }, take: 500,
    include: { events: { where: { kind: 'upload_verified' }, orderBy: { createdAt: 'asc' }, take: 1, select: { createdAt: true } } } })
  // Resolve names only for uploaders of already-authorized documents. No raw IDs,
  // email addresses, audit metadata, or invisible documents enter the response.
  const ids = [...new Set(docs.filter(doc => !doc.uploaderId.startsWith('garden:')).map(doc => doc.uploaderId))]
  const users = ids.length ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } }) : []
  const members = ids.length ? await prisma.teammateClosing.findMany({ where: { closingId, userId: { in: ids } }, select: { userId: true, role: true } }) : []
  const owner = await prisma.closing.findUniqueOrThrow({ where: { id: closingId }, select: { userId: true } })
  const roleNames: Record<string, string> = { lender: 'Lender', broker: 'Broker', realtor: 'Agent' }
  return { documents: docs.map(doc => {
    const role = doc.origin === 'garden' ? 'Closing team (Garden)' : doc.origin === 'staff' ? 'Closing team' :
      doc.uploaderId === owner.userId ? 'Borrower' : roleNames[members.find(member => member.userId === doc.uploaderId)?.role || ''] || 'File participant'
    return { ...dto(doc, actor), uploadedAt: doc.events[0]?.createdAt || null,
      uploadedBy: { name: users.find(user => user.id === doc.uploaderId)?.name || role, role } }
  }), canManage: actor.staff, uploadsEnabled: storageEnabled(),
    recipients: actor.staff ? await fileRecipients(closingId) : [] }
}
async function validateRecipients(closingId: string, ids: string[]) {
  const eligible = new Set((await fileRecipients(closingId)).map(r => r.id))
  if (ids.some(id => !eligible.has(id)) || new Set(ids).size !== ids.length) throw new WorkspaceError(400, 'Choose current, signed-in file participants')
}
async function updateDocument(doc: ClosingDocument, actor: FileActor, kind: string, data: Prisma.ClosingDocumentUpdateManyMutationInput, metadata: Prisma.InputJsonValue) {
  return prisma.$transaction(async tx => {
    const changed = await tx.closingDocument.updateMany({ where: { id: doc.id, closingId: doc.closingId, revision: doc.revision, status: doc.status },
      data: { ...data, revision: { increment: 1 } } })
    if (changed.count !== 1) throw new WorkspaceError(409, 'The document changed. Refresh before trying again.')
    await tx.closingDocumentEvent.create({ data: { documentId: doc.id, actorId: actor.id, kind, metadata } })
    return tx.closingDocument.findUniqueOrThrow({ where: { id: doc.id } })
  })
}

export async function documentAction(closingId: string, actor: FileActor, raw: unknown) {
  const parsed = Action.safeParse(raw)
  if (!parsed.success) throw new WorkspaceError(400, 'Invalid document request (PDF, JPEG, PNG, TXT, DOCX or XLSX; up to 20 MB)')
  const input = parsed.data
  if (input.action === 'begin') {
    const extensions: Record<string, string[]> = { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
    if (!extensions[input.mimeType].some(ext => input.fileName.toLowerCase().endsWith(ext))) throw new WorkspaceError(400, 'The file extension must match its document type')
    if (!storageEnabled()) throw new WorkspaceError(503, 'Document uploads are not enabled yet')
    if (actor.garden !== Boolean(input.sourceDocumentId && input.sourceVersion) ||
        (!actor.garden && (input.sourceDocumentId || input.sourceVersion))) throw new WorkspaceError(400, 'Invalid document source')
    const existing = input.sourceDocumentId && input.sourceVersion ? await prisma.closingDocument.findUnique({
      where: { closingId_sourceDocumentId_sourceVersion: { closingId, sourceDocumentId: input.sourceDocumentId, sourceVersion: input.sourceVersion } },
    }) : null
    if (existing) {
      if (existing.sha256 !== input.sha256 || existing.fileName !== input.fileName || existing.fileSize !== input.fileSize || existing.mimeType !== input.mimeType) {
        throw new WorkspaceError(409, 'The source version was already used for a different document')
      }
      if (existing.status !== 'pending') return { document: dto(existing, actor), upload: null }
      const pending = existing.uploadExpiresAt < new Date()
        ? await updateDocument(existing, actor, 'upload_restarted', { storageKey: `closing-documents/${closingId}/${crypto.randomUUID()}`,
          uploadExpiresAt: new Date(Date.now() + 15 * 60_000) }, { previousRevision: existing.revision }) : existing
      return { document: dto(pending, actor), upload: await signUpload({ key: pending.storageKey, mimeType: pending.mimeType, size: pending.fileSize, sha256: pending.sha256 }) }
    }
    // Bounded per-file storage/intent quota. No unbounded public upload endpoint.
    const doc = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`file-documents:${closingId}`}))`
      if (await tx.closingDocument.count({ where: { closingId } }) >= 500) throw new WorkspaceError(409, 'This file has reached its document limit; contact the closing team')
      return tx.closingDocument.create({ data: { closingId, origin: actor.garden ? 'garden' : actor.staff ? 'staff' : 'participant',
        sourceDocumentId: input.sourceDocumentId, sourceVersion: input.sourceVersion,
        fileName: input.fileName, fileSize: input.fileSize, mimeType: input.mimeType, sha256: input.sha256,
        storageKey: `closing-documents/${closingId}/${crypto.randomUUID()}`, uploaderId: actor.id,
        uploadExpiresAt: new Date(Date.now() + 15 * 60_000),
        events: { create: { actorId: actor.id, kind: 'upload_requested', metadata: { recipientUserIds: [] } } },
      } })
    })
    return { document: dto(doc, actor), upload: await signUpload({ key: doc.storageKey, mimeType: doc.mimeType, size: doc.fileSize, sha256: doc.sha256 }) }
  }
  const doc = await prisma.closingDocument.findFirst({ where: { id: input.documentId, closingId } })
  if (!doc || !visible(doc, actor)) throw new WorkspaceError(404, 'Document not found')
  if (input.action === 'download' || input.action === 'preview') {
    if (doc.status !== 'uploaded' || !doc.storageVersion) throw new WorkspaceError(409, 'Document is not available')
    if (input.action === 'preview' && !['application/pdf', 'image/jpeg', 'image/png'].includes(doc.mimeType)) {
      throw new WorkspaceError(400, 'Preview is available for PDFs and images. Download this document instead.')
    }
    const url = await signDownload({ key: doc.storageKey, version: doc.storageVersion, fileName: doc.fileName,
      ...(input.action === 'preview' ? { previewMimeType: doc.mimeType } : {}) })
    // Revalidate after external I/O: concurrent revocation must not authorize a new URL.
    const current = await prisma.closingDocument.findUniqueOrThrow({ where: { id: doc.id } })
    if (current.revision !== doc.revision || !visible(current, actor) || current.status !== 'uploaded') throw new WorkspaceError(409, 'Document sharing changed. Refresh this file.')
    await prisma.closingDocumentEvent.create({ data: { documentId: doc.id, actorId: actor.id,
      kind: input.action === 'preview' ? 'preview_authorized' : 'download_authorized', metadata: { revision: doc.revision } } })
    return { url, expiresIn: 60 }
  }
  if (input.revision !== doc.revision) throw new WorkspaceError(409, 'The document changed. Refresh before trying again.')
  if (input.action === 'confirm') {
    if (!actor.staff && doc.uploaderId !== actor.id) throw new WorkspaceError(403, 'Only the uploader or closing team can confirm an upload')
    if (doc.status === 'uploaded') return { document: dto(doc, actor) }
    if (doc.status !== 'pending' || doc.uploadExpiresAt < new Date()) throw new WorkspaceError(409, 'Upload expired or revoked; start a new upload')
    const version = await verifyUpload({ key: doc.storageKey, mimeType: doc.mimeType, size: doc.fileSize, sha256: doc.sha256 })
    return { document: dto(await updateDocument(doc, actor, 'upload_verified', { status: 'uploaded', storageVersion: version }, { version }), actor) }
  }
  requireStaff(actor)
  if (input.action === 'share') {
    if (doc.status !== 'uploaded') throw new WorkspaceError(409, 'Only verified, active documents can be shared')
    await validateRecipients(closingId, input.recipientUserIds)
    return { document: dto(await updateDocument(doc, actor, 'sharing_changed', { recipientUserIds: input.recipientUserIds },
      { before: doc.recipientUserIds, after: input.recipientUserIds }), actor) }
  }
  return { document: dto(await updateDocument(doc, actor, 'revoked', { status: 'revoked', recipientUserIds: [] },
    { previousRecipients: doc.recipientUserIds }), actor) }
}
