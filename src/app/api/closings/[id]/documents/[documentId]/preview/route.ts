import { NextResponse } from 'next/server'
import { fileActor, WorkspaceError } from '@/lib/fileWorkspace/access'
import { documentAction } from '@/lib/fileWorkspace/documents'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' }
export async function GET(req: Request, context: { params: Promise<{ id: string; documentId: string }> }) {
  try {
    if (process.env.BC_FILE_WORKSPACE_ENABLED !== 'true') throw new WorkspaceError(404, 'File workspace is unavailable')
    const { id, documentId } = await context.params
    const actor = await fileActor(req, id)
    const result = await documentAction(id, actor, { action: 'preview', documentId })
    if (!('url' in result) || typeof result.url !== 'string') throw new Error('Missing preview')
    // The content is served on the private storage origin, never the app origin.
    return new NextResponse(null, { status: 307, headers: { ...headers, Location: result.url } })
  } catch (error) {
    return new NextResponse(error instanceof WorkspaceError ? error.message : 'Preview is unavailable. Return to your file and try Download.',
      { status: error instanceof WorkspaceError ? error.status : 500, headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}
