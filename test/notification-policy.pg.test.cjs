// Real disposable PostgreSQL, real routes/services/templates, synthetic SES and sessions only.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { isIP } = require('node:net');
const { PrismaClient } = require('@prisma/client');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const target = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['127.0.0.1', 'localhost'].includes(target.hostname));
assert.match(target.pathname, /^\/garden_ldi_betterclose_journeys(?:_[a-z0-9]+)*$/);
const prisma = new PrismaClient();
const prefix = 'policy-' + Date.now() + '-';
let seq = 0, verified = false, failRecipient = null, acceptance = 'synthetic-accepted';
const id = () => prefix + (++seq);
const email = () => id() + '@example.invalid';
const eo = { escrowOfficerName: 'Synthetic Officer', escrowOfficerEmail: 'eo@example.invalid',
  escrowOfficerPhotoUrl: 'https://images.example.invalid/eo.png', escrowOfficerPhone: '555-0100' };
const routes = JSON.stringify({ 'eo@example.invalid': 'synthetic-eo@betterclose.co' });
const h = createHarness(prisma, { env: { BC_EO_REPLY_ROUTES: routes }, send: async data => {
  if (data.to === failRecipient) throw new Error('Synthetic refusal');
  return acceptance;
} });
const policy = h.load('src/lib/closing/notificationPolicy.ts');
const kinds = h.load('src/lib/closing.ts').MILESTONE_KINDS;
const user = data => prisma.user.create({ data: { id: id(), email: email(), emailVerified: new Date(), ...data } });
const closing = data => prisma.closing.create({ data: { id: id(), gardenFileNumber: id(), source: 'garden',
  borrowerEmail: email(), propertyAddress: '123 Synthetic Lane', ...eo,
  milestones: { create: kinds.map(kind => ({ kind })) }, ...data } });
const pro = (c, data = {}) => prisma.teammateClosing.create({ data: {
  closingId: c.id, matchedEmail: email(), role: 'realtor', mayManageBorrowerEmails: true, ...data } });
const advance = (c, kind = 'title_ordered', status = 'done') =>
  h.load('src/lib/closing-milestone.ts').applyMilestoneTransition({ closingId: c.id, kind, status });
const drain = c => h.load('src/lib/closing/milestoneDelivery.ts').deliverMilestoneNotifications(c.id);
const setPermission = (c, body) => h.load('src/app/api/closings/[id]/borrower-notifications/route.ts').PATCH(
  new Request('https://betterclose.example.invalid/test', { method: 'PATCH',
    headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), { params: { id: c.id } });
const reload = c => prisma.closing.findUniqueOrThrow({ where: { id: c.id } });
const permission = c => policy.borrowerPermission(c.borrowerEmail, 'synthetic-actor', 'pro', true);
const rows = c => prisma.ingestDelivery.findMany({ where: { closingId: c.id } });

before(async () => {
  const [identity] = await prisma.$queryRawUnsafe('SELECT current_database() AS db, current_user AS role, inet_server_addr()::text AS host');
  assert.equal(identity.db, target.pathname.slice(1));
  assert.equal(identity.role, decodeURIComponent(target.username));
  const container = process.env.GITHUB_ACTIONS === 'true' ? process.env.BC_TEST_POSTGRES_ADDR : null;
  assert.ok(['127.0.0.1/32', '127.0.0.1', '::1/128', '::1'].includes(identity.host) ||
    (container && isIP(container) && identity.host.replace(/\/\d+$/, '') === container));
  verified = true;
});
beforeEach(() => { h.sent.length = 0; h.setActor(null); failRecipient = null; acceptance = 'synthetic-accepted'; h.env.BC_EO_REPLY_ROUTES = routes; });
after(async () => {
  if (verified) {
    await prisma.closing.deleteMany({ where: { OR: [{ id: { startsWith: prefix } }, { gardenFileNumber: { startsWith: prefix } }, { borrowerEmail: { startsWith: prefix } }] } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
  }
  await prisma.$disconnect();
});

test('Garden-first requires no existing BC account or property; ingest sends nothing', async () => {
  const borrowerEmail = email(), teammateEmail = email(), gardenFileNumber = id();
  const result = await h.load('src/lib/closing/gardenIngest.ts').ingestGardenOrder({
    gardenFileNumber, borrowerEmail, teammateEmail, teammateRole: 'broker',
    propertyAddress: '123 Synthetic Lane', escrowOfficer: { name: eo.escrowOfficerName,
      email: eo.escrowOfficerEmail, photoUrl: eo.escrowOfficerPhotoUrl } });
  const c = await reload({ id: result.closingId });
  assert.equal(c.borrowerEmailsEnabled, false);
  assert.equal(c.borrowerEmailPermissionVersion, null);
  assert.equal(c.userId, null);
  const m = await prisma.teammateClosing.findFirst({ where: { closingId: c.id } });
  assert.equal(m.userId, null); assert.equal(m.mayManageBorrowerEmails, true);
  assert.equal(h.sent.length, 0);
  assert.equal((await advance(c)).ok, true);
  assert.deepEqual(h.sent.map(m => m.to), [teammateEmail]);
  assert.equal(h.sent[0].replyTo, 'synthetic-eo@betterclose.co');
  assert.match(h.sent[0].htmlBody, /Synthetic Officer/);
  assert.match(h.sent[0].htmlBody, /images.example.invalid\/eo.png/);
  assert.match(h.sent[0].htmlBody, /reply without creating an account/);
  assert.match(h.sent[0].htmlBody, new RegExp('/teammate/dashboard/' + c.id));
  await advance(c); assert.equal(h.sent.length, 1);
});

test('all automatic borrower milestone and completion emails are off by default, even with a registered owner', async () => {
  const owner = await user(), c = await closing({ userId: owner.id, borrowerEmail: owner.email });
  for (const kind of kinds) assert.equal((await advance(c, kind)).ok, true);
  assert.equal(h.sent.length, 0); assert.equal((await rows(c)).length, 0);
  assert.equal((await reload(c)).status, 'closed');
  assert.ok((await reload(c)).closedAt);
});

test('registered and unregistered Pros get their own EO intro; mute and non-Pro roles are respected', async () => {
  const c = await closing(), registered = await user();
  const a = await pro(c, { matchedEmail: registered.email, userId: registered.id, role: 'broker' });
  const b = await pro(c, { role: 'lender' });
  await pro(c, { muted: true }); await pro(c, { role: 'unknown' });
  await pro(c, { matchedEmail: c.borrowerEmail }); await pro(c, { matchedEmail: c.escrowOfficerEmail });
  assert.equal((await advance(c)).ok, true);
  assert.deepEqual(h.sent.map(m => m.to).sort(), [a.matchedEmail, b.matchedEmail].sort());
});

for (const missing of ['route', 'photo', 'name', 'gardenFileNumber']) test('EO intro waits for verified ' + missing + ', then same event retries once', async () => {
  const c = await closing(), m = await pro(c);
  if (missing === 'route') h.env.BC_EO_REPLY_ROUTES = '{}';
  else await prisma.closing.update({ where: { id: c.id }, data: {
    [missing === 'photo' ? 'escrowOfficerPhotoUrl' : missing === 'name' ? 'escrowOfficerName' : missing]: null } });
  assert.equal((await advance(c)).status, 503);
  assert.equal(h.sent.length, 0);
  assert.equal((await rows(c))[0].lastError, 'eo_introduction_not_ready');
  h.env.BC_EO_REPLY_ROUTES = routes;
  await prisma.closing.update({ where: { id: c.id }, data: { ...eo, gardenFileNumber: c.gardenFileNumber } });
  assert.equal((await advance(c)).ok, true);
  assert.equal(h.sent[0].to, m.matchedEmail);
  await advance(c); assert.equal(h.sent.length, 1);
});

test('verified reply mapping rejects malformed/unverified destinations and unsafe photo URLs', () => {
  for (const mapping of ['not-json', '{}', '{"eo@example.invalid":"not-betterclose@example.invalid"}',
    '{"eo@example.invalid":"valid@betterclose.co\r\nBcc:evil@example.invalid"}']) {
    h.env.BC_EO_REPLY_ROUTES = mapping; assert.equal(policy.verifiedOfficer(eo), null);
  }
  h.env.BC_EO_REPLY_ROUTES = routes;
  for (const url of ['http://images.example.invalid/a', 'javascript:alert(1)', 'https://user:password@images.example.invalid/a'])
    assert.equal(policy.verifiedOfficer({ ...eo, escrowOfficerPhotoUrl: url }), null);
  assert.equal(policy.verifiedOfficer(eo).replyEmail, 'synthetic-eo@betterclose.co');
});

test('only verified owner or trusted Pro on this file can change permission; role self-label is insufficient', async () => {
  const owner = await user(), a = await user(), b = await user(), c = await closing({ userId: owner.id, borrowerEmail: owner.email });
  const member = await pro(c, { userId: a.id, matchedEmail: a.email, mayManageBorrowerEmails: false, role: 'unknown' });
  assert.equal((await setPermission(c, { enabled: true })).status, 401);
  h.setActor(b); assert.equal((await setPermission(c, { enabled: true })).status, 404);
  h.setActor(a);
  const request = new Request('https://betterclose.example.invalid/test', { method: 'PATCH', body: JSON.stringify({ role: 'broker' }) });
  assert.equal((await h.load('src/app/api/teammate/closings/[id]/role/route.ts').PATCH(request, { params: { id: member.id } })).status, 200);
  assert.equal((await setPermission(c, { enabled: true })).status, 404);
  await prisma.teammateClosing.update({ where: { id: member.id }, data: { mayManageBorrowerEmails: true } });
  assert.equal((await setPermission(c, { enabled: true, userId: b.id })).status, 400);
  assert.equal((await setPermission(c, { enabled: true })).status, 200);
  const enabled = await reload(c);
  assert.equal(enabled.borrowerEmailPermissionBy, a.id);
  assert.equal(enabled.borrowerEmailPermissionSource, 'pro');
  assert.equal(await prisma.notificationLog.count({ where: { closingId: c.id, kind: 'borrower_permission:on' } }), 1);
  await setPermission(c, { enabled: true });
  assert.equal((await reload(c)).borrowerEmailPermissionVersion, enabled.borrowerEmailPermissionVersion);
  assert.equal(h.sent.length, 0);
  h.setActor(owner); await setPermission(c, { enabled: false });
  assert.equal((await reload(c)).borrowerEmailsEnabled, false);
});

test('per-file permission and own-email mute are independent; another file remains off', async () => {
  const a = await user(), c = await closing(), other = await closing({ borrowerEmail: c.borrowerEmail });
  await pro(c, { userId: a.id, matchedEmail: a.email, muted: true }); h.setActor(a);
  await setPermission(c, { enabled: true });
  assert.equal((await setPermission(other, { enabled: true })).status, 404);
  for (const kind of kinds) assert.equal((await advance(c, kind)).ok, true);
  assert.equal(h.sent.length, kinds.length);
  assert.ok(h.sent.every(m => m.to === c.borrowerEmail));
  for (const kind of kinds) await advance(other, kind);
  assert.equal(h.sent.length, kinds.length);
});

test('opt-in is future-only; no replay of an already done milestone or suppressed opening', async () => {
  const a = await user(), c = await closing();
  await advance(c);
  await pro(c, { userId: a.id, matchedEmail: a.email, muted: true }); h.setActor(a);
  await setPermission(c, { enabled: true });
  await advance(c); assert.equal(h.sent.length, 0);
  await advance(c, 'title_search');
  assert.deepEqual(h.sent.map(m => m.to), [c.borrowerEmail]);
});

for (const change of ['disable', 'disable-enable', 'recipient']) test('queued borrower retry cancels after ' + change, async () => {
  const c = await closing();
  await prisma.closing.update({ where: { id: c.id }, data: permission(c) });
  failRecipient = c.borrowerEmail;
  assert.equal((await advance(c, 'title_search')).status, 503);
  const data = change === 'recipient' ? { borrowerEmail: email() } : policy.borrowerPermission(c.borrowerEmail, 'actor', 'pro', change === 'disable-enable');
  await prisma.closing.update({ where: { id: c.id }, data });
  failRecipient = null;
  assert.equal((await advance(c, 'title_search')).ok, true);
  assert.equal(h.sent.length, 0); assert.equal((await rows(c))[0].status, 'cancelled');
});

test('partial provider failure retries only failed recipient, with no registered-account prerequisite', async () => {
  const c = await closing(), a = await pro(c), b = await pro(c);
  failRecipient = b.matchedEmail;
  assert.equal((await advance(c)).status, 503);
  assert.deepEqual(h.sent.map(m => m.to), [a.matchedEmail]);
  failRecipient = null;
  assert.equal((await advance(c)).ok, true);
  assert.deepEqual(h.sent.map(m => m.to).sort(), [a.matchedEmail, b.matchedEmail].sort());
  await advance(c); assert.equal(h.sent.length, 2);
});

test('no provider acceptance stays pending; active lease is not stolen, expired lease is recovered', async () => {
  const c = await closing(); await pro(c); acceptance = null;
  assert.equal((await advance(c)).status, 503);
  const [intent] = await rows(c);
  assert.equal(intent.status, 'pending');
  await prisma.ingestDelivery.update({ where: { id: intent.id }, data: {
    status: 'sending', leaseToken: 'synthetic-old', leaseUntil: new Date(Date.now() + 60000) } });
  acceptance = 'synthetic-accepted';
  assert.equal((await drain(c)).pending, 1); assert.equal(h.sent.length, 0);
  await prisma.ingestDelivery.update({ where: { id: intent.id }, data: { leaseUntil: new Date(0) } });
  assert.equal((await drain(c)).pending, 0); assert.equal(h.sent.length, 1);
});

test('concurrent repeated transitions settle to one intent and one normal delivery', async () => {
  const c = await closing(); await pro(c);
  await Promise.all(Array.from({ length: 6 }, () => advance(c)));
  assert.equal((await advance(c)).ok, true);
  assert.equal((await rows(c)).length, 1);
  assert.equal(h.sent.length, 1);
});

test('withdrawn milestone or muted Pro cancels pending delivery', async () => {
  for (const mode of ['milestone', 'muted']) {
    const c = await closing(), m = await pro(c); failRecipient = m.matchedEmail;
    await advance(c); failRecipient = null;
    if (mode === 'muted') await prisma.teammateClosing.update({ where: { id: m.id }, data: { muted: true } });
    else await prisma.milestone.update({ where: { closingId_kind: { closingId: c.id, kind: 'title_ordered' } }, data: { status: 'pending' } });
    assert.equal((await drain(c)).pending, 0);
    assert.equal((await rows(c))[0].status, 'cancelled');
  }
  assert.equal(h.sent.length, 0);
});

test('borrower self-request gets initial receipt; ongoing opt-in only after verified sign-in, never other files', async () => {
  const u = await user();
  const result = await h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder({
    borrowerEmail: u.email, propertyAddress: '123 Synthetic Lane' },
    { matchExisting: false, borrowerInitiated: true, welcomePurpose: 'request_received' });
  const c = await reload({ id: result.closingId }), other = await closing({ borrowerEmail: u.email });
  assert.equal(c.borrowerEmailsEnabled, false); assert.equal(h.sent.length, 1);
  await h.load('src/lib/auth/options.ts').authOptions.events.signIn({ user: u });
  assert.equal((await reload(c)).borrowerEmailsEnabled, true);
  assert.equal((await reload(other)).borrowerEmailsEnabled, false);
  h.setActor(u); await setPermission(c, { enabled: false });
  await h.load('src/lib/auth/options.ts').authOptions.events.signIn({ user: u });
  assert.equal((await reload(c)).borrowerEmailsEnabled, false, 'sign-in must not override an opt-out');
});

test('new verified borrower account opts its new stub in; merely owning a legacy file does not', async () => {
  const u = await user();
  const c = await h.load('src/lib/closing.ts').getOrCreateClosingForUser(u.id);
  assert.equal(c.borrowerEmailsEnabled, true); assert.equal(c.borrowerEmail, u.email);
  const v = await user(), legacy = await closing({ userId: v.id, borrowerEmail: v.email });
  await h.load('src/lib/closing.ts').getOrCreateClosingForUser(v.id);
  assert.equal((await reload(legacy)).borrowerEmailsEnabled, false);
});

test('legacy unsent welcome/invite intents are retired without replay; sent records remain intact', async () => {
  const c = await closing();
  for (const [kind, status] of [['welcome', 'pending'], ['teammate_invite', 'sending'], ['welcome', 'sent']])
    await prisma.ingestDelivery.create({ data: { closingId: c.id, kind, status, recipient: email(), payload: {} } });
  await h.load('src/lib/closing/gardenIngest.ts').deliverIngestNotifications(c.id);
  assert.deepEqual((await rows(c)).map(r => r.status).sort(), ['cancelled', 'cancelled', 'sent']);
  assert.equal(h.sent.length, 0);
});

test('a missing borrower email cannot be enabled, and merely being a trusted Pro cannot edit someone else\'s file', async () => {
  const u = await user(), c = await closing({ borrowerEmail: null }), other = await closing();
  await pro(c, { userId: u.id, matchedEmail: u.email }); h.setActor(u);
  assert.equal((await setPermission(c, { enabled: true })).status, 409);
  assert.equal((await setPermission(other, { enabled: true })).status, 404);
});

test('partial Garden refresh does not revoke a previously verified Pro association', async () => {
  const payload = { gardenFileNumber: id(), borrowerEmail: email(), teammateEmail: email(), teammateRole: 'realtor' };
  const ingest = h.load('src/lib/closing/gardenIngest.ts').ingestGardenOrder;
  const result = await ingest(payload);
  await ingest({ ...payload, teammateRole: undefined });
  const member = await prisma.teammateClosing.findFirst({ where: { closingId: result.closingId } });
  assert.equal(member.role, 'realtor'); assert.equal(member.mayManageBorrowerEmails, true);
});

test('permission audit failure rolls back the permission change', async () => {
  const owner = await user(), c = await closing({ userId: owner.id, borrowerEmail: owner.email });
  const wrapped = new Proxy(prisma, { get(target, key) {
    if (key === '$transaction') return callback => target.$transaction(tx => callback(new Proxy(tx, {
      get(client, field) { return field === 'notificationLog' ? { create: async () => { throw new Error('synthetic audit failure'); } } : client[field]; }
    })));
    return target[key];
  } });
  const isolated = createHarness(wrapped); isolated.setActor(owner);
  const route = isolated.load('src/app/api/closings/[id]/borrower-notifications/route.ts');
  await assert.rejects(route.PATCH(new Request('https://betterclose.example.invalid/test', {
    method: 'PATCH', body: JSON.stringify({ enabled: true }) }), { params: { id: c.id } }), /synthetic audit failure/);
  const stored = await reload(c);
  assert.equal(stored.borrowerEmailsEnabled, false); assert.equal(stored.borrowerEmailPermissionVersion, null);
});

test('notification intent failure rolls back transition; retry cannot lose the opening email', async () => {
  const c = await closing(); await pro(c);
  const wrapped = new Proxy(prisma, { get(target, key) {
    if (key === '$transaction') return (callback, options) => target.$transaction(tx => callback(new Proxy(tx, {
      get(client, field) { return field === 'ingestDelivery' ? { upsert: async () => { throw new Error('synthetic queue failure'); } } : client[field]; }
    })), options);
    return target[key];
  } });
  const isolated = createHarness(wrapped);
  assert.equal((await isolated.load('src/lib/closing-milestone.ts').applyMilestoneTransition({
    closingId: c.id, kind: 'title_ordered', status: 'done' })).status, 503);
  const m = await prisma.milestone.findUnique({ where: { closingId_kind: { closingId: c.id, kind: 'title_ordered' } } });
  assert.equal(m.status, 'pending'); assert.equal(m.deliveryPreparedAt, null); assert.equal(isolated.sent.length, 0);
  assert.equal((await advance(c)).ok, true); assert.equal(h.sent.length, 1);
});
