import type { Metadata } from 'next'
import { SUPPORT_PHONE_TEL } from '@/lib/contact'

// Preserve the existing metadata origin. Host redirects require a separate
// auth/callback review; canonical links apply only to public pages here.
export const PUBLIC_ORIGIN = 'https://betterclose.co'
export const PUBLIC_PATHS = [
  '/', '/about', '/security', '/quote', '/for-brokers', '/for-realtors',
  '/for-lenders', '/licenses', '/privacy', '/terms',
  '/compare-title-fees', '/guides/keep-your-realtor-and-lender',
] as const

export function publicMetadata(path: typeof PUBLIC_PATHS[number], title: string, description: string): Metadata {
  const url = new URL(path, PUBLIC_ORIGIN).href
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', siteName: 'BetterClose', title, description, url },
    twitter: { card: 'summary', title, description },
  }
}

export const organizationData = {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': `${PUBLIC_ORIGIN}/#organization`, name: 'BetterClose',
  legalName: 'First National Title & Escrow LLC', url: PUBLIC_ORIGIN,
  telephone: SUPPORT_PHONE_TEL,
}
