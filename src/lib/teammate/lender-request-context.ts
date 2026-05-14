import { prisma } from '@/lib/db'

// Server-side helper used by /for-my-team to look up the LenderRequest a
// recipient was emailed and hydrate everything we know about the borrower's
// closing. The page uses this to pre-fill the "Email your order" mailto so
// the recipient doesn't have to retype property/loan/contact info.
//
// `refId` comes from the email's review URL (e.g. /for-my-team?ref=abc12345).
// Returns null when refId is missing or unknown — the page falls back to the
// generic order template in that case.

export interface LenderRequestContext {
  refId: string
  closing: {
    id: string
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
    propertyType: string | null
    salePrice: number | null
    loanAmount: number | null
    closingDate: Date | null
    lenderName: string | null
    lenderCompany: string | null
    lenderEmail: string | null
    lenderPhone: string | null
    lenderNmls: string | null
    agentName: string | null
    agentCompany: string | null
    agentEmail: string | null
    agentPhone: string | null
    borrowerEmail: string | null
    borrowerPhone: string | null
  } | null
  borrower: {
    id: string
    name: string | null
    email: string
    phone: string | null
  } | null
  // The "client name" the borrower typed into the share form, if different
  // from their account display name. Useful when the borrower hasn't
  // populated their User.name field yet.
  clientName: string | null
  // Persisted savings number the borrower's own /quote flow stamped onto the
  // LenderRequest when they shared. Used by /for-my-team to show a realistic
  // "this is what your client will see" preview without re-calling the fee
  // API. Null when the borrower shared without running /quote first.
  savingsEstimate: number | null
}

export async function getLenderRequestContext(
  refId: string | undefined,
): Promise<LenderRequestContext | null> {
  if (!refId) return null

  const row = await prisma.lenderRequest.findUnique({
    where: { refId },
    include: {
      closing: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  })

  if (!row) return null

  return {
    refId,
    closing: row.closing
      ? {
          id: row.closing.id,
          propertyAddress: row.closing.propertyAddress,
          propertyCity: row.closing.propertyCity,
          propertyState: row.closing.propertyState,
          propertyZip: row.closing.propertyZip,
          propertyType: row.closing.propertyType,
          salePrice: row.closing.salePrice,
          loanAmount: row.closing.loanAmount,
          closingDate: row.closing.closingDate,
          lenderName: row.closing.lenderName,
          lenderCompany: row.closing.lenderCompany,
          lenderEmail: row.closing.lenderEmail,
          lenderPhone: row.closing.lenderPhone,
          lenderNmls: row.closing.lenderNmls,
          agentName: row.closing.agentName,
          agentCompany: row.closing.agentCompany,
          agentEmail: row.closing.agentEmail,
          agentPhone: row.closing.agentPhone,
          borrowerEmail: row.closing.borrowerEmail,
          borrowerPhone: row.closing.borrowerPhone,
        }
      : null,
    borrower: row.user,
    clientName: row.clientName,
    savingsEstimate: row.savingsEstimate,
  }
}

// Build the mailto body the recipient sees when they click "Email your order".
// Includes everything we know — property, loan, borrower, and any teammate
// contacts already on file — formatted as labeled lines. Empty fields are
// skipped cleanly. Fall back to a generic template when ctx is null.
export function buildOrderMailto(
  ctx: LenderRequestContext | null,
): { subject: string; body: string } {
  if (!ctx || !ctx.closing) {
    return {
      subject: ctx?.refId
        ? `New title order — ref ${ctx.refId}`
        : 'New title order',
      body: GENERIC_ORDER_TEMPLATE,
    }
  }

  const c = ctx.closing
  const borrowerName = ctx.borrower?.name || ctx.clientName || ''
  const lastName = borrowerName.trim().split(/\s+/).slice(-1)[0] || ''

  const cityLine = [c.propertyCity, c.propertyState, c.propertyZip]
    .filter(Boolean)
    .join(', ')
  const fullAddress = [c.propertyAddress, cityLine].filter(Boolean).join(', ')

  // Subject: "New title order — Doe at 123 Main St (ref: abc12345)"
  const subjectParts = ['New title order']
  if (lastName || fullAddress) {
    const detail = [lastName, fullAddress && `at ${fullAddress}`].filter(Boolean).join(' ')
    if (detail) subjectParts.push(`— ${detail}`)
  }
  subjectParts.push(`(ref: ${ctx.refId})`)
  const subject = subjectParts.join(' ')

  // Body: labeled blocks. Skip empty fields. Format money as $1,234,567.
  const fmtMoney = (n: number | null) =>
    n != null ? `$${Math.round(n).toLocaleString()}` : null
  const fmtDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null

  const lines: string[] = []
  lines.push('Hi BetterClose team,')
  lines.push('')
  lines.push(`Please open a new title file (ref: ${ctx.refId}).`)
  lines.push('')

  // Borrower
  const borrowerLines = [
    borrowerName && `Name: ${borrowerName}`,
    (c.borrowerEmail || ctx.borrower?.email) && `Email: ${c.borrowerEmail || ctx.borrower?.email}`,
    (c.borrowerPhone || ctx.borrower?.phone) && `Phone: ${c.borrowerPhone || ctx.borrower?.phone}`,
  ].filter(Boolean)
  if (borrowerLines.length) {
    lines.push('Borrower')
    lines.push(...(borrowerLines as string[]).map((s) => `  ${s}`))
    lines.push('')
  }

  // Property
  const propertyLines = [
    fullAddress && `Address: ${fullAddress}`,
    c.propertyType && `Type: ${c.propertyType}`,
  ].filter(Boolean)
  if (propertyLines.length) {
    lines.push('Property')
    lines.push(...(propertyLines as string[]).map((s) => `  ${s}`))
    lines.push('')
  }

  // Transaction
  const txnLines = [
    fmtMoney(c.salePrice) && `Sale price: ${fmtMoney(c.salePrice)}`,
    fmtMoney(c.loanAmount) && `Loan amount: ${fmtMoney(c.loanAmount)}`,
    fmtDate(c.closingDate) && `Estimated closing date: ${fmtDate(c.closingDate)}`,
  ].filter(Boolean)
  if (txnLines.length) {
    lines.push('Transaction')
    lines.push(...(txnLines as string[]).map((s) => `  ${s}`))
    lines.push('')
  }

  // Lender
  const lenderLines = [
    c.lenderName && `Name: ${c.lenderName}`,
    c.lenderCompany && `Company: ${c.lenderCompany}`,
    c.lenderEmail && `Email: ${c.lenderEmail}`,
    c.lenderPhone && `Phone: ${c.lenderPhone}`,
    c.lenderNmls && `NMLS: ${c.lenderNmls}`,
  ].filter(Boolean)
  if (lenderLines.length) {
    lines.push('Lender / Loan officer')
    lines.push(...(lenderLines as string[]).map((s) => `  ${s}`))
    lines.push('')
  }

  // Agent
  const agentLines = [
    c.agentName && `Name: ${c.agentName}`,
    c.agentCompany && `Brokerage: ${c.agentCompany}`,
    c.agentEmail && `Email: ${c.agentEmail}`,
    c.agentPhone && `Phone: ${c.agentPhone}`,
  ].filter(Boolean)
  if (agentLines.length) {
    lines.push('Real estate agent')
    lines.push(...(agentLines as string[]).map((s) => `  ${s}`))
    lines.push('')
  }

  lines.push('Anything else we should know:')
  lines.push('')
  lines.push('Thanks,')

  return { subject, body: lines.join('\n') }
}

const GENERIC_ORDER_TEMPLATE = `Hi BetterClose team,

Please open a new title file:

Borrower(s):
Property address:
City, State, Zip:
Estimated closing date:
Loan amount:
Transaction type: (purchase / refinance)
Sale price (if purchase):

Lender / loan officer name:
Company:
Phone:
NMLS:

Anything else we should know:

Thanks,`
