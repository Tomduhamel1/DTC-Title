import Link from 'next/link'

// Tab bar shown above teammate pages for broker members only.
//
// When isBrokerMember is false (lender / realtor / generic-teammate users with
// no BrokerMembership), this component renders nothing — preserving the
// pre-PR-4 /teammate/dashboard UI byte-for-byte for those users. Broker
// members see all three tabs (Files / Pipeline / Quotes).
//
// Server component. Receives the already-resolved `isBrokerMember` flag from
// the page so it can render without re-querying.

type TeammateTab = 'files' | 'pipeline' | 'quotes'

interface TabDef {
  key: TeammateTab
  label: string
  href: string
}

const TABS: TabDef[] = [
  { key: 'files', label: 'Files', href: '/teammate/dashboard' },
  { key: 'pipeline', label: 'Pipeline', href: '/teammate/pipeline' },
  { key: 'quotes', label: 'Quotes', href: '/teammate/quotes' },
]

export default function TeammateTabs({
  active,
  isBrokerMember,
}: {
  active: TeammateTab
  isBrokerMember: boolean
}) {
  // Non-broker teammates see no tab bar at all — keeps the existing
  // /teammate/dashboard UI unchanged for lender/realtor users.
  if (!isBrokerMember) return null

  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b border-gray-200">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
            t.key === active
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-600 hover:text-dark-900'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
