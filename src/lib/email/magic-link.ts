import { emailButton, renderEmail } from './layout'

// Pure renderer only. NextAuth retains token creation, expiry and delivery.
export function renderMagicLinkEmail({ url }: { url: string }): string {
  return renderEmail({
    title: 'Sign in to your dashboard',
    contentHtml: `<p>Click the button below to sign in. The link expires in 24 hours.</p>
      ${emailButton(url, 'Sign in to BetterClose →')}`,
    footerHtml: "If you didn't request this, you can safely ignore this email.",
  })
}
