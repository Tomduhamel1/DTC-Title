import RoleSelfIdentifyPicker from './RoleSelfIdentifyPicker'

// Server component shown at the top of /teammate/dashboard whenever the
// signed-in user has at least one TeammateClosing with role='unknown'.
//
// The borrower-led invite path is role-agnostic on purpose — the borrower
// shouldn't have to know whether their teammate is a mortgage broker, loan
// officer, or real estate agent. The professional self-identifies their own
// role from this prompt. Selecting a concrete role clears the row from this
// banner; selecting "Other closing team member" keeps role='unknown' and the
// banner persists (acceptable for v1; a dismissedAt column can come later).

interface UnknownRow {
  membershipId: string
  closingId: string
  propertyAddress: string | null
  borrowerLabel: string | null
}

interface Props {
  rows: UnknownRow[]
  hasBrokerMembership: boolean
}

export default function RoleSelfIdentifyBanner({ rows, hasBrokerMembership }: Props) {
  if (rows.length === 0) return null

  return (
    <section
      className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 mb-6"
      aria-label="Self-identify your role"
    >
      <div className="mb-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800 mb-1">
          Tell us your role
        </div>
        <h2 className="text-lg sm:text-xl font-black text-dark-900 mb-1.5">
          How are you involved in {rows.length === 1 ? 'this closing' : 'these closings'}?
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Pick your role on each file so we can label it correctly and send the
          right kind of updates. You can answer one and come back to the rest later.
        </p>
      </div>

      <RoleSelfIdentifyPicker rows={rows} hasBrokerMembership={hasBrokerMembership} />
    </section>
  )
}
