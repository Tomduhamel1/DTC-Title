// Pure presentation data shared by the real timeline and marketing examples.
// Keep database/runtime modules out of the marketing client bundle.
export const MILESTONE_LABELS = {
  loan_locked: 'Loan locked',
  title_ordered: 'Title ordered',
  title_search: 'Title search complete',
  title_issued: 'Title issued',
  closed: 'Closed',
} as const

export const MILESTONE_DESCRIPTIONS = {
  loan_locked: 'Your lender finalizes your interest rate.',
  title_ordered: 'Your closing team opened your title order with BetterClose.',
  title_search: 'The closing team reviews the title commitment, requirements and exceptions.',
  title_issued: 'The closing team records issuance of the title insurance policy.',
  closed: 'The closing team marks the file closed. Ask your escrow officer about recording and disbursement status.',
} as const
