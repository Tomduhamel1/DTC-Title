import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fileActor, requireSameOrigin, requireStaff, WorkspaceError } from './access'
import { listDocuments, documentAction } from './documents'
import { estimateHistory, createEstimate } from './estimates'

const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } })
export async function workspaceRequest(req: Request, closingId: string, garden = false) {
  try {
    const actor = await fileActor(req, closingId, garden)
    if (process.env.BC_FILE_WORKSPACE_ENABLED !== 'true') {
      if (req.method === 'GET') return reply({ enabled: false })
      throw new WorkspaceError(409, 'The file workspace is not enabled yet')
    }
    if (req.method === 'GET') {
      return reply({ enabled: true, ...await listDocuments(closingId, actor), estimates: await estimateHistory(closingId) })
    }
    if (!garden) requireSameOrigin(req)
    const body = await req.json().catch(() => null)
    if (body?.action === 'estimate') {
      requireStaff(actor)
      const parsed = z.object({ action: z.literal('estimate'), expectedRevision: z.number().int().min(0), input: z.unknown().optional() }).strict().safeParse(body)
      if (!parsed.success) throw new WorkspaceError(400, 'Invalid estimate request')
      await createEstimate(closingId, actor.id, parsed.data.expectedRevision, parsed.data.input)
      return reply({ estimates: await estimateHistory(closingId) })
    }
    return reply(await documentAction(closingId, actor, body))
  } catch (err) {
    if (err instanceof WorkspaceError) return reply({ error: err.message, ...(err.code ? { code: err.code } : {}) }, err.status)
    // Deliberately omit S3 URLs, bucket names, file data and provider/DB details.
    return reply({ error: 'The file workspace is temporarily unavailable. Please refresh and try again.' }, 503)
  }
}
