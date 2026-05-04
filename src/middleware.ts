import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// When COMING_SOON_MODE=true (set on the live deploy only), redirect public
// marketing pages to /coming-soon. Functional routes — auth, dashboard, the
// fee-estimate flow, the for-my-lender landing, all API routes — stay live so
// the team can keep testing and authenticated users keep working.
//
// Bypass paths:
//   1. ?preview=<COMING_SOON_BYPASS_KEY>  -> sets a 30-day cookie and lets the
//      browser through. Share the key with anyone who needs preview access.
//   2. NextAuth session cookie present    -> any signed-in user passes through.
//      Combined with the admin email allowlist this means admins can browse
//      the real site without a separate bypass key.

const FUNCTIONAL_PREFIXES = [
  '/dashboard',
  '/login',
  '/quote',
  '/api',
  '/for-my-lender',
  '/coming-soon',
  '/welcome',
  '/resume',
  '/admin',
  '/preview',
]

const BYPASS_COOKIE = 'cs_bypass'
const SESSION_COOKIE_HINTS = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function isStaticAsset(pathname: string) {
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') return true
  return /\.[a-zA-Z0-9]+$/.test(pathname)
}

export function middleware(req: NextRequest) {
  if (process.env.COMING_SOON_MODE !== 'true') {
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl

  if (isStaticAsset(pathname)) return NextResponse.next()
  if (FUNCTIONAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Helper: when an authorized previewer lands on /, send them to /preview
  // instead of falling through. CloudFront on Amplify pins the / response in
  // the edge cache (cache-control s-maxage=31536000, cache key ignores
  // cookies), so even with the bypass cookie they'd get the cached gated
  // HTML. /preview lives at a separate URL the cache has never poisoned.
  const sendAuthorizedToPreview = () => {
    if (pathname === '/') {
      const url = req.nextUrl.clone()
      url.pathname = '/preview'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // Path 1 — query string preview key. Set a cookie so subsequent navigation
  // doesn't need the param.
  const previewKey = req.nextUrl.searchParams.get('preview')
  const expectedKey = process.env.COMING_SOON_BYPASS_KEY
  if (expectedKey && previewKey === expectedKey) {
    const url = req.nextUrl.clone()
    url.searchParams.delete('preview')
    // Land them directly on /preview so the very first paint is the real
    // homepage rather than a redirect-then-cache-hit on /.
    url.pathname = '/preview'
    const res = NextResponse.redirect(url)
    res.cookies.set(BYPASS_COOKIE, '1', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
    return res
  }
  if (req.cookies.get(BYPASS_COOKIE)?.value === '1') {
    return sendAuthorizedToPreview()
  }

  // Path 2 — any NextAuth session cookie present. We can't validate the
  // session in middleware (Edge runtime, no Prisma) but the cookie's presence
  // is a sufficient bypass signal: it means the user has at least authenticated
  // recently. They'll still hit auth checks on protected routes.
  for (const hint of SESSION_COOKIE_HINTS) {
    if (req.cookies.get(hint)) return sendAuthorizedToPreview()
  }

  // Otherwise: rewrite to coming-soon.
  const url = req.nextUrl.clone()
  url.pathname = '/coming-soon'
  url.search = ''
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
