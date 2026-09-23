import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/aws/ses'
import { rateLimit } from '@/lib/rate-limit'
import { renderMagicLinkEmail } from '@/lib/email/magic-link'

const dryRun = process.env.AUTH_EMAIL_DRY_RUN === 'true'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify',
  },
  providers: [
    EmailProvider({
      // We never call SMTP — sendVerificationRequest does its own send via SES.
      server: { host: 'unused', port: 0, auth: { user: '', pass: '' } },
      // APP_AWS_* is the deployed name (Amplify reserves bare AWS_* names);
      // the unprefixed read is the local-dev fallback. The last-resort
      // literal must be a VERIFIED SES identity — an unverified domain here
      // makes every send fail with NextAuth's opaque EmailSignin error.
      from:
        process.env.APP_AWS_SES_FROM_EMAIL ||
        process.env.AWS_SES_FROM_EMAIL ||
        'noreply@betterclose.co',
      async sendVerificationRequest({ identifier, url, provider }) {
        // 5 magic-link sends per email per 15 min
        const limit = rateLimit(`magic:${identifier.toLowerCase()}`, 5, 15 * 60 * 1000)
        if (!limit.ok) {
          // eslint-disable-next-line no-console
          console.warn(`[auth] rate-limit hit for ${identifier} — ${Math.round(limit.resetMs / 1000)}s remaining`)
          throw new Error('Too many sign-in requests. Please wait a few minutes.')
        }

        const subject = 'Sign in to BetterClose'
        const htmlBody = renderMagicLinkEmail({ url })
        const textBody = `Sign in to BetterClose\n\nClick the link below to sign in:\n${url}\n\nIf you didn't request this, you can safely ignore this email.\n— BetterClose`

        if (dryRun) {
          // eslint-disable-next-line no-console
          console.log('\n[auth] magic-link (dry run)')
          // eslint-disable-next-line no-console
          console.log(`  to:   ${identifier}`)
          // eslint-disable-next-line no-console
          console.log(`  url:  ${url}\n`)
          return
        }

        await sendEmail({
          to: identifier,
          from: provider.from,
          subject,
          htmlBody,
          textBody,
        })
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-expect-error — augment session with id (not in default types)
        session.user.id = user.id
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      // Claim any orphan Closings that match this user's email but aren't yet
      // attached to a userId. This handles Path B (lender-first): an order
      // arrived, created an unattached closing, and the borrower has now
      // signed in via the welcome email.
      if (!user.email || !user.id) return
      try {
        await prisma.closing.updateMany({
          where: { userId: null, borrowerEmail: user.email.toLowerCase() },
          data: { userId: user.id },
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[auth] failed to claim orphan closings on signIn', e)
      }

      // Also claim any TeammateClosing rows for this email — handles the
      // teammate-first flow: a TPS-ingested closing or a borrower-side share
      // matched their email before they had an account.
      try {
        const { claimTeammateClosingsForUser } = await import('@/lib/teammate/match')
        await claimTeammateClosingsForUser(user.id, user.email)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[auth] failed to claim teammate closings on signIn', e)
      }
    },
  },
}
