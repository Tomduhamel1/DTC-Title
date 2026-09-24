// Real PostgreSQL and application routes; no network or real email.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const url = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['localhost', '127.0.0.1'].includes(url.hostname));
assert.match(url.pathname, /^\/garden_ldi_[a-z0-9_]+$/);
const prisma = new PrismaClient();
const prefix = 'link-' + Date.now() + '-';
let seq = 0, verified = false;
const id = () => prefix + (++seq);
const h = createHarness(prisma, { env: { ADMIN_EMAILS: 'admin@example.invalid' } });
const payload = extra => ({ gardenFileNumber: id(), gardenOrderId: randomUUID(), propertyAddress: '10 Synthetic Lane', ...extra });
const request = (body, token = 'synthetic-only') => new Request('https://local.invalid/test', {
  method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body) });
const post = (p, token) => h.load('src/app/api/orders/ingest/route.ts').POST(request(p, token));
const lead = extra => prisma.closing.create({ data: { id: id(), status: 'pending', source: 'web_open',
  propertyAddress: '10 Synthetic Lane', ...extra } });
const reload = c => prisma.closing.findUniqueOrThrow({ where: { id: c.id } });
before(async () => {
  const [r] = await prisma.$queryRawUnsafe('SELECT current_database() AS db, current_user AS role');
  assert.equal(r.db, url.pathname.slice(1)); assert.equal(r.role, decodeURIComponent(url.username)); verified = true;
});
beforeEach(() => { h.sent.length = 0; h.setActor(null); });
after(async () => {
  if (verified) {
    await prisma.feeQuote.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.closing.deleteMany({ where: { OR: [{ id: { startsWith: prefix } }, { gardenFileNumber: { startsWith: prefix } }] } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
  }
  await prisma.$disconnect();
});

test('explicit request reuses the BC record and preserves owner, Pro, permission, quote and milestone', async () => {
  const owner = await prisma.user.create({ data: { id: id(), email: id() + '@example.invalid' } });
  const c = await lead({ userId: owner.id, borrowerEmail: owner.email, borrowerEmailsEnabled: true,
    borrowerEmailPermissionRecipient: owner.email, borrowerEmailPermissionSource: 'self', borrowerEmailPermissionVersion: id(),
    milestones: { create: { kind: 'loan_locked', status: 'done' } } });
  const m = await prisma.teammateClosing.create({ data: { closingId: c.id, matchedEmail: 'pro@example.invalid', role: 'broker', muted: true } });
  const quote = await prisma.feeQuote.create({ data: { id: id(), shareToken: id(), inputHash: id(),
    inputJson: {}, outputJson: {}, expiresAt: new Date('2099-01-01'), convertedClosingId: c.id } });
  const p = payload({ betterCloseRequestId: c.id, borrowerEmail: owner.email });
  const first = await post(p); assert.equal(first.status, 200);
  const result = await first.json(); assert.equal(result.contractVersion, 3); assert.equal(result.closingId, c.id);
  assert.equal(result.gardenOrderId, p.gardenOrderId); assert.equal(result.betterCloseRequestId, c.id);
  const bound = await reload(c);
  assert.equal(bound.userId, owner.id); assert.equal(bound.source, 'web_open');
  assert.equal(bound.borrowerEmailPermissionVersion, c.borrowerEmailPermissionVersion);
  assert.equal(bound.borrowerEmailsEnabled, true); assert.equal(bound.gardenLinkSource, 'explicit_request');
  assert.ok(bound.gardenLinkedAt);
  assert.equal((await prisma.teammateClosing.findUnique({ where: { id: m.id } })).muted, true);
  assert.equal((await prisma.milestone.findFirst({ where: { closingId: c.id } })).status, 'done');
  assert.equal((await prisma.feeQuote.findUnique({ where: { id: quote.id } })).convertedClosingId, c.id);
  assert.equal((await post(p)).status, 200);
  assert.equal((await reload(c)).gardenLinkedAt.getTime(), bound.gardenLinkedAt.getTime());
  assert.equal(await prisma.closing.count({ where: { gardenOrderId: p.gardenOrderId } }), 1);
  assert.equal(h.sent.length, 0);
});

test('Garden-first needs no existing BC user/request; v3 retry resolves stable ID and stays default-off', async () => {
  const p = payload({ teammateEmail: 'unregistered@example.invalid', teammateRole: 'realtor' });
  const a = await (await post(p)).json(); const b = await (await post(p)).json();
  assert.equal(a.closingId, b.closingId); assert.equal(b.matchedBy, 'garden_order_id');
  const c = await reload({ id: a.closingId });
  assert.equal(c.userId, null); assert.equal(c.borrowerEmailsEnabled, false);
  assert.equal(c.gardenLinkSource, 'garden_first'); assert.equal(h.sent.length, 0);
});

test('shared contacts/address do not select an existing request', async () => {
  const c = await lead({ borrowerEmail: 'same@example.invalid' });
  const p = payload({ borrowerEmail: c.borrowerEmail });
  assert.notEqual((await (await post(p)).json()).closingId, c.id);
  assert.equal((await reload(c)).gardenOrderId, null);
});

test('unknown explicit ID, malformed UUID and missing stable ID never fall back to creating', async () => {
  for (const [extra, status] of [
    [{ betterCloseRequestId: 'missing' }, 409],
    [{ gardenOrderId: undefined, betterCloseRequestId: 'missing' }, 400],
    [{ gardenOrderId: 'wrong' }, 400],
  ]) {
    const p = payload(extra); assert.equal((await post(p)).status, status);
    assert.equal(await prisma.closing.count({ where: { gardenFileNumber: p.gardenFileNumber } }), 0);
  }
});

test('mismatched request/file/order identities refuse with no ownership or contact changes', async () => {
  const c = await lead(), d = await lead(); const p = payload({ betterCloseRequestId: c.id });
  assert.equal((await post(p)).status, 200);
  for (const change of [ { betterCloseRequestId: d.id }, { gardenOrderId: randomUUID() },
    { gardenFileNumber: id() }, { gardenOrderId: undefined, betterCloseRequestId: undefined } ]) {
    assert.equal((await post({ ...p, ...change, teammateEmail: 'wrong@example.invalid' })).status, 409);
  }
  assert.equal((await reload(d)).gardenOrderId, null);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: { in: [c.id, d.id] } } }), 0);
});

test('data conflict rolls back binding instead of overwriting a request', async () => {
  const c = await lead({ loanAmount: 123 }); const p = payload({ betterCloseRequestId: c.id, loanAmount: 456 });
  assert.equal((await post(p)).status, 409); assert.equal((await reload(c)).gardenOrderId, null);
  assert.equal((await reload(c)).loanAmount, 123);
});

test('closed/cancelled request cannot be opened as a new Garden transaction', async () => {
  for (const status of ['closed', 'cancelled']) {
    const c = await lead({ status }); assert.equal((await post(payload({ betterCloseRequestId: c.id }))).status, 409);
    assert.equal((await reload(c)).gardenOrderId, null);
  }
});

test('two Garden files racing for one request yield exactly one binding; loser retry refuses', async () => {
  const c = await lead(); const ps = [payload({ betterCloseRequestId: c.id }), payload({ betterCloseRequestId: c.id })];
  const results = await Promise.all(ps.map(p => post(p)));
  assert.equal(results.filter(r => r.status === 200).length, 1);
  assert.ok(results.every(r => [200, 409, 503].includes(r.status)));
  const stored = await reload(c); const winner = ps.find(p => p.gardenOrderId === stored.gardenOrderId);
  assert.ok(winner); assert.equal((await post(winner)).status, 200);
  assert.equal((await post(ps.find(p => p !== winner))).status, 409);
});

test('two requests racing for one Garden UUID cannot both bind', async () => {
  const cs = [await lead(), await lead()]; const gardenOrderId = randomUUID();
  const ps = cs.map(c => payload({ gardenOrderId, betterCloseRequestId: c.id }));
  const rs = await Promise.all(ps.map(p => post(p)));
  assert.equal(rs.filter(r => r.status === 200).length, 1);
  assert.equal(await prisma.closing.count({ where: { gardenOrderId } }), 1);
  const loser = cs.find(c => c.id !== undefined && cs[rs.findIndex(r => r.status === 200)].id !== c.id);
  assert.equal((await reload(loser)).gardenOrderId, null);
});

test('identical concurrent retries converge without duplicate records or emails', async () => {
  const c = await lead(); const p = payload({ betterCloseRequestId: c.id });
  const rs = await Promise.all(Array.from({ length: 5 }, () => post(p)));
  assert.ok(rs.every(r => [200, 503].includes(r.status)));
  assert.equal((await post(p)).status, 200);
  assert.equal(await prisma.closing.count({ where: { gardenOrderId: p.gardenOrderId } }), 1);
  assert.equal(h.sent.length, 0);
});

test('legacy exact file may adopt v3 identity once; missing UUID afterward cannot downgrade', async () => {
  const p = payload({ gardenOrderId: undefined }); const old = await (await post(p)).json();
  assert.equal(old.contractVersion, 2);
  assert.equal((await post({ ...p, gardenOrderId: randomUUID() })).status, 200);
  assert.equal((await reload({ id: old.closingId })).gardenLinkSource, 'legacy_file_number');
  assert.equal((await post(p)).status, 409);
});

test('readback includes binding and unregistered Pro, but requires integration auth', async () => {
  const p = payload({ teammateEmail: 'no-account@example.invalid', teammateRole: 'broker' });
  const c = await (await post(p)).json();
  const get = token => h.load('src/app/api/tps/closings/[id]/route.ts').GET(request({}, token), { params: Promise.resolve({ id: c.closingId }) });
  assert.equal((await get('bad')).status, 401);
  const result = await (await get('synthetic-only')).json();
  assert.equal(result.closing.gardenOrderId, p.gardenOrderId);
  assert.equal(result.closing.gardenFileNumber, p.gardenFileNumber);
  assert.equal(result.closing.teammates[0].email, 'no-account@example.invalid');
});

test('admin edit and direct database writes cannot silently reassign an established binding', async () => {
  const p = payload(); const result = await (await post(p)).json();
  h.setActor({ id: 'synthetic-admin', email: 'admin@example.invalid' });
  const patch = body => h.load('src/app/api/admin/closing/[id]/route.ts').PATCH(request(body), { params: Promise.resolve({ id: result.closingId }) });
  assert.equal((await patch({ gardenFileNumber: id() })).status, 409);
  assert.equal((await patch({ gardenFileNumber: null })).status, 409);
  assert.equal((await patch({ gardenOrderId: randomUUID() })).status, 400);
  assert.equal((await patch({ gardenFileNumber: p.gardenFileNumber, lenderName: 'Edited' })).status, 200);
  for (const data of [{ gardenOrderId: null }, { gardenFileNumber: id() }, { gardenLinkSource: null }, { gardenLinkedAt: new Date(0) }])
    await assert.rejects(prisma.closing.update({ where: { id: result.closingId }, data }));
  assert.equal((await reload({ id: result.closingId })).gardenOrderId, p.gardenOrderId);
});

test('authentication still fails closed for explicit binding', async () => {
  const c = await lead(); assert.equal((await post(payload({ betterCloseRequestId: c.id }), 'bad')).status, 401);
  assert.equal((await reload(c)).gardenOrderId, null);
});

test('both operations handoffs visibly carry the same request ID and do not claim borrower welcome', async () => {
  const requestId = id();
  await h.load('src/lib/email/open-file-ops.ts').sendOpenFileOpsEmail({ closingId: requestId, matched: false, role: 'broker' });
  await h.load('src/lib/email/broker-conversion-ops.ts').sendBrokerConversionOpsEmail({ closingId: requestId, matched: false, convertedAt: new Date() });
  assert.equal(h.sent.length, 2);
  for (const m of h.sent) {
    assert.match(m.textBody, /BetterClose request ID/); assert.ok(m.textBody.includes(requestId));
    assert.match(m.htmlBody, /before saving/i); assert.doesNotMatch(m.textBody, /borrower was sent a welcome/);
  }
});

test('Garden opening advances a linked pending request to active without an automatic borrower email', async () => {
  const c = await lead(); await post(payload({ betterCloseRequestId: c.id }));
  assert.equal((await reload(c)).status, 'pending');
  const result = await h.load('src/lib/closing-milestone.ts').applyMilestoneTransition({ closingId: c.id, kind: 'title_ordered', status: 'done' });
  assert.equal(result.ok, true); assert.equal((await reload(c)).status, 'active'); assert.equal(h.sent.length, 0);
});

test('officer reassignment cannot inherit the old photo/phone; same-officer refresh preserves verified profile', async () => {
  const c = await lead({ escrowOfficerEmail: 'old@example.invalid', escrowOfficerName: 'Old Officer',
    escrowOfficerPhone: 'old-phone', escrowOfficerPhotoUrl: 'https://images.example.invalid/old.png' });
  const apply = h.load('src/lib/closing/officer.ts').applyEscrowOfficer;
  assert.equal(await apply(c.id, { email: 'new@example.invalid', name: 'New Officer' }), 2);
  let row = await reload(c); assert.equal(row.escrowOfficerPhotoUrl, null); assert.equal(row.escrowOfficerPhone, null);
  assert.equal(row.escrowOfficerName, 'New Officer');
  await apply(c.id, { email: 'new@example.invalid', photoUrl: 'https://images.example.invalid/new.png' });
  await apply(c.id, { email: 'new@example.invalid', name: 'New Officer' });
  row = await reload(c); assert.equal(row.escrowOfficerPhotoUrl, 'https://images.example.invalid/new.png');
  assert.equal(h.sent.length, 0);
});
