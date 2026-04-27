import { NextResponse } from 'next/server'

// Resolve the visitor's approximate location via IP geolocation. Used to
// pre-populate the hero calculator with a sensible state/region. No PII is
// stored. Falls back to a national-average shape if lookup fails.

export const dynamic = 'force-dynamic'

interface GeoResponse {
  state: string | null
  city: string | null
  region: string | null
  source: 'ip' | 'fallback'
}

export async function GET(req: Request) {
  // Try to read the visitor's IP from common forwarded headers. Vercel/Cloudflare
  // populate these; in local dev the IP is typically ::1 and ipapi.co will
  // return our dev machine's public IP, which is fine for testing.
  const fwd = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = (fwd?.split(',')[0] || realIp || '').trim()

  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BetterClose/1.0' },
      // Treat as cacheable for 1h since IP→region rarely changes within a session
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`ipapi ${res.status}`)
    const data = await res.json()
    const out: GeoResponse = {
      state: data.region_code || null,
      city: data.city || null,
      region: data.region || null,
      source: 'ip',
    }
    return NextResponse.json(out)
  } catch {
    return NextResponse.json<GeoResponse>({
      state: null,
      city: null,
      region: null,
      source: 'fallback',
    })
  }
}
