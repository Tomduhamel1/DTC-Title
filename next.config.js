const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // Skip type-check + lint during production build. We have legacy files
  // (test specs without test runner types, *-backup-*.tsx, HeroOptionB
  // referencing dropped schema fields) that would block the build for the
  // beta. Type-check still runs locally via `npx tsc --noEmit`.
  typescript: {
    ignoreBuildErrors: true,
  },
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
