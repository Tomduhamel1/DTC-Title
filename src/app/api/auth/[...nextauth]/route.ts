import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { NextRequest, NextResponse } from 'next/server'
import { emailConfirmationUrl, readEmailConfirmation } from '@/lib/auth/emailConfirmation'

const handler = NextAuth(authOptions)

type Context = { params: Promise<{ nextauth: string[] }> }
const privateHeaders = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer' }
const trustedOrigin = () => new URL(process.env.NEXTAUTH_URL || 'https://www.betterclose.co').origin
async function isEmailCallback(context: Context) {
  const { nextauth } = await context.params
  return nextauth?.[0] === 'callback' && nextauth?.[1] === 'email'
}

export async function GET(req: NextRequest, context: Context) {
  if (!await isEmailCallback(context)) return handler(req, context)
  // Also protect still-valid emails sent before this release. GET/HEAD must
  // never redeem an email token, including mail previews and security scans.
  try {
    const url = new URL('/api/auth/callback/email', trustedOrigin())
    url.search = req.nextUrl.search
    return NextResponse.redirect(emailConfirmationUrl(url.href, trustedOrigin()), { status: 303, headers: privateHeaders })
  } catch {
    return NextResponse.redirect(trustedOrigin() + '/login?error=Verification', { status: 303, headers: privateHeaders })
  }
}

export async function POST(req: NextRequest, context: Context) {
  if (!await isEmailCallback(context)) return handler(req, context)
  // Exact Origin blocks cross-site form/login-CSRF requests. Do not trust Host.
  if (req.headers.get('origin') !== trustedOrigin() ||
    req.headers.get('content-type')?.split(';')[0] !== 'application/x-www-form-urlencoded') {
    return new NextResponse('Sign-in request unavailable', { status: 403, headers: privateHeaders })
  }
  if (Number(req.headers.get('content-length')) > 8192) return new NextResponse(null, { status: 400, headers: privateHeaders })
  const body = await req.text()
  const data = body.length <= 8192 ? readEmailConfirmation(new URLSearchParams(body), trustedOrigin()) : null
  if (!data) return NextResponse.redirect(trustedOrigin() + '/login?error=Verification', { status: 303, headers: privateHeaders })
  // NextAuth v4 expects email credentials in its internal query object even
  // for POST. Translate only in memory: browser requests never carry tokens
  // in the URL. NextAuth still verifies/consumes the token and owns the session.
  const internal = new URL('/api/auth/callback/email', trustedOrigin())
  internal.search = new URLSearchParams(data).toString()
  return handler(new NextRequest(internal, { method: 'POST', headers: req.headers,
    body: new URLSearchParams({ callbackUrl: data.callbackUrl }) }), context)
}
