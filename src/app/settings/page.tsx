import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import NavigationCredible from '@/components/NavigationCredible'
import BorrowerEmailSetting from '@/components/teammate/BorrowerEmailSetting'

export const dynamic = 'force-dynamic'
export default async function SettingsPage() {
  const actor = await requireUser()
  if (!actor) redirect('/login?callbackUrl=/settings')
  const user = await prisma.user.findUniqueOrThrow({ where: { id: actor.id } })
  const pro = user.accountType === 'professional' || await prisma.teammateClosing.count({ where: {
    userId: user.id, matchedEmail: user.email.toLowerCase(), mayManageBorrowerEmails: true,
    role: { in: ['broker', 'lender', 'realtor'] },
  } }) > 0
  return <><NavigationCredible /><main className="min-h-screen bg-gray-100 px-4 pb-12 pt-28 text-dark-900"><div className="mx-auto max-w-3xl space-y-5">
    <Link href="/dashboard" className="text-sm text-emerald-700">← My dashboard</Link>
    <h1 className="text-3xl font-bold">My settings</h1>
    <p className="text-sm text-gray-600">Signed in as {user.email}</p>
    {pro && <BorrowerEmailSetting defaults initialTypes={user.borrowerEmailDefaults} />}
    <section className="rounded-2xl border bg-white p-5"><h2 className="font-bold">My own file updates</h2>
      <p className="mt-2 text-sm text-gray-600">Manage your own updates on each file. Borrower defaults do not change the emails you receive.</p>
      <Link href={pro ? '/teammate/dashboard' : '/dashboard'} className="mt-3 inline-block text-sm font-semibold text-emerald-700">View my files →</Link>
    </section>
    <Link href="/dashboard#contacts" className="inline-block text-sm text-emerald-700">File contacts →</Link>
  </div></main></>
}
