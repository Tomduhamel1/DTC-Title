/** Shared, dependency-free HTML presentation for external BetterClose email.
 * No delivery, recipient, authentication, tracking or business-state decisions.
 * contentHtml/footerHtml are trusted template markup; escape all interpolated data.
 */
export const EMAIL_THEME = {
  width: 560,
  font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif",
  background: '#f8fafc',
  surface: '#ffffff',
  ink: '#0f172a',
  muted: '#475569',
  border: '#e2e8f0',
  brand: '#047857',
  tint: '#ecfdf5',
} as const

export function escapeEmailHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function renderEmail({ title, context, contentHtml, footerHtml = '' }: {
  title: string
  context?: string
  contentHtml: string
  footerHtml?: string
}): string {
  const t = EMAIL_THEME
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeEmailHtml(title)} · BetterClose</title>
<style>
  @media only screen and (max-width: 600px) {
    .bc-email-outer { padding: 20px 12px !important; }
    .bc-email-content { padding: 28px 24px !important; }
  }
</style>
</head><body style="margin:0;padding:0;background:${t.background};color:${t.ink};font-family:${t.font};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.background}"><tr>
<td class="bc-email-outer" align="center" style="padding:32px 16px;">
<!--[if mso]><table role="presentation" width="${t.width}" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table data-bc-email="v1" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.surface}" style="width:100%;max-width:${t.width}px;border:1px solid ${t.border};border-radius:16px;border-spacing:0;">
<tr><td class="bc-email-content" style="padding:36px 32px;font-family:${t.font};font-size:15px;line-height:24px;color:${t.ink};overflow-wrap:anywhere;word-break:break-word;">
  <div data-bc-brand style="font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.2em;color:${t.ink};margin:0 0 24px;">BETTERCLOSE</div>
  ${context ? `<p data-bc-context style="font-size:12px;line-height:18px;font-weight:600;color:${t.muted};margin:0 0 8px;">${escapeEmailHtml(context)}</p>` : ''}
  <h1 data-bc-title style="font-size:24px;line-height:32px;font-weight:800;color:${t.ink};margin:0 0 20px;">${escapeEmailHtml(title)}</h1>
  ${contentHtml}
  <table data-bc-footer role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:1px solid ${t.border};"><tr><td style="padding-top:20px;font-family:${t.font};font-size:12px;line-height:20px;color:${t.muted};">
    <div style="font-weight:700;margin-bottom:8px;">BetterClose</div>
    ${footerHtml}
  </td></tr></table>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`
}

/** Escape, don't rebuild, the caller's URL: signed tokens/callbacks stay exact. */
export function emailButton(url: string, label: string): string {
  const t = EMAIL_THEME
  return `<table data-bc-action role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;max-width:100%;"><tr><td bgcolor="${t.brand}" style="background:${t.brand};border-radius:8px;text-align:center;mso-padding-alt:14px 24px;">
    <a href="${escapeEmailHtml(url)}" style="display:inline-block;background:${t.brand};border:1px solid ${t.brand};border-radius:8px;padding:13px 23px;font-family:${t.font};font-size:15px;line-height:22px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;overflow-wrap:anywhere;">${escapeEmailHtml(label)}</a>
  </td></tr></table>`
}

export function emailMeta(text: string): string {
  return `<p style="font-size:13px;line-height:20px;color:${EMAIL_THEME.muted};margin:0 0 20px;">${escapeEmailHtml(text)}</p>`
}

export function emailPanel(contentHtml: string): string {
  return `<table data-bc-panel role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background:${EMAIL_THEME.tint};border:1px solid #a7f3d0;border-radius:12px;"><tr><td style="padding:20px;">${contentHtml}</td></tr></table>`
}

export function emailMetric(label: string, value: string, detail: string): string {
  return `<div style="font-size:11px;line-height:18px;font-weight:700;letter-spacing:0.12em;color:${EMAIL_THEME.brand};text-transform:uppercase;">${escapeEmailHtml(label)}</div>
    <div style="font-size:32px;line-height:40px;font-weight:800;color:${EMAIL_THEME.brand};margin:4px 0;">${escapeEmailHtml(value)}</div>
    <div style="font-size:12px;line-height:20px;color:${EMAIL_THEME.muted};">${escapeEmailHtml(detail)}</div>`
}
