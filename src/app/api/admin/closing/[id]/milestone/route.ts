import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'
import { MILESTONE_KINDS, type MilestoneKind } from '@/lib/closing'
import { applyMilestoneTransition } from '@/lib/closing-milestone'

// Admin UI calls this when an operator toggles a milestone in /admin.
// Shares all side-effect logic (email fanout, fee-report snapshot, audit
// log, idempotency) with the TPS-callable counterpart at
// /api/tps/closings/[id]/milestone.

const Body = z.object({
  kind: z.enum(MILESTONE_KINDS as unknown as [MilestoneKind, ...MilestoneKind[]]),
  status: z.enum(['pending', 'active', 'done']),
})

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireAdmin()
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
    origin: 'admin',
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 500 })
  }
  return NextResponse.json(result)
}
