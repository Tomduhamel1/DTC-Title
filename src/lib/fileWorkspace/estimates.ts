import crypto from 'crypto'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'
import { computeTotals, type FeeReport } from '@/lib/feeReport'
import { resolveAmounts } from '@/lib/feeQuote'
import { stateForZip } from '@/lib/zipToState'
import { stateOffered } from '@/lib/stateMaster'
import { WorkspaceError } from '@/lib/fileWorkspace/errors'

export const EstimateInput = z.object({ transactionType: z.enum(['purchase', 'refinance']),
  zip: z.string().regex(/^\d{5}$/), homeValue: z.number().finite().positive().nullable(),
  loanAmount: z.number().finite().positive().nullable(),
}).strict()
type Basis = { transactionType: string | null; propertyZip: string | null; salePrice: number | null; loanAmount: number | null }
export function estimateBasis(closing: Basis) {
  return { transactionType: closing.transactionType, zip: closing.propertyZip, homeValue: closing.salePrice, loanAmount: closing.loanAmount }
}
const hash = (value: unknown) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
const json = (value: unknown) => JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue

export async function estimateHistory(closingId: string) {
  const closing = await prisma.closing.findUniqueOrThrow({ where: { id: closingId }, include: { feeQuote: true } })
  const versions = await prisma.closingEstimateVersion.findMany({ where: { closingId }, orderBy: { revision: 'asc' } })
  const basis = estimateBasis(closing)
  const validation = EstimateInput.safeParse(basis)
  const missing = !validation.success ? validation.error.issues.map(issue => issue.path.join('.')) :
    !resolveAmounts(validation.data).ok ? [validation.data.transactionType === 'purchase' ? 'homeValue' : 'loanAmount'] : []
  return { versions: versions.map(v => ({ revision: v.revision, source: v.source, report: v.outputJson,
    assumptions: v.assumptions, createdAt: v.createdAt })), basis,
    missingFields: closing.feeQuote ? [] : [...new Set(missing)],
    closed: closing.status === 'closed',
  }
}

export async function createEstimate(closingId: string, actorId: string, expectedRevision: number, override?: unknown) {
  const closing = await prisma.closing.findUniqueOrThrow({ where: { id: closingId }, include: { feeQuote: true } })
  if (closing.status === 'closed') throw new WorkspaceError(409, 'Closed-file estimates cannot be recalculated')
  const latest = await prisma.closingEstimateVersion.findFirst({ where: { closingId }, orderBy: { revision: 'desc' } })
  if ((latest?.revision || 0) !== expectedRevision) throw new WorkspaceError(409, 'Estimate history changed. Refresh before generating another version.')
  const snapshotKey = hash({ basis: estimateBasis(closing), sourceQuote: closing.feeQuote })
  let input: unknown, report: FeeReport, assumptions: string[] = []
  const source = expectedRevision === 0 && closing.feeQuote ? closing.feeQuote : null
  if (source) {
    // Preserve exactly the quote the file originated from, including its original totals/date.
    input = source.inputJson
    report = source.outputJson as unknown as FeeReport
  } else {
    const parsed = EstimateInput.safeParse(override ?? estimateBasis(closing))
    if (!parsed.success) throw new WorkspaceError(422, 'A transaction type, property ZIP and transaction amount are needed for the starting estimate')
    // Explicit zero (cash purchase) is not silently turned into the site's 80% loan assumption.
    const amounts = resolveAmounts(parsed.data)
    if (!amounts.ok) throw new WorkspaceError(422, amounts.error)
    const state = stateForZip(parsed.data.zip)
    if (state && !stateOffered(state, parsed.data.transactionType)) throw new WorkspaceError(422, 'This transaction is not offered in that state')
    if (parsed.data.transactionType === 'purchase' && parsed.data.loanAmount === null) {
      assumptions = ['Loan amount estimated at 80% of purchase price, matching the website quote. This is not a confirmed loan amount.']
    }
    input = { ...parsed.data, resolvedHomeValue: amounts.homeValue, resolvedLoanAmount: amounts.loanAmount }
    try {
      report = await fetchElendFeeEstimate({ transactionType: parsed.data.transactionType, zip: parsed.data.zip,
        homeValue: amounts.homeValue, loanAmount: amounts.loanAmount })
    } catch {
      throw new WorkspaceError(502, 'The fee service could not produce an estimate. No prior version was changed. Please retry.')
    }
    if (!report || !Array.isArray(report.lineItems) || report.isSample) throw new WorkspaceError(502, 'A verified fee estimate is not available yet')
    report.frozenTotals = computeTotals(report)
  }
  if (!report || !Array.isArray(report.lineItems) || report.lineItems.some(line => !Number.isFinite(line.ourCost))) {
    throw new WorkspaceError(422, 'The source quote is incomplete. Ask the closing team to review it.')
  }
  // No fee-provider I/O inside this short transaction. Detect input drift and concurrent revisions.
  return prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`file-estimate:${closingId}`}))`
    const current = await tx.closing.findUniqueOrThrow({ where: { id: closingId }, include: { feeQuote: true } })
    if (current.status === 'closed' || snapshotKey !== hash({ basis: estimateBasis(current), sourceQuote: current.feeQuote })) {
      throw new WorkspaceError(409, 'File details changed while calculating. Please refresh and retry.')
    }
    const newest = await tx.closingEstimateVersion.findFirst({ where: { closingId }, orderBy: { revision: 'desc' } })
    if ((newest?.revision || 0) !== expectedRevision) throw new WorkspaceError(409, 'Another estimate was saved. Refresh to view it.')
    return tx.closingEstimateVersion.create({ data: { closingId, revision: expectedRevision + 1,
      source: source ? 'linked_quote' : 'file_estimate', sourceQuoteId: source?.id, inputHash: hash(input),
      inputJson: json(input), outputJson: json(report), assumptions, actorId } })
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

// Creation/import hooks only; dashboard reads never call the pricing API or write a snapshot.
// The UI explicitly shows missing/pending estimates and offers staff a retry.
export async function ensureInitialEstimate(closingId: string) {
  if (process.env.BC_FILE_WORKSPACE_ENABLED !== 'true') return
  try {
    if (await prisma.closingEstimateVersion.findFirst({ where: { closingId }, select: { id: true } })) return
    await createEstimate(closingId, 'system:file-opening', 0)
  }
  catch { /* File creation must survive unavailable/incomplete pricing. Staff sees a retry, never a made-up total. */ }
}
