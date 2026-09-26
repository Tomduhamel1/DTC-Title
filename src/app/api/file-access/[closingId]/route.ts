import { NextResponse } from 'next/server'
import { fileAccessOrigin, redeemFileAccessLink } from '@/lib/auth/fileAccess'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer' }

export async function POST(req: Request, props: { params: Promise<{ closingId: string }> }) {
  // JSON + exact trusted Origin disallow cross-site form/login-CSRF requests.
  // Never trust Host or forwarded headers to choose an authentication destination.
  if (req.headers.get('origin') !== fileAccessOrigin() ||
    req.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return NextResponse.json({ error: 'Access link unavailable' }, { status: 403, headers })
  }
  if (Number(req.headers.get('content-length')) > 1024) {
    return NextResponse.json({ error: 'Access link unavailable' }, { status: 400, headers })
  }
  try {
    const { closingId } = await props.params
    const body = await req.json()
    const url = typeof body?.token === 'string' ? await redeemFileAccessLink(closingId, body.token) : null
    if (!url) return NextResponse.json({ error: 'Access link unavailable' }, { status: 410, headers })
    return NextResponse.json({ url }, { headers })
  } catch {
    // Never log request bodies, bearer links, recipient identities or Prisma errors.
    return NextResponse.json({ error: 'Please try again' }, { status: 503, headers })
  }
}
