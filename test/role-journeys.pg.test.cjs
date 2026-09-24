const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { PrismaClient } = require('@prisma/client');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { isIP } = require('node:net');
const target = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['127.0.0.1', 'localhost'].includes(target.hostname));
assert.match(target.pathname, /^\/garden_ldi_betterclose_journeys(?:_[a-z0-9]+)*$/);
const prisma = new PrismaClient();
const h = createHarness(prisma, { env: { BC_EO_REPLY_ROUTES: JSON.stringify({ 'officer@example.invalid': 'synthetic-officer@betterclose.co' }) } });
const prefix = 'bcj-' + Date.now() + '-';
let seq = 0, verifiedTarget = false;
const id = () => prefix + (++seq);
const email = () => id() + '@example.invalid';
const user = data => prisma.user.create({ data: { id: id(), email: email(), emailVerified: new Date(), name: 'Synthetic Person', ...data } });
const closing = data => prisma.closing.create({ data: { id: id(), borrowerEmail: email(),
  gardenFileNumber: id(), propertyAddress: id() + ' Example Lane', status: 'active',
  milestones: { create: ['loan_locked', 'title_ordered', 'title_search', 'title_issued', 'closed'].map(kind => ({ kind })) }, ...data } });
const borrowerPage = props => h.load('src/app/dashboard/page.tsx').default(props || {});
const teamPage = () => h.load('src/app/teammate/dashboard/page.tsx').default({});
const detail = closingId => h.load('src/app/teammate/dashboard/[closingId]/page.tsx').default({ params: Promise.resolve({ closingId }) });
const login = async u => {
  await h.load('src/lib/auth/options.ts').authOptions.events.signIn({ user: u });
  h.setActor(u);
};
const request = body => new Request('https://betterclose.example.invalid/synthetic', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const update = body => h.load('src/app/api/closing/update/route.ts').POST(request(body));
const mute = (membership, value) => h.load('src/app/api/teammate/closings/[id]/mute/route.ts').PATCH(request({ muted: value }), { params: Promise.resolve({ id: membership }) });
const role = (membership, value) => h.load('src/app/api/teammate/closings/[id]/role/route.ts').PATCH(request({ role: value }), { params: Promise.resolve({ id: membership }) });
function preview(name, tree) {
  if (!process.env.BC_JOURNEY_PREVIEW_DIR) return;
  const directory = path.resolve(process.env.BC_JOURNEY_PREVIEW_DIR);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, name + '.html'), '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + h.render(tree) + '</body></html>');
}
before(async () => {
  const [identity] = await prisma.$queryRawUnsafe('SELECT current_database() AS db, current_user AS role, inet_server_addr()::text AS host');
  assert.equal(identity.db, target.pathname.slice(1));
  assert.equal(identity.role, decodeURIComponent(target.username));
  // The client still connects to localhost, but GitHub forwards that port to
  // its disposable Docker service. Compare the server to docker inspect's
  // exact service address, not an arbitrary private-network allowlist.
  const containerHost = process.env.GITHUB_ACTIONS === 'true' ? process.env.BC_TEST_POSTGRES_ADDR : undefined;
  const loopback = ['127.0.0.1/32', '127.0.0.1', '::1/128', '::1'].includes(identity.host);
  assert.ok(loopback || (containerHost && isIP(containerHost) &&
    identity.host.replace(/\/\d+$/, '') === containerHost), 'Unexpected test database server address');
  verifiedTarget = true;
});
beforeEach(() => { h.setActor(null); h.sent.length = 0; });
after(async () => {
  if (verifiedTarget) {
    await prisma.lenderRequest.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.closing.deleteMany({ where: { OR: [{ id: { startsWith: prefix } }, { gardenFileNumber: { startsWith: prefix } }, { borrowerEmail: { startsWith: prefix } }, { userId: { startsWith: prefix } }] } });
    await prisma.brokerCompany.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
  }
  await prisma.$disconnect();
});

test('borrower sign-in claims only their unowned file and renders actual milestones and officer', async () => {
  const borrower = await user(); const other = await user();
  const c = await closing({ borrowerEmail: borrower.email, escrowOfficerName: 'Synthetic Escrow Officer' });
  const privateFile = await closing({ userId: other.id, borrowerEmail: borrower.email });
  await login(borrower);
  assert.equal((await prisma.closing.findUnique({ where: { id: c.id } })).userId, borrower.id);
  assert.equal((await prisma.closing.findUnique({ where: { id: privateFile.id } })).userId, other.id);
  const html = h.render(await borrowerPage());
  assert.ok(html.includes(c.propertyAddress));
  assert.ok(html.includes('Synthetic Escrow Officer'));
  assert.ok(html.includes('Title ordered'));
  assert.ok(!html.includes(privateFile.propertyAddress));
});

for (const persona of ['broker', 'lender', 'realtor']) test(`${persona} sign-in lands on professional files without creating a borrower file`, async () => {
  const professional = await user(); const borrower = await user();
  const c = await closing({ userId: borrower.id, borrowerEmail: borrower.email });
  const hidden = await closing();
  await prisma.teammateClosing.create({ data: { closingId: c.id, matchedEmail: professional.email, role: persona } });
  await login(professional);
  await assert.rejects(borrowerPage(), /REDIRECT:\/teammate\/dashboard/);
  assert.equal(await prisma.closing.count({ where: { userId: professional.id } }), 0);
  const list = h.render(await teamPage());
  assert.ok(list.includes(c.propertyAddress)); assert.ok(!list.includes(hidden.propertyAddress));
  const html = h.render(await detail(c.id));
  assert.ok(html.includes(c.propertyAddress)); assert.ok(html.includes(borrower.email));
  await assert.rejects(detail(hidden.id), /NOT_FOUND/);
  assert.equal((await update({ closingId: c.id, salePrice: 1 })).status, 404);
});

test('self-identifying as a broker never grants broker-company portal membership', async () => {
  const pro = await user(); const c = await closing(); h.setActor(pro);
  const m = await prisma.teammateClosing.create({ data: { userId: pro.id, closingId: c.id, matchedEmail: pro.email } });
  assert.equal((await role(m.id, 'broker')).status, 200);
  assert.equal(await h.load('src/lib/auth/session.ts').requireBrokerMember(), null);
  const html = h.render(await teamPage()); assert.doesNotMatch(html, /href="\/teammate\/quotes"/);
});

test('approved broker-company member sees broker navigation without a spurious borrower file', async () => {
  const pro = await user();
  const company = await prisma.brokerCompany.create({ data: { id: id(), name: 'Synthetic Brokerage', slug: id(), verifiedAt: new Date() } });
  await prisma.brokerMembership.create({ data: { userId: pro.id, companyId: company.id } });
  await login(pro);
  await assert.rejects(borrowerPage(), /REDIRECT:\/teammate\/dashboard/);
  assert.ok(await h.load('src/lib/auth/session.ts').requireVerifiedBrokerCompany());
  assert.match(h.render(await teamPage()), /href="\/teammate\/quotes"/);
  assert.equal(await prisma.closing.count({ where: { userId: pro.id } }), 0);
});

test('unrelated users and anonymous users cannot see or edit a file or its memberships', async () => {
  const owner = await user(); const other = await user();
  const c = await closing({ userId: owner.id });
  const m = await prisma.teammateClosing.create({ data: { userId: owner.id, closingId: c.id, matchedEmail: owner.email } });
  assert.equal((await update({ closingId: c.id, salePrice: 1 })).status, 401);
  assert.equal((await mute(m.id, true)).status, 401);
  assert.equal((await role(m.id, 'broker')).status, 401);
  h.setActor(other);
  await assert.rejects(detail(c.id), /NOT_FOUND/);
  assert.equal((await update({ closingId: c.id, salePrice: 1 })).status, 404);
  assert.equal((await mute(m.id, true)).status, 404);
  assert.equal((await role(m.id, 'broker')).status, 404);
  assert.deepEqual(await prisma.closing.findUnique({ where: { id: c.id } }), c);
});

test('one teammate can change only their own notification preference', async () => {
  const a = await user(), b = await user(), c = await closing(); h.setActor(a);
  const m = await prisma.teammateClosing.create({ data: { userId: a.id, closingId: c.id, matchedEmail: a.email } });
  const n = await prisma.teammateClosing.create({ data: { userId: b.id, closingId: c.id, matchedEmail: b.email } });
  assert.equal((await mute(m.id, true)).status, 200);
  assert.equal((await mute(n.id, true)).status, 404);
  assert.equal((await prisma.teammateClosing.findUnique({ where: { id: n.id } })).muted, false);
});

test('completed borrower file remains visible without creating an empty replacement', async () => {
  const u = await user(); const c = await closing({ userId: u.id, status: 'closed', closedAt: new Date() }); h.setActor(u);
  const html = h.render(await borrowerPage());
  assert.ok(html.includes(c.propertyAddress), 'Closed file must remain visible');
  assert.equal(await prisma.closing.count({ where: { userId: u.id } }), 1);
});

test('explicit borrower file selection opens that owned file, not the newest file', async () => {
  const u = await user(); h.setActor(u);
  const a = await closing({ userId: u.id, createdAt: new Date('2026-01-01') });
  const b = await closing({ userId: u.id, createdAt: new Date('2026-02-01') });
  const tree = await borrowerPage({ searchParams: Promise.resolve({ closingId: a.id }) });
  preview('borrower-two-closings', tree);
  const selected = findClosing(tree);
  assert.equal(selected.id, a.id);
  const html = h.render(tree);
  assert.match(html, /name="closingId"/);
  assert.ok(html.includes(a.id) && html.includes(b.id));
});

function findClosing(node) {
  if (!node) return null;
  if (node.props?.closing) return node.props.closing;
  const children = Array.isArray(node) ? node : node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = child && typeof child === 'object' ? findClosing(child) : null;
    if (found) return found;
  }
  return null;
}

test('explicit unrelated, missing or malformed borrower file refuses without a fallback write', async () => {
  const u = await user(); const privateFile = await closing(); h.setActor(u);
  for (const closingId of [privateFile.id, 'missing', '', ['first', 'second']]) {
    await assert.rejects(borrowerPage({ searchParams: Promise.resolve({ closingId }) }), /NOT_FOUND/);
  }
  assert.equal(await prisma.closing.count({ where: { userId: u.id } }), 0);
});

test('sign-in redirect retains the specific borrower file', async () => {
  await assert.rejects(borrowerPage({ searchParams: Promise.resolve({ closingId: 'synthetic-file' }) }), error => {
    const url = new URL(error.message.replace('REDIRECT:', ''), 'https://betterclose.example.invalid');
    return url.pathname === '/login' && url.searchParams.get('callbackUrl') === '/dashboard?closingId=synthetic-file';
  });
});

test('borrower with a professional role retains their own file and a professional navigation link', async () => {
  const u = await user(); const own = await closing({ userId: u.id }); const client = await closing(); h.setActor(u);
  await prisma.teammateClosing.create({ data: { userId: u.id, matchedEmail: u.email, closingId: client.id, role: 'broker' } });
  const tree = await borrowerPage(); assert.equal(findClosing(tree).id, own.id);
  preview('borrower-and-professional', tree);
  assert.match(h.render(tree), /href="\/teammate\/dashboard"/);
});

test('account progression uses invitations for the selected file only', async () => {
  const u = await user(); h.setActor(u);
  const a = await closing({ userId: u.id, status: 'pending' }); const b = await closing({ userId: u.id });
  const unrelatedEmail = email();
  await prisma.lenderRequest.create({ data: { id: id(), refId: id(), userId: u.id, closingId: b.id, channel: 'we_email', lenderEmail: unrelatedEmail, source: 'dashboard_account' } });
  const html = h.render(await borrowerPage({ searchParams: Promise.resolve({ closingId: a.id }) }));
  assert.ok(!html.includes(unrelatedEmail));
});

test('Garden ingest suppresses borrower welcome; self-request receipt identifies its exact closing', async () => {
  const borrowerEmail = email();
  const result = await h.load('src/lib/closing/gardenIngest.ts').ingestGardenOrder({ gardenFileNumber: id(), borrowerEmail, propertyAddress: 'Synthetic Garden Address' });
  assert.equal(h.sent.length, 0);
  h.sent.length = 0;
  const publicEmail = email();
  const opened = await h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder({ borrowerEmail: publicEmail, propertyAddress: 'Synthetic Public Address' }, { matchExisting: false, borrowerInitiated: true });
  assert.ok(h.sent.find(message => message.to === publicEmail).htmlBody.includes('closingId=' + opened.closingId));
});

test('milestone fanout keeps separate borrower/professional destinations and respects mute', async () => {
  const borrower = await user(); const agent = await user(); const broker = await user(); const lender = await user();
  const c = await closing({ userId: borrower.id, borrowerEmail: borrower.email,
    ...h.load('src/lib/closing/notificationPolicy.ts').borrowerPermission(borrower.email, borrower.id, 'borrower', true),
    escrowOfficerName: 'Synthetic Officer', escrowOfficerEmail: 'officer@example.invalid', escrowOfficerPhotoUrl: 'https://images.example.invalid/officer.png' });
  for (const [u, kind, muted] of [[agent, 'realtor', false], [broker, 'broker', false], [lender, 'lender', true]]) {
    await prisma.teammateClosing.create({ data: { userId: u.id, matchedEmail: u.email, closingId: c.id, role: kind, muted, mayManageBorrowerEmails: true } });
  }
  const result = await h.load('src/lib/closing-milestone.ts').applyMilestoneTransition({ closingId: c.id, kind: 'title_ordered', status: 'done', origin: 'tps' });
  assert.equal(result.ok, true, JSON.stringify(await prisma.ingestDelivery.findMany({ where: { closingId: c.id } })));
  assert.deepEqual(h.sent.map(m => m.to).sort(), [borrower.email, agent.email, broker.email].sort());
  assert.ok(h.sent.find(m => m.to === borrower.email).htmlBody.includes('/dashboard?closingId=' + c.id));
  for (const u of [agent, broker]) assert.ok(h.sent.find(m => m.to === u.email).htmlBody.includes('/teammate/dashboard/' + c.id));
  h.sent.length = 0;
  await h.load('src/lib/closing-milestone.ts').applyMilestoneTransition({ closingId: c.id, kind: 'title_ordered', status: 'done' });
  assert.equal(h.sent.length, 0);
});

test('completed email targets the closed file even if a newer transaction exists', async () => {
  const u = await user(); const c = await closing({ userId: u.id, borrowerEmail: u.email, createdAt: new Date('2026-01-01'),
    ...h.load('src/lib/closing/notificationPolicy.ts').borrowerPermission(u.email, u.id, 'borrower', true) });
  await closing({ userId: u.id, borrowerEmail: u.email, createdAt: new Date('2026-02-01') });
  await h.load('src/lib/closing-milestone.ts').applyMilestoneTransition({ closingId: c.id, kind: 'closed', status: 'done' });
  assert.ok(h.sent.find(m => m.to === u.email).htmlBody.includes('/dashboard?closingId=' + c.id));
  h.setActor(u);
  assert.equal(findClosing(await borrowerPage({ searchParams: Promise.resolve({ closingId: c.id }) })).id, c.id);
});

test('default dashboard prefers active work while completed file is explicitly selectable without mutation', async () => {
  const u = await user(); h.setActor(u);
  const active = await closing({ userId: u.id, createdAt: new Date('2026-01-01') });
  const done = await closing({ userId: u.id, status: 'closed', closedAt: new Date(), createdAt: new Date('2026-02-01') });
  assert.equal(findClosing(await borrowerPage()).id, active.id);
  const selected = await borrowerPage({ searchParams: Promise.resolve({ closingId: done.id, variant: 'unified' }) });
  assert.equal(findClosing(selected).id, done.id);
  assert.ok(h.render(selected).includes('name="variant" value="unified"'));
  assert.deepEqual(await prisma.closing.findUnique({ where: { id: done.id } }), done);
  assert.equal(await prisma.closing.count({ where: { userId: u.id } }), 2);
});

test('genuinely new borrower still gets exactly one onboarding file and five milestones', async () => {
  const u = await user(); h.setActor(u);
  await borrowerPage(); await borrowerPage();
  const files = await prisma.closing.findMany({ where: { userId: u.id }, include: { milestones: true } });
  assert.equal(files.length, 1); assert.equal(files[0].milestones.length, 5);
  assert.equal(files[0].source, 'user_signup');
});

test('professional membership and a matching borrower email do not grant borrower-file ownership', async () => {
  const u = await user(), owner = await user(); h.setActor(u);
  const file = await closing({ userId: owner.id, borrowerEmail: u.email });
  await prisma.teammateClosing.create({ data: { userId: u.id, matchedEmail: u.email, closingId: file.id } });
  await assert.rejects(borrowerPage({ searchParams: Promise.resolve({ closingId: file.id }) }), /NOT_FOUND/);
  assert.equal(await prisma.closing.count({ where: { userId: u.id } }), 0);
});

test('selection never reassigns invitations already linked to another file or another user', async () => {
  const u = await user(), other = await user(); h.setActor(u);
  const a = await closing({ userId: u.id }), b = await closing({ userId: u.id });
  for (const data of [{ userId: u.id, closingId: b.id }, { userId: other.id, closingId: null }, { userId: null, closingId: b.id }]) {
    const invite = await prisma.lenderRequest.create({ data: { id: id(), refId: id(), channel: 'copy_link', source: 'dashboard_account', ...data } });
    await borrowerPage({ searchParams: Promise.resolve({ closingId: a.id, claim: invite.refId }) });
    assert.deepEqual(await prisma.lenderRequest.findUnique({ where: { id: invite.id } }), invite);
  }
});

test('unassigned invitation can still attach to the selected owned file exactly once', async () => {
  const u = await user(); h.setActor(u); const file = await closing({ userId: u.id });
  const invite = await prisma.lenderRequest.create({ data: { id: id(), refId: id(), channel: 'copy_link', source: 'dashboard_account' } });
  await borrowerPage({ searchParams: Promise.resolve({ closingId: file.id, claim: invite.refId }) });
  const attached = await prisma.lenderRequest.findUnique({ where: { id: invite.id } });
  assert.equal(attached.userId, u.id); assert.equal(attached.closingId, file.id);
  await borrowerPage({ searchParams: Promise.resolve({ closingId: file.id, claim: invite.refId }) });
  assert.equal((await prisma.lenderRequest.findUnique({ where: { id: invite.id } })).closingId, file.id);
});

for (const payloadId of [undefined, 'incorrect-payload-id']) test(`legacy queued welcome is cancelled regardless of payload file ID (${payloadId || 'legacy'})`, async () => {
  const c = await closing();
  await prisma.ingestDelivery.create({ data: { closingId: c.id, kind: 'welcome', recipient: c.borrowerEmail,
    payload: { borrowerEmail: c.borrowerEmail, baseUrl: 'https://betterclose.example.invalid', ...(payloadId ? { closingId: payloadId } : {}) } } });
  await h.load('src/lib/closing/gardenIngest.ts').deliverIngestNotifications(c.id);
  assert.equal(h.sent.length, 0);
  assert.equal((await prisma.ingestDelivery.findFirst({ where: { closingId: c.id } })).status, 'cancelled');
  await h.load('src/lib/closing/gardenIngest.ts').deliverIngestNotifications(c.id);
  assert.equal(h.sent.length, 0);
});

test('legacy welcome callers without a file ID keep a working generic welcome URL', async () => {
  const recipient = email();
  await h.load('src/lib/email/welcome.ts').sendWelcomeEmail({ borrowerEmail: recipient, baseUrl: 'https://betterclose.example.invalid' });
  assert.ok(h.sent[0].htmlBody.includes('/welcome?email=' + encodeURIComponent(recipient)));
  assert.ok(!h.sent[0].htmlBody.includes('closingId='));
});

test('unauthenticated invitation redirect preserves claim and selected file without an external redirect', async () => {
  await assert.rejects(borrowerPage({ searchParams: Promise.resolve({ closingId: 'file/one', claim: 'claim&one', variant: 'unified' }) }), error => {
    const loginUrl = new URL(error.message.replace('REDIRECT:', ''), 'https://betterclose.example.invalid');
    const callback = new URL(loginUrl.searchParams.get('callbackUrl'), 'https://betterclose.example.invalid');
    return callback.pathname === '/dashboard' && callback.origin === 'https://betterclose.example.invalid' &&
      callback.searchParams.get('closingId') === 'file/one' && callback.searchParams.get('claim') === 'claim&one' && callback.searchParams.get('variant') === 'unified';
  });
});
