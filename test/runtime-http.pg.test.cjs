// Exercise the compiled Next server, real NextAuth and Prisma (not route mocks).
// Synthetic fixtures, loopback PostgreSQL and email dry-run only.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { PrismaClient } = require('@prisma/client');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createServer, isIP } = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');
const path = require('node:path');
const fs = require('node:fs');
// Next loads dotenv files independently of spawn's environment allowlist.
// Require the same secret-free checkout used by CI before starting or writing.
for (const file of ['.env', '.env.local', '.env.production', '.env.production.local']) {
  assert.equal(fs.existsSync(path.resolve(__dirname, '..', file)), false,
    'Run runtime checks in a clean isolated checkout without ' + file);
}
const target = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['127.0.0.1', 'localhost'].includes(target.hostname));
assert.match(target.pathname, /^\/garden_ldi_betterclose_journeys(?:_[a-z0-9]+)*$/);
const prisma = new PrismaClient();
const prefix = 'bchttp-' + Date.now() + '-';
let server, origin, serverLog = '', verifiedTarget = false;
const actors = {};
let owned, foreign;
const syntheticSecret = prefix + 'not-a-real-integration-key';
const cookie = actor => `next-auth.session-token=${prefix}${actor}-session`;
function request(route, options = {}) {
  const url = new URL(route, origin);
  assert.equal(url.origin, origin, 'HTTP tests must stay on the local server');
  return fetch(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(15000) });
}
function captureCookies(response) {
  return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
}
before(async () => {
  const [identity] = await prisma.$queryRawUnsafe('SELECT current_database() AS db, current_user AS role, inet_server_addr()::text AS host');
  assert.equal(identity.db, target.pathname.slice(1));
  assert.equal(identity.role, decodeURIComponent(target.username));
  const containerHost = process.env.GITHUB_ACTIONS === 'true' ? process.env.BC_TEST_POSTGRES_ADDR : undefined;
  assert.ok(['127.0.0.1/32', '127.0.0.1', '::1/128', '::1'].includes(identity.host) ||
    (containerHost && isIP(containerHost) && identity.host.replace(/\/\d+$/, '') === containerHost));
  verifiedTarget = true;
  for (const actor of ['borrower', 'other', 'pro']) {
    actors[actor] = await prisma.user.create({ data: {
      id: prefix + actor, email: prefix + actor + '@example.invalid',
      emailVerified: new Date(), name: 'Synthetic ' + actor,
      sessions: { create: { sessionToken: prefix + actor + '-session', expires: new Date(Date.now() + 3600000) } },
    } });
  }
  owned = await prisma.closing.create({ data: {
    id: prefix + 'owned', userId: actors.borrower.id, borrowerEmail: actors.borrower.email,
    propertyAddress: '123 Synthetic Runtime Lane', status: 'active', gardenFileNumber: prefix + 'FILE',
    escrowOfficerName: 'Synthetic Officer',
    milestones: { create: ['loan_locked', 'title_ordered', 'title_search', 'title_issued', 'closed'].map(kind => ({ kind })) },
    teammates: { create: { userId: actors.pro.id, matchedEmail: actors.pro.email, role: 'broker' } },
  } });
  foreign = await prisma.closing.create({ data: {
    id: prefix + 'foreign', userId: actors.other.id, borrowerEmail: actors.other.email,
    propertyAddress: '456 Private Runtime Lane', status: 'active',
  } });
  const portFinder = createServer();
  portFinder.listen(0, '127.0.0.1'); await once(portFinder, 'listening');
  const port = portFinder.address().port;
  await new Promise(resolve => portFinder.close(resolve));
  origin = `http://127.0.0.1:${port}`;
  // Allowlist, never inherit AWS, integration, telemetry or production DB keys.
  server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: path.resolve(__dirname, '..'),
    env: { PATH: process.env.PATH, NODE_ENV: 'production', DATABASE_URL: target.href,
      NEXTAUTH_URL: origin, NEXTAUTH_SECRET: prefix + 'synthetic-auth-secret', AUTH_EMAIL_DRY_RUN: 'true',
      ORDER_INGEST_SECRET: syntheticSecret, ADMIN_EMAILS: 'admin@example.invalid',
      COMING_SOON_MODE: 'true', COMING_SOON_BYPASS_KEY: prefix + 'synthetic-preview', NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', value => { serverLog = (serverLog + value).slice(-1000000); });
  server.stderr.on('data', value => { serverLog = (serverLog + value).slice(-1000000); });
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, serverLog);
    try { if ((await request('/login')).status === 200) return; } catch {}
    await delay(100);
  }
  assert.fail('Local production server did not start: ' + serverLog);
}, { timeout: 45000 });
after(async () => {
  try {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = once(server, 'exit'); server.kill('SIGTERM');
      const force = setTimeout(() => server.kill('SIGKILL'), 5000);
      await exited; clearTimeout(force);
    }
    if (verifiedTarget) {
      await prisma.verificationToken.deleteMany({ where: { identifier: { startsWith: prefix } } });
      await prisma.closing.deleteMany({ where: { id: { startsWith: prefix } } });
      await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
    }
  } finally { await prisma.$disconnect(); }
});

test('real session endpoint distinguishes anonymous, invalid and valid sessions without shared caching', async () => {
  for (const session of ['', 'next-auth.session-token=invalid']) {
    const response = await request('/api/auth/session', { headers: { cookie: session } });
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), {});
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
  const response = await request('/api/auth/session', { headers: { cookie: cookie('borrower') } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).user.id, actors.borrower.id);
  assert.match(response.headers.get('cache-control'), /no-store/);
});

test('real magic-link sign-in validates CSRF, creates a session and rejects token reuse without sending email', async () => {
  const csrfResponse = await request('/api/auth/csrf');
  const csrf = await csrfResponse.json(); const cookies = captureCookies(csrfResponse);
  const beforeLog = serverLog.length;
  const signIn = await request('/api/auth/signin/email', { method: 'POST',
    headers: { cookie: cookies, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email: actors.borrower.email, csrfToken: csrf.csrfToken,
      callbackUrl: origin + '/dashboard?closingId=' + owned.id, json: 'true' }),
  });
  assert.equal(signIn.status, 200);
  assert.match((await signIn.json()).url, /verify-request/);
  const log = serverLog.slice(beforeLog);
  assert.match(log, /magic-link \(dry run\)/);
  const link = log.match(/url:\s+(http:\/\/[^\s]+)/)?.[1];
  assert.ok(link, 'Synthetic dry-run link must be generated');
  const response = await request(link, { headers: { cookie: cookies } });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), origin + '/dashboard?closingId=' + owned.id);
  const sessionCookies = captureCookies(response);
  assert.match(sessionCookies, /next-auth.session-token=/);
  const session = await request('/api/auth/session', { headers: { cookie: sessionCookies } });
  assert.equal((await session.json()).user.id, actors.borrower.id);
  const reused = await request(link, { headers: { cookie: cookies } });
  assert.match(reused.headers.get('location'), /error=Verification/);
  assert.doesNotMatch(captureCookies(reused), /next-auth.session-token=[^;]/);
  assert.equal(await prisma.verificationToken.count({ where: { identifier: actors.borrower.email } }), 0);
});

test('compiled borrower dashboard awaits search parameters and refuses another file without fallback writes', async () => {
  const response = await request('/dashboard?closingId=' + owned.id, { headers: { cookie: cookie('borrower') } });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes(owned.propertyAddress)); assert.ok(!html.includes(foreign.propertyAddress));
  assert.match(response.headers.get('cache-control'), /no-store/);
  const before = await prisma.closing.count({ where: { userId: actors.borrower.id } });
  for (const id of [foreign.id, 'missing', '']) {
    const denied = await request('/dashboard?closingId=' + id, { headers: { cookie: cookie('borrower') } });
    const body = await denied.text();
    // Streamed App Router notFound can retain 200; both forms must carry the
    // actual Next 404 result, never a fallback file or private address.
    assert.ok(denied.status === 404 || body.includes('NEXT_HTTP_ERROR_FALLBACK;404'));
    assert.ok(!body.includes(foreign.propertyAddress)); assert.ok(!body.includes(owned.propertyAddress));
  }
  assert.equal(await prisma.closing.count({ where: { userId: actors.borrower.id } }), before);
});

test('compiled Pro detail awaits route parameters and preserves per-file access', async () => {
  const response = await request('/teammate/dashboard/' + owned.id, { headers: { cookie: cookie('pro') } });
  assert.equal(response.status, 200); assert.ok((await response.text()).includes(owned.propertyAddress));
  const denied = await request('/teammate/dashboard/' + foreign.id, { headers: { cookie: cookie('pro') } });
  const body = await denied.text();
  assert.ok(denied.status === 404 || body.includes('NEXT_HTTP_ERROR_FALLBACK;404'));
  assert.ok(!body.includes(foreign.propertyAddress));
});

test('compiled integration snapshot awaits id, enforces the key and makes no delivery or closing writes', async () => {
  const before = await prisma.closing.findUnique({ where: { id: owned.id } });
  const deliveries = await prisma.ingestDelivery.count({ where: { closingId: owned.id } });
  for (const key of ['', 'Bearer wrong']) {
    assert.equal((await request('/api/tps/closings/' + owned.id, { headers: { authorization: key } })).status, 401);
  }
  const response = await request('/api/tps/closings/' + owned.id, { headers: { authorization: 'Bearer ' + syntheticSecret } });
  assert.equal(response.status, 200);
  const data = await response.json(); assert.equal(data.closing.id, owned.id);
  assert.ok(data.closing.notificationReadiness); assert.equal(data.closing.milestones.length, 5);
  assert.equal((await request('/api/tps/closings/missing', { headers: { authorization: 'Bearer ' + syntheticSecret } })).status, 404);
  assert.deepEqual(await prisma.closing.findUnique({ where: { id: owned.id } }), before);
  assert.equal(await prisma.ingestDelivery.count({ where: { closingId: owned.id } }), deliveries);
});

test('login, marketing gate and administrator protections survive the production build', async () => {
  const login = await request('/login?callbackUrl=%2Fdashboard');
  assert.equal(login.status, 200); assert.match(login.headers.get('cache-control'), /no-store/);
  const gated = await request('/licenses');
  assert.equal(gated.status, 200); // The existing gate rewrites, not redirects.
  const gatedHtml = await gated.text();
  assert.match(gatedHtml, /BetterClose is launching soon/);
  assert.doesNotMatch(gatedHtml, /\[number\]/);
  const anonymous = await request('/dashboard?closingId=' + owned.id);
  assert.equal(anonymous.status, 307); assert.match(anonymous.headers.get('location'), /\/login\?callbackUrl=/);
  const admin = await request('/admin', { headers: { cookie: cookie('borrower') } });
  assert.equal(admin.status, 307); assert.equal(new URL(admin.headers.get('location'), origin).pathname, '/');
});

test('production client pages hydrate through Suspense with their original query-driven content and CSS', async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-background-networking', '--disable-component-update'] });
  try {
    for (const [route, expected] of [
      ['/quote', 'Get your fee estimate'], ['/quote?source=broker', 'Get estimate'],
      ['/quote/results?source=broker', "Here's what your borrower could save"],
      ['/start', "Let's start with your contact information"],
    ]) {
      const page = await browser.newPage();
      const errors = [], writes = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setExtraHTTPHeaders({ cookie: cookie('borrower') });
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.url().startsWith('data:')) return req.continue();
        if (new URL(req.url()).origin !== origin) return req.abort();
        if (req.method() !== 'GET') { writes.push(req.url()); return req.abort(); }
        return req.continue();
      });
      await page.goto(origin + route, { waitUntil: 'networkidle0' });
      await page.waitForFunction(text => document.body.innerText.includes(text), { timeout: 10000 }, expected);
      const fontWeight = await page.$eval(route === '/start' ? 'h2' : 'h1', el => getComputedStyle(el).fontWeight);
      assert.ok(Number(fontWeight) >= 700, 'Compiled Tailwind/PostCSS heading styles must apply');
      assert.deepEqual(errors, [], route); assert.deepEqual(writes, [], 'Rendering must not post data');
      await page.close();
    }
  } finally { await browser.close(); }
});
