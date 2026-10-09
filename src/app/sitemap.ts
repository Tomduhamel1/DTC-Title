import type { MetadataRoute } from 'next'
import { PUBLIC_ORIGIN, PUBLIC_PATHS } from '@/lib/publicMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.COMING_SOON_MODE === 'true') return []
  // Explicit allowlist: never enumerate quote IDs, file tokens or account routes.
  // No fabricated lastModified dates; add dates only when content history supports them.
  return PUBLIC_PATHS.map(path => ({ url: new URL(path, PUBLIC_ORIGIN).href }))
}
