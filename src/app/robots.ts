import type { MetadataRoute } from 'next'
import { PUBLIC_ORIGIN } from '@/lib/publicMetadata'

export default function robots(): MetadataRoute.Robots {
  if (process.env.COMING_SOON_MODE === 'true') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: [
      '/api/', '/admin', '/dashboard', '/settings', '/teammate', '/login',
      '/file-access', '/resume', '/welcome', '/preview', '/coming-soon',
      '/open', '/start', '/for-my-team', '/quote/',
    ] },
    sitemap: `${PUBLIC_ORIGIN}/sitemap.xml`,
  }
}
