import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// When COMING_SOON_MODE=true (set on the live deploy only), redirect public
// marketing pages to /coming-soon. Functional routes — auth, dashboard, the
// fee-estimate flow, the for-my-lender landing, all API routes — stay live so
// the team can keep testing and authenticated users keep working.

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
]

// File extensions and Next internals that should always pass through.
function isStaticAsset(pathname: string) {
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') return true
  // Anything with a file extension (.png, .svg, .css, .js, .webp, etc.)
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

  // Everything else (homepage, /about, /for-brokers, /for-realtors, /security,
  // /pricing, etc.) → coming-soon.
  const url = req.nextUrl.clone()
  url.pathname = '/coming-soon'
  url.search = ''
  return NextResponse.rewrite(url)
}

export const config = {
  // Run on every request except static asset paths handled above.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
