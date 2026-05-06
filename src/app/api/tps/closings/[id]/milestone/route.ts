import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MILESTONE_KINDS, type MilestoneKind } from '@/lib/closing'
import { applyMilestoneTransition } from '@/lib/closing-milestone'

// TPS-callable milestone endpoint. Auth: shared secret in
// `Authorization: Bearer <ORDER_INGEST_SECRET>` (same secret used by
// /api/orders/ingest — TPS only needs to manage one credential).
//
// id is a BetterClose Closing.id (returned to TPS in the orders/ingest
// response). TPS should store it on its file record so subsequent
// milestone updates target the right closing.

const Body = z.object({
  kind: z.enum(MILESTONE_KINDS as unknown as [MilestoneKind, ...MilestoneKind[]]),
  status: z.enum(['pending', 'active', 'done']),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.ORDER_INGEST_SECRET || ''}`
  if (!process.env.ORDER_INGEST_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const result = await applyMilestoneTransition({
    closingId: params.id,
    kind: parsed.data.kind,
    status: parsed.data.status,
    origin: 'tps',
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 500 })
  }
  return NextResponse.json(result)
}
