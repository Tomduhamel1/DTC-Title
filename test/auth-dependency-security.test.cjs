// Exercise the installed auth implementation, not a copied normalizer or auth
// mock. Only persistence and BetterClose's mail transport are intercepted.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
// A local baseline run may point at an older installed package. CI always
// exercises this checkout's locked version. No dependency files are modified.
const authRoot = process.env.BC_AUTH_SECURITY_PACKAGE_ROOT || path.dirname(require.resolve('next-auth'));
const { encode, getToken } = require(path.join(authRoot, 'jwt/index.js'));
const signin = require(path.join(authRoot, 'core/routes/signin.js')).default;
const { createHarness } = require('./helpers/email-capture.cjs');
const secret = 'synthetic-auth-regression-secret-never-used-outside-tests';

async function requestMagicLink(email) {
  const harness = createHarness();
  const configured = harness.load('src/lib/auth/options.ts').authOptions.providers[0];
  const lookups = [], tokens = [], callbacks = [];
  const result = await signin({
    body: { email }, query: {},
    options: {
      url: 'https://betterclose.example.invalid/api/auth',
      callbackUrl: 'https://betterclose.example.invalid/dashboard',
      secret, theme: {},
      // EmailProvider's routing metadata; the actual BetterClose send callback
      // is exercised through the captured SES boundary, never default SMTP.
      provider: { id: 'email', type: 'email', maxAge: 86400, ...configured },
      adapter: {
        async getUserByEmail(identifier) { lookups.push(identifier); return null; },
        async createVerificationToken(token) { tokens.push(token); return token; },
      },
      callbacks: { async signIn(value) { callbacks.push(value); return true; } },
      logger: { error() {}, warn() {}, debug() {} },
    },
  });
  return { result, lookups, tokens, callbacks, sent: harness.sent };
}

for (const separator of ['\uFF20', '\uFE6B']) {
  test(`magic links reject an extra compatibility at-sign U+${separator.codePointAt(0).toString(16)}`, async () => {
    const actual = await requestMagicLink(`victim@example.invalid${separator}attacker.invalid`);
    assert.match(actual.result.redirect, /error=EmailSignin$/);
    assert.deepEqual(actual.lookups, [], 'reject before account lookup');
    assert.deepEqual(actual.callbacks, [], 'reject before granting sign-in permission');
    assert.deepEqual(actual.tokens, [], 'no token may be stored');
    assert.deepEqual(actual.sent, [], 'no magic link may be delivered');
  });
}

for (const email of ['victim@@example.invalid', '"Display Name" <victim@example.invalid>']) {
  test(`magic links continue rejecting malformed addresses: ${email}`, async () => {
    const actual = await requestMagicLink(email);
    assert.match(actual.result.redirect, /error=EmailSignin$/);
    assert.equal(actual.lookups.length + actual.tokens.length + actual.sent.length, 0);
  });
}

for (const email of ['  Alex@Example.Invalid  ', ' ＡＬＥＸ＠ＥＸＡＭＰＬＥ．ＩＮＶＡＬＩＤ ']) {
  test(`valid magic-link identity is canonical and identical at every boundary: ${email}`, async () => {
    const actual = await requestMagicLink(email);
    assert.match(actual.result.redirect, /\/verify-request\?provider=email&type=email$/);
    assert.deepEqual(actual.lookups, ['alex@example.invalid']);
    assert.equal(actual.callbacks[0].user.email, 'alex@example.invalid');
    assert.equal(actual.tokens.length, 1);
    assert.equal(actual.tokens[0].identifier, 'alex@example.invalid');
    assert.equal(actual.sent.length, 1);
    assert.equal(actual.sent[0].to, 'alex@example.invalid');
    const link = actual.sent[0].textBody.match(/https:\/\/\S+/)[0];
    assert.equal(new URL(link).searchParams.get('email'), 'alex@example.invalid');
    assert.notEqual(actual.tokens[0].token, new URL(link).searchParams.get('token'), 'persist only the hashed token');
  });
}

for (const authorization of ['Bearer %', 'Bearer %ZZ', 'Bearer %E0%A4%A']) {
  test(`malformed bearer encoding fails closed without throwing: ${authorization}`, async () => {
    assert.equal(await getToken({ req: { headers: { authorization }, cookies: {} }, secret }), null);
  });
}

test('valid bearer and session-cookie tokens still decode', async () => {
  const token = await encode({ secret, token: { sub: 'synthetic-user', email: 'alex@example.invalid' } });
  for (const req of [
    { headers: { authorization: `Bearer ${encodeURIComponent(token)}` }, cookies: {} },
    { headers: {}, cookies: { 'next-auth.session-token': token } },
  ]) {
    const actual = await getToken({ req, secret, secureCookie: false });
    assert.equal(actual.sub, 'synthetic-user');
    assert.equal(actual.email, 'alex@example.invalid');
  }
});
