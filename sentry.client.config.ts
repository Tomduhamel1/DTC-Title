import * as Sentry from '@sentry/nextjs'
import { isAccessUrl, withoutAccessTelemetry } from './src/lib/auth/accessTelemetry'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn && typeof window !== 'undefined' && !isAccessUrl(window.location.pathname)) {
  Sentry.init({
    dsn,
    beforeSend: withoutAccessTelemetry,
    beforeSendTransaction: withoutAccessTelemetry,
    beforeBreadcrumb: withoutAccessTelemetry,
    tracesSampleRate: 0.1,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
  })
}
