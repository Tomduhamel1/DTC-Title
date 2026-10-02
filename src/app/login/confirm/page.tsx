import ConfirmSignIn from './ConfirmSignIn'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Confirm sign-in · BetterClose', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }

// No token lookup, session creation or automatic navigation on GET/HEAD.
export default function ConfirmSignInPage() { return <ConfirmSignIn /> }
