const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type checking is enabled for production builds and in CI. Lint remains
  // unchanged here; its separate legacy cleanup is outside this fix.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // The homepage is gated by the coming-soon middleware which inspects the
  // cs_bypass cookie / NextAuth session. CloudFront's default cache key on
  // Amplify ignores cookies, so without an explicit no-store header it
  // pinned a single rendered HTML response (often the gated one) and served
  // it to every visitor regardless of bypass state. Force no-store on /
  // so the middleware runs per-request.
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      // Same CloudFront problem, different blast radius: /login was being
      // pinned with s-maxage=31536000 and served from the edge for hours
      // (observed age=22465). The page reads NextAuth state per request —
      // the CSRF token, the ?callbackUrl and ?error params — so a cached
      // copy hands every visitor stale auth state, and the sign-in callback
      // then rejects the mismatch as "the link is no longer valid".
      // Auth pages must never be edge-cached.
      {
        source: '/login',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/login/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ]
  },
  // /for-my-lender was renamed to /for-my-team. Permanent redirect so
  // already-sent outreach emails (which contain /for-my-lender?ref=...)
  // keep working forever.
  async redirects() {
    return [
      {
        source: '/for-my-lender',
        destination: '/for-my-team',
        permanent: true,
      },
      {
        source: '/for-my-lender/:path*',
        destination: '/for-my-team/:path*',
        permanent: true,
      },
      // /pricing ran on a placeholder-constant fee engine (retired in the
      // pricing-audit cleanup). The real estimate flow is /quote.
      {
        source: '/pricing',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/pricing/:path*',
        destination: '/quote',
        permanent: true,
      },
      // Old TrueFee-branded refi-quote print page, removed in the same cleanup.
      {
        source: '/quote/:quoteId/print',
        destination: '/quote',
        permanent: true,
      },
    ]
  },
}

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
}

module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
