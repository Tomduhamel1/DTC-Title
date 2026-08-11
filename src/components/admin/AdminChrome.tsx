import Link from 'next/link'

export function AdminHeader({
  admin,
  active,
}: {
  admin: { email: string }
  active: 'overview' | 'users' | 'closings' | 'broker-companies' | 'notifications' | 'leads' | 'states'
}) {
  const tabs: { key: typeof active; label: string; href: string }[] = [
    { key: 'overview', label: 'Overview', href: '/admin' },
    { key: 'states', label: 'States', href: '/admin/states' },
    { key: 'users', label: 'Users', href: '/admin/users' },
    { key: 'closings', label: 'Closings', href: '/admin/closings' },
    { key: 'broker-companies', label: 'Broker companies', href: '/admin/broker-companies' },
    { key: 'notifications', label: 'Notifications', href: '/admin/notifications' },
    { key: 'leads', label: 'Leads (legacy)', href: '/admin/leads' },
  ]
  return (
    <header className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-0.5">Admin</div>
          <h1 className="text-3xl font-black text-dark-900">BetterClose</h1>
        </div>
        <div className="text-xs text-gray-500">
          Signed in as <strong className="text-dark-900">{admin.email}</strong>
        </div>
      </div>
      <nav className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
              t.key === active ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-dark-900'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export function Stat({ label, value, accent }: { label: string; value: number; accent?: 'emerald' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 ${accent === 'emerald' ? 'border-emerald-200' : ''}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`text-2xl font-black tabular-nums ${accent === 'emerald' ? 'text-emerald-700' : 'text-dark-900'}`}>{value}</div>
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const palette: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    active: 'bg-blue-100 text-blue-800',
    closed: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        palette[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}
