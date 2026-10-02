export type EmailConfirmation = { token: string; email: string; callbackUrl: string }

// Shared by the email, confirmation page and callback boundary. Never trust a
// destination supplied by a link, Host header or forwarded request header.
export function readEmailConfirmation(params: URLSearchParams, origin: string): EmailConfirmation | null {
  const token = params.get('token') || ''
  const email = params.get('email') || ''
  if (params.getAll('token').length !== 1 || params.getAll('email').length !== 1 ||
    params.getAll('callbackUrl').length > 1 || !/^[a-f0-9]{64}$/.test(token) ||
    email.length > 254 || !/^[^\s@,;<>"\x00-\x1f]+@[^\s@,;<>"\x00-\x1f]+\.[^\s@,;<>"\x00-\x1f]+$/.test(email)) return null
  try {
    const destination = new URL(params.get('callbackUrl') || '/dashboard', origin)
    if (destination.origin !== origin || destination.username || destination.password) return null
    return { token, email, callbackUrl: destination.pathname + destination.search + destination.hash }
  } catch { return null }
}

export function emailConfirmationUrl(callback: string, origin: string): string {
  const url = new URL(callback)
  const data = url.origin === origin && url.pathname === '/api/auth/callback/email'
    ? readEmailConfirmation(url.searchParams, origin) : null
  if (!data) throw new Error('Invalid sign-in link')
  // Fragments are not sent in HTTP requests or Referer headers. Rendering the
  // landing page cannot consume a token, even when a mail scanner runs JS.
  return origin + '/login/confirm#' + new URLSearchParams(data).toString()
}

// Used only after the existing file-access page's explicit button click.
// Native POST navigation lets NextAuth set its own cookies and redirect;
// no session is manufactured by the application or carried in a URL.
export function submitEmailCallback(callback: string) {
  const url = new URL(callback)
  const data = url.origin === window.location.origin && url.pathname === '/api/auth/callback/email'
    ? readEmailConfirmation(url.searchParams, window.location.origin) : null
  if (!data) throw new Error('Invalid sign-in response')
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = '/api/auth/callback/email'
  for (const [name, value] of Object.entries(data)) {
    const input = document.createElement('input')
    input.type = 'hidden'; input.name = name; input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}
