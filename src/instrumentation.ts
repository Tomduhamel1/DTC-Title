// Next.js instrumentation hook — runs once when the server boots.
// AWS Amplify Hosting forbids env-var keys that start with "AWS_", so we
// configure those values under APP_AWS_* prefixes and copy them onto the
// canonical AWS_* names here. This way the rest of the codebase + AWS SDK
// auto-discovery continues to work unchanged.

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const map: Record<string, string> = {
    APP_AWS_REGION: 'AWS_REGION',
    APP_AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    APP_AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    APP_AWS_S3_BUCKET: 'AWS_S3_BUCKET',
    APP_AWS_SES_FROM_EMAIL: 'AWS_SES_FROM_EMAIL',
  }

  for (const [src, dest] of Object.entries(map)) {
    const v = process.env[src]
    if (v && !process.env[dest]) {
      process.env[dest] = v
    }
  }
}
