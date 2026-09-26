import * as Sentry from '@sentry/nextjs'
import { withoutAccessTelemetry } from './src/lib/auth/accessTelemetry'

const dsn = process.env.SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    beforeSend: withoutAccessTelemetry,
    beforeSendTransaction: withoutAccessTelemetry,
    beforeBreadcrumb: withoutAccessTelemetry,
    tracesSampleRate: 0.1,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
  })
}
