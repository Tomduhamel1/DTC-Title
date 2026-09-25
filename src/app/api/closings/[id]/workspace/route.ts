import { workspaceRequest } from '@/lib/fileWorkspace/http'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ id: string }> }
export async function GET(req: Request, context: Context) { return workspaceRequest(req, (await context.params).id) }
export async function POST(req: Request, context: Context) { return workspaceRequest(req, (await context.params).id) }
