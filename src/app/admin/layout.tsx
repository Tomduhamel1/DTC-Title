import { requireAdmin } from '@/lib/auth/admin'

// Defense-in-depth: every /admin page also calls requireAdmin() itself by
// convention, but protection was previously per-page only — a new page that
// forgot the call would have been silently public. The layout guard makes
// that impossible. (Layouts don't re-run on soft navigation between admin
// pages, hence keeping the per-page calls too.)
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <>{children}</>
}
