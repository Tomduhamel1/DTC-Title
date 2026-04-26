import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1ms-ish DB ping
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, ts: Date.now() })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 503 },
    )
  }
}
