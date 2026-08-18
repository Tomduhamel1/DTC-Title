// /login and /login/verify must never be statically prerendered or
// edge-cached. `page.tsx` is a client component with no segment config, so
// Next prerendered it to static HTML and Amplify's CloudFront served it with
// `s-maxage=31536000` — observed serving a 6-hour-old copy (age=22465).
//
// The page reads per-request auth state (the NextAuth CSRF token, plus the
// ?callbackUrl and ?error query params), so a cached copy hands visitors
// stale auth state and the sign-in callback rejects the mismatch as
// "the link is no longer valid" — immediately, on every attempt, even with a
// perfectly valid unconsumed token. (Found 2026-08-18: valid tokens and live
// sessions in the database while every real browser failed to sign in.)
//
// force-dynamic makes the route render per request, which drops the static
// s-maxage header that the next.config.js `headers()` rule could not override.
export const dynamic = 'force-dynamic'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
