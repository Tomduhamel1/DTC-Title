// Browser-safe choices. Loan-rate events are not part of the title-file UI.
export const BORROWER_EMAIL_CHOICES = [
  { kind: 'title_ordered', label: 'File opened', description: 'When the closing team opens the file.' },
  { kind: 'title_search', label: 'Title search update', description: 'When the team records the title-search milestone.' },
  { kind: 'title_issued', label: 'Title policy issued', description: 'When the team records policy issuance.' },
  { kind: 'closed', label: 'File closed', description: 'When the team marks the file closed.' },
] as const
export const BORROWER_EMAIL_KINDS = BORROWER_EMAIL_CHOICES.map(choice => choice.kind)
export type BorrowerEmailKind = typeof BORROWER_EMAIL_CHOICES[number]['kind']
