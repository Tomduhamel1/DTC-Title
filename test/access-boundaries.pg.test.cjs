// Real isolated PostgreSQL; authentication and all external email calls mocked.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const { renderToStaticMarkup } = require('react-dom/server');
const target = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['localhost', '127.0.0.1'].includes(target.hostname));
assert.match(target.pathname, /^\/garden_ldi_betterclose_access(?:_[a-z0-9]+)*$/);
const prisma = new PrismaClient();
const prefix = 'bca-' + Date.now() + '-';
let seq = 0, currentUser = null, currentBroker = null;
const id = () => prefix + (++seq);
const email = () => id() + '@example.invalid';
const sent = [];
const mocks = {
  '@/lib/db': { prisma },
  '@/lib/auth/session': {
    requireUser: async () => currentUser,
    getSession: async () => currentUser ? { user: currentUser } : null,
    requireBrokerMember: async () => currentBroker,
  },
  '@/lib/professional': { getProfessionalContext: async () => null },
  '@/lib/email/welcome': { sendWelcomeEmail: async d => { sent.push(['welcome', d]); return 'mock'; } },
  '@/lib/email/teammate-invite': { sendTeammateInviteEmail: async d => { sent.push(['invite', d]); return 'mock'; } },
  '@/lib/email/open-file-ops': { sendOpenFileOpsEmail: async d => {
    sent.push(['ops', d]); return { recipient: 'ops@example.invalid', messageId: 'mock' };
  } },
  '@/lib/email/broker-conversion-ops': { sendBrokerConversionOpsEmail: async d => {
    sent.push(['broker-ops', d]); return { recipient: 'ops@example.invalid', subject: 'Synthetic', messageId: 'mock' };
  } },
  'next/navigation': { redirect: url => { throw new Error('REDIRECT:' + url); } },
};
for (const name of ['next/link', '@/components/NavigationCredible', '@/components/FooterComprehensive',
  '@/components/teammate/TeammateTabs', '@/components/teammate/RoleSelfIdentifyBanner', './MuteToggle']) {
  mocks[name] = () => null;
}
const modules = new Map();
function load(file) {
  const absolute = path.resolve(__dirname, '..', file);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const mod = { exports: {} }; modules.set(absolute, mod);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: absolute,
  }).outputText;
  const localRequire = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (['crypto', 'next/server', 'react', 'react/jsx-runtime', 'zod', '@prisma/client'].includes(name)) return require(name);
    const candidate = name.startsWith('@/') ? path.resolve(__dirname, '../src', name.slice(2)) :
      name.startsWith('.') ? path.resolve(path.dirname(absolute), name) : null;
    if (candidate) {
      const alias = '@/' + path.relative(path.resolve(__dirname, '../src'), candidate);
      if (Object.hasOwn(mocks, alias)) return mocks[alias];
    }
    if (candidate) for (const ext of ['.ts', '.tsx']) {
      if (fs.existsSync(candidate + ext)) return load(candidate + ext);
    }
    throw new Error('Unapproved dependency: ' + name);
  };
  new Function('require', 'exports', 'module', code)(localRequire, mod.exports, mod);
  return mod.exports;
}
const { POST: open } = load('src/app/api/orders/open/route.ts');
const { POST: convert } = load('src/app/api/broker/quotes/[id]/convert/route.ts');
const { POST: adminCreate } = load('src/app/api/admin/closings/route.ts');
const { claimTeammateInvitation: claim } = load('src/lib/teammate/claimInvitation.ts');
const Page = load('src/app/teammate/dashboard/page.tsx').default;
const user = (data = {}) => prisma.user.create({ data: { id: id(), email: email(), emailVerified: new Date(), ...data } });
const closing = (data = {}) => {
  const values = { id: id(), borrowerEmail: email(), propertyAddress: id() + ' Test Street', gardenFileNumber: id(), ...data };
  values.propertyAddressKey = load('src/lib/closing.ts').normalizePropertyKey(values.propertyAddress);
  return prisma.closing.create({ data: values });
};
const request = body => new Request('https://synthetic.invalid/api/orders/open', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': id() }, body: JSON.stringify(body),
});
const payload = (extra = {}) => ({ role: 'broker', submitterEmail: email(), borrowerEmail: email(),
  propertyAddress: id() + ' New Street', propertyState: 'TX', propertyZip: '75001', transactionType: 'purchase', ...extra });
async function invitation({ recipient, file, ...extra } = {}) {
  const u = recipient || await user();
  const c = file || await closing();
  const invite = await prisma.lenderRequest.create({ data: { id: id(), refId: id(),
    channel: 'we_email', source: 'dashboard_account', lenderEmail: u.email, closingId: c.id, ...extra } });
  return { u, c, invite };
}
before(async () => {
  const [identity] = await prisma.$queryRawUnsafe('SELECT current_database() AS db, current_user AS role');
  assert.equal(identity.db, target.pathname.slice(1));
  assert.equal(identity.role, decodeURIComponent(target.username));
});
beforeEach(() => { currentUser = null; currentBroker = null; sent.length = 0; delete process.env.ADMIN_EMAILS; });
after(async () => {
  // Only this run's synthetic rows; no shared fixtures or database reset.
  await prisma.feeQuote.deleteMany({ where: { id: { startsWith: prefix } } });
  await prisma.lenderRequest.deleteMany({ where: { id: { startsWith: prefix } } });
  await prisma.closing.deleteMany({ where: { OR: [{ id: { startsWith: prefix } }, { borrowerEmail: { startsWith: prefix } }] } });
  await prisma.brokerCompany.deleteMany({ where: { id: { startsWith: prefix } } });
  await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
  await prisma.$disconnect();
});

for (const match of ['email', 'phone', 'property', 'user']) {
  test(`public intake cannot select an existing file by ${match}`, async () => {
    const oldUser = await user();
    const c = await closing({ userId: oldUser.id, borrowerPhone: '4015550123' });
    const submitter = await user();
    const data = payload({ submitterEmail: submitter.email,
      ...(match === 'email' ? { borrowerEmail: c.borrowerEmail } : {}),
      ...(match === 'phone' ? { borrowerPhone: c.borrowerPhone } : {}),
      ...(match === 'property' ? { propertyAddress: c.propertyAddress } : {}),
      ...(match === 'user' ? { borrowerEmail: oldUser.email } : {}),
    });
    const response = await open(request(data));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.matchedExistingFile, false);
    assert.notEqual(body.closingId, c.id);
    assert.deepEqual(await prisma.closing.findUnique({ where: { id: c.id } }), c);
    assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
    assert.equal(await prisma.teammateClosing.count({ where: { closingId: body.closingId, userId: submitter.id } }), 1);
    assert.equal(await prisma.milestone.count({ where: { closingId: body.closingId } }), 5);
  });
}
test('caller-supplied match policy, source and Garden key cannot override public isolation', async () => {
  const c = await closing();
  const response = await open(request(payload({ borrowerEmail: c.borrowerEmail,
    gardenFileNumber: c.gardenFileNumber, source: 'ops_email', matchExisting: true,
    options: { matchExisting: true }, closingId: c.id })));
  const body = await response.json();
  assert.notEqual(body.closingId, c.id);
  const created = await prisma.closing.findUnique({ where: { id: body.closingId } });
  assert.equal(created.gardenFileNumber, null);
  assert.equal(created.source, 'web_open_file');
});
test('a repeated public submission stays isolated rather than auto-linking to the first', async () => {
  const data = payload();
  const a = await (await open(request(data))).json();
  const b = await (await open(request(data))).json();
  assert.notEqual(a.closingId, b.closingId);
  assert.equal(a.matchedExistingFile, false);
  assert.equal(b.matchedExistingFile, false);
});
test('legitimate borrower intake still creates a file without adding a teammate', async () => {
  const body = await (await open(request(payload({ role: 'borrower', submitterEmail: undefined })))).json();
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: body.closingId } }), 0);
  assert.equal(sent.filter(([kind]) => kind === 'welcome').length, 1);
  assert.equal(sent.filter(([kind]) => kind === 'ops').length, 1);
});
test('public validation and rate limits remain enforced', async () => {
  assert.equal((await open(request({}))).status, 400);
  const data = payload();
  for (let i = 0; i < 3; i++) assert.equal((await open(request(data))).status, 200);
  assert.equal((await open(request(data))).status, 429);
});
test('admin-only matching remains authorized and unchanged', async () => {
  const c = await closing();
  const body = { borrowerEmail: c.borrowerEmail };
  assert.equal((await adminCreate(request(body))).status, 401);
  currentUser = await user(); process.env.ADMIN_EMAILS = currentUser.email;
  const result = await (await adminCreate(request(body))).json();
  assert.equal(result.closingId, c.id);
  assert.equal(result.matched, true);
});
test('broker conversion creates its own file and simultaneous same-quote retries reuse it', async () => {
  const broker = await user();
  const company = await prisma.brokerCompany.create({ data: { id: id(), name: 'Synthetic Co', slug: id(), verifiedAt: new Date() } });
  await prisma.brokerMembership.create({ data: { userId: broker.id, companyId: company.id } });
  const existing = await closing();
  const quote = await prisma.feeQuote.create({ data: { id: id(), brokerUserId: broker.id, brokerCompanyId: company.id,
    shareToken: id(), inputHash: id(), inputJson: { transactionType: 'purchase', homeValue: 100000 }, outputJson: {},
    borrowerName: 'Synthetic Borrower', borrowerEmail: existing.borrowerEmail,
    propertyAddress: '99 New Property', propertyCity: 'Test City', propertyState: 'TX', propertyZip: '75001',
    expiresAt: new Date(Date.now() + 86400000) } });
  assert.equal((await convert(request({}), { params: Promise.resolve({ id: quote.id }) })).status, 401);
  currentBroker = { userId: broker.id, email: broker.email, memberships: [{ companyId: company.id }] };
  const responses = await Promise.all(Array.from({ length: 4 }, () => convert(request({}), { params: Promise.resolve({ id: quote.id }) })));
  responses.forEach(res => assert.equal(res.status, 200));
  const bodies = await Promise.all(responses.map(res => res.json()));
  assert.equal(new Set(bodies.map(body => body.closingId)).size, 1);
  assert.notEqual(bodies[0].closingId, existing.id);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: existing.id } }), 0);
  assert.deepEqual(await prisma.closing.findUnique({ where: { id: existing.id } }), existing);
  assert.equal(bodies.filter(body => !body.alreadyConverted).length, 1);
  assert.equal(sent.filter(([kind]) => kind === 'broker-ops').length, 1);
});

test('verified intended recipient can claim; replay preserves role and mute', async () => {
  const { u, c, invite } = await invitation();
  assert.equal(await claim(u.id, invite.refId), true);
  await prisma.teammateClosing.updateMany({ where: { closingId: c.id }, data: { role: 'broker', muted: true } });
  assert.equal(await claim(u.id, invite.refId), true);
  const rows = await prisma.teammateClosing.findMany({ where: { closingId: c.id } });
  assert.equal(rows.length, 1); assert.equal(rows[0].role, 'broker'); assert.equal(rows[0].muted, true);
});
test('recipient comparison normalizes whitespace and case', async () => {
  const u = await user();
  const { invite, c } = await invitation({ recipient: u, lenderEmail: '  ' + u.email.toUpperCase() + '  ' });
  assert.equal(await claim(u.id, invite.refId), true);
  assert.equal((await prisma.teammateClosing.findFirst({ where: { closingId: c.id } })).matchedEmail, u.email);
});
test('wrong verified account cannot claim or overwrite an existing member', async () => {
  const { u, c, invite } = await invitation(); const other = await user();
  assert.equal(await claim(other.id, invite.refId), false);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
  assert.equal(await claim(u.id, invite.refId), true);
  const before = await prisma.teammateClosing.findFirst({ where: { closingId: c.id } });
  assert.equal(await claim(other.id, invite.refId), false);
  assert.deepEqual(await prisma.teammateClosing.findFirst({ where: { closingId: c.id } }), before);
});
test('unverified, missing and changed user identity cannot claim', async () => {
  const { u, c, invite } = await invitation();
  await prisma.user.update({ where: { id: u.id }, data: { emailVerified: null } });
  assert.equal(await claim(u.id, invite.refId), false);
  assert.equal(await claim('nonexistent', invite.refId), false);
  await prisma.user.update({ where: { id: u.id }, data: { email: email(), emailVerified: new Date() } });
  assert.equal(await claim(u.id, invite.refId), false);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
});
test('a correctly addressed invite cannot reassign a conflicting existing owner', async () => {
  const { u, c, invite } = await invitation(); const owner = await user();
  const row = await prisma.teammateClosing.create({ data: { closingId: c.id, matchedEmail: u.email, userId: owner.id, role: 'lender', muted: true } });
  assert.equal(await claim(u.id, invite.refId), false);
  assert.deepEqual(await prisma.teammateClosing.findUnique({ where: { id: row.id } }), row);
});
test('orphan membership is claimed without losing its role or mute setting', async () => {
  const { u, c, invite } = await invitation();
  await prisma.teammateClosing.create({ data: { closingId: c.id, matchedEmail: u.email, role: 'realtor', muted: true } });
  assert.equal(await claim(u.id, invite.refId), true);
  const row = await prisma.teammateClosing.findFirst({ where: { closingId: c.id } });
  assert.equal(row.userId, u.id); assert.equal(row.role, 'realtor'); assert.equal(row.muted, true);
});
test('missing or unlinked invitations fail closed', async () => {
  const { u, invite } = await invitation({ closingId: null });
  assert.equal(await claim(u.id, invite.refId), false);
  assert.equal(await claim(u.id, 'missing-reference'), false);
  assert.equal(await claim(u.id, 'x'), false);
});
test('concurrent legitimate claims create exactly one membership', async () => {
  const { u, c, invite } = await invitation();
  const results = await Promise.all(Array.from({ length: 8 }, () => claim(u.id, invite.refId)));
  assert.ok(results.every(Boolean));
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 1);
});
test('concurrent competing normalized identities never take over the first owner', async () => {
  const { u, c, invite } = await invitation();
  const other = await user({ email: u.email.toUpperCase() });
  const results = await Promise.all([claim(u.id, invite.refId), claim(other.id, invite.refId)]);
  assert.equal(results.filter(Boolean).length, 1);
  const owner = (await prisma.teammateClosing.findFirst({ where: { closingId: c.id } })).userId;
  const loser = owner === u.id ? other.id : u.id;
  assert.equal(await claim(loser, invite.refId), false);
});
test('existing membership under another email is preserved, not duplicated', async () => {
  const { u, c, invite } = await invitation();
  const row = await prisma.teammateClosing.create({ data: { userId: u.id, closingId: c.id, matchedEmail: email() } });
  assert.equal(await claim(u.id, invite.refId), false);
  assert.deepEqual(await prisma.teammateClosing.findUnique({ where: { id: row.id } }), row);
});
async function waitForBlockedClaim() {
  for (let i = 0; i < 100; i++) {
    const [result] = await prisma.$queryRaw`
      SELECT count(*)::int AS n FROM pg_stat_activity
      WHERE datname = current_database() AND pid <> pg_backend_pid()
        AND wait_event_type = 'Lock' AND query LIKE '%WITH eligible AS MATERIALIZED%'
    `;
    if (result.n > 0) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('Expected a blocked claim to prove the race test exercised the lock');
}
test('claim revalidates a recipient email changed by a concurrent transaction', async () => {
  const { u, c, invite } = await invitation();
  let locked, release;
  const hasLock = new Promise(resolve => { locked = resolve; });
  const mayCommit = new Promise(resolve => { release = resolve; });
  const writer = prisma.$transaction(async tx => {
    await tx.user.update({ where: { id: u.id }, data: { email: email() } });
    locked(); await mayCommit;
  });
  await hasLock;
  const reader = claim(u.id, invite.refId);
  try { await waitForBlockedClaim(); } finally { release(); }
  await writer;
  assert.equal(await reader, false);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
});
test('claim cannot overwrite an owner assigned by a concurrent transaction', async () => {
  const { u, c, invite } = await invitation(); const owner = await user();
  const row = await prisma.teammateClosing.create({ data: { closingId: c.id, matchedEmail: u.email } });
  let locked, release;
  const hasLock = new Promise(resolve => { locked = resolve; });
  const mayCommit = new Promise(resolve => { release = resolve; });
  const writer = prisma.$transaction(async tx => {
    await tx.teammateClosing.update({ where: { id: row.id }, data: { userId: owner.id } });
    locked(); await mayCommit;
  });
  await hasLock;
  const reader = claim(u.id, invite.refId);
  try { await waitForBlockedClaim(); } finally { release(); }
  await writer;
  assert.equal(await reader, false);
  assert.equal((await prisma.teammateClosing.findUnique({ where: { id: row.id } })).userId, owner.id);
});
test('actual page denies forwarded invitations without leaking the intended recipient', async () => {
  const { c, invite } = await invitation(); currentUser = await user();
  const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({ claim: invite.refId }) }));
  assert.match(html, /This invitation is not available for this account/);
  assert.doesNotMatch(html, new RegExp(invite.lenderEmail));
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
});
test('actual page permits intended user and redirects an unauthenticated visitor', async () => {
  const { u, invite, c } = await invitation();
  await assert.rejects(Page({ searchParams: Promise.resolve({ claim: invite.refId }) }), /REDIRECT:\/login/);
  currentUser = u;
  const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({ claim: invite.refId }) }));
  assert.doesNotMatch(html, /This invitation is not available/);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id, userId: u.id } }), 1);
});
test('claim errors show only generic help and grant no membership', async () => {
  const { u, invite, c } = await invitation(); currentUser = u;
  const module = load('src/lib/teammate/claimInvitation.ts');
  const original = module.claimTeammateInvitation;
  module.claimTeammateInvitation = async () => { throw new Error('private database detail'); };
  try {
    const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({ claim: invite.refId }) }));
    assert.match(html, /This invitation is not available for this account/);
    assert.doesNotMatch(html, /private database detail/);
    assert.equal(await prisma.teammateClosing.count({ where: { closingId: c.id } }), 0);
  } finally { module.claimTeammateInvitation = original; }
});
