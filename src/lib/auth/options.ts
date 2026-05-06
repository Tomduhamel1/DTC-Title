import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/aws/ses'
import { rateLimit } from '@/lib/rate-limit'

const dryRun = process.env.AUTH_EMAIL_DRY_RUN === 'true'

export const authOptions: NextAuthOptions = {
  // @ts-expect-error — adapter typing differs slightly between @auth/prisma-adapter and next-auth v4 but works at runtime
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
      from: process.env.AWS_SES_FROM_EMAIL || 'noreply@truefeeclosing.com',
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

function renderMagicLinkEmail({ url }: { url: string }) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;padding:40px 20px;color:#0f172a;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px;border:1px solid #e2e8f0;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE</div>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 12px 0;">Sign in to your dashboard</h1>
    <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 28px 0;">Click the button below to sign in. The link expires in 24 hours.</p>
    <a href="${url}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">Sign in to BetterClose →</a>
    <p style="font-size:12px;color:#94a3b8;margin-top:32px;">If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>`
}
