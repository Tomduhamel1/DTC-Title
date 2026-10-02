import { formatCurrency, type FeeReport } from '@/lib/feeReport'

/** The transaction's stated basis, not a fee or a recalculated quote value. */
export function feeReportAmountLabel(report: Pick<FeeReport, 'transactionType' | 'homeValue' | 'loanAmount'>): string {
  const purchase = report.transactionType === 'purchase'
  const label = purchase ? 'Purchase price' : 'Loan amount'
  const amount = purchase ? report.homeValue : report.loanAmount
  // Older saved quotes may not carry a loan amount. Never substitute the
  // property value or portray missing/invalid information as a zero-dollar loan.
  return `${label} ${typeof amount === 'number' && Number.isFinite(amount) && amount > 0
    ? formatCurrency(amount)
    : 'unavailable'}`
}
