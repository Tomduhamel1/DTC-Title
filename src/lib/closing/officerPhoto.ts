// Server-side, owner-approved headshots. Match the assigned Garden employee's
// exact email, never a first name or a borrower/Pro contact. Resolve on reads so
// existing and future files benefit without rewriting any closing records.
// The purity annotation lets the production bundler discard this registry when
// a client imports unrelated shared milestone constants through closing.ts.
const APPROVED_PHOTOS: Readonly<Record<string, string>> = /*#__PURE__*/ Object.freeze({
  'kdeyton@firstnte.com': 'kristen-deyton-ec0e43a7.jpg',
  'steve@firstnte.com': 'steve-patti-7e73be41.jpg',
  'nmicciche@firstnte.com': 'nicole-micciche-af371149.jpg',
  'barrington@firstnte.com': 'brittany-arrington-e9d3a3b8.jpg',
})

export function officerPhotoUrl(officer: {
  escrowOfficerEmail?: string | null
  escrowOfficerPhotoUrl?: string | null
}): string | null {
  // Preserve explicitly maintained file photos, including invalid values which
  // must still fail the existing notification validation rather than be masked.
  if (officer.escrowOfficerPhotoUrl?.trim()) return officer.escrowOfficerPhotoUrl
  const email = officer.escrowOfficerEmail?.trim().toLowerCase() || ''
  if (!Object.hasOwn(APPROVED_PHOTOS, email)) return null
  // Public HTTPS URLs are required by email clients (no session or signed URL).
  return `https://betterclose.co/images/escrow-officers/${APPROVED_PHOTOS[email]}`
}
