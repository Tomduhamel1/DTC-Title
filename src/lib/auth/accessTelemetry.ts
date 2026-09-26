// Access credentials, even short-lived ones, must not enter telemetry.
export function isAccessUrl(value: string) {
  return /\/(?:file-access|api\/file-access|api\/auth\/callback)(?:[/?#]|$)/.test(value)
}

export function withoutAccessTelemetry<T>(event: T): T | null {
  // Covers request URLs, navigation breadcrumbs and nested HTTP spans. Dropping
  // the whole sensitive event avoids accidentally retaining a body or token.
  return isAccessUrl(JSON.stringify(event)) ? null : event
}
