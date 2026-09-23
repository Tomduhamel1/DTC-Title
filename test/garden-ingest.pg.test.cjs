// Real local PostgreSQL; all email functions replaced before source is loaded.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');

const url = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname));
assert.match(url.pathname, /^\/garden_ldi_[a-z0-9_]+$/);
const prisma = new PrismaClient();
const prefix = 'BCFIX-' + Date.now() + '-';
let seq = 0, failEmail = false, failOfficer = false, failTeammate = false, dryRun = false;
const sent = [];
const mocks = {
  '@/lib/db': { prisma },
  '@/lib/email/welcome': { sendWelcomeEmail: async data => {
    if (failEmail) throw new Error('synthetic SES refusal');
    if (dryRun) return null;
    sent.push(['welcome', data.borrowerEmail]); return 'synthetic-message';
  }},
  '@/lib/email/teammate-invite': { sendTeammateInviteEmail: async data => {
    if (failEmail) throw new Error('synthetic SES refusal');
    sent.push(['invite', data.email]); return 'synthetic-message';
  }},
};
const modules = new Map();
function load(file) {
  const absolute = path.resolve(__dirname, '..', file);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const mod = { exports: {} }; modules.set(absolute, mod);
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const localRequire = name => {
    if (mocks[name]) return mocks[name];
    if (name.startsWith('@/')) return load('src/' + name.slice(2) + '.ts');
    if (['crypto', '@prisma/client', 'next/server', 'zod'].includes(name)) return require(name);
    throw new Error('Unapproved test dependency: ' + name);
  };
  new Function('require', 'exports', 'module', source)(localRequire, mod.exports, mod);
  return mod.exports;
}
const officer = load('src/lib/closing/officer.ts');
const teammates = load('src/lib/teammate/match.ts');
const upsertTeammate = teammates.upsertTeammateClosing;
teammates.upsertTeammateClosing = (...args) => {
  if (failTeammate) throw new Error('synthetic teammate failure');
  return upsertTeammate(...args);
};
const applyOfficer = officer.applyEscrowOfficer;
officer.applyEscrowOfficer = (...args) => {
  if (failOfficer) throw new Error('synthetic officer failure');
  return applyOfficer(...args);
};
const { ingestGardenOrder, IngestConflict, IngestPending, deliverIngestNotifications } = load('src/lib/closing/gardenIngest.ts');
const { POST } = load('src/app/api/orders/ingest/route.ts');
const payload = extra => ({ gardenFileNumber: prefix + (++seq), borrowerEmail: 'repeat@example.invalid',
  propertyAddress: '10 Test Street', closingDate: '2026-10-31', loanAmount: 100000, ...extra });
const request = (body, token = 'synthetic-secret') => new Request('https://local.invalid/api/orders/ingest', {
  method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body),
});
before(async () => {
  const [identity] = await prisma.$queryRawUnsafe('SELECT current_database() AS db');
  assert.equal(identity.db, url.pathname.slice(1));
  process.env.ORDER_INGEST_SECRET = 'synthetic-secret';
});
beforeEach(() => { failEmail = false; failOfficer = false; failTeammate = false; dryRun = false; sent.length = 0; });
after(async () => {
  await prisma.closing.deleteMany({ where: { gardenFileNumber: { startsWith: prefix } } });
  await prisma.$disconnect();
});

test('different Garden files sharing email/phone/address remain distinct, including teammate access', async () => {
  const a = await ingestGardenOrder(payload({ borrowerPhone: '4015550100' }));
  const b = await ingestGardenOrder(payload({ borrowerPhone: '4015550100', teammateEmail: 'agent@example.invalid' }));
  assert.notEqual(a.closingId, b.closingId);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: a.closingId } }), 0);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: b.closingId } }), 1);
});
test('same file repeats use the same closing and do not resend completed emails', async () => {
  const p = payload({ teammateEmail: 'agent@example.invalid', escrowOfficer: { email: 'officer@example.invalid', name: 'Officer' } });
  const first = await ingestGardenOrder(p);
  const second = await ingestGardenOrder(p);
  assert.equal(first.closingId, second.closingId);
  assert.equal(second.matchedBy, 'garden_file_number');
  assert.equal(second.officerFieldsSet, 2);
  assert.equal(second.teammateLinked, true);
  assert.equal(sent.length, 2);
});
test('conflicting nonblank amounts/dates return field names without overwriting or adding teammates', async () => {
  const p = payload();
  const first = await ingestGardenOrder(p);
  const res = await POST(request({ ...p, loanAmount: 200000, closingDate: '2026-11-01', teammateEmail: 'wrong@example.invalid' }));
  assert.equal(res.status, 409);
  assert.deepEqual((await res.json()).fields.sort(), ['closingDate', 'loanAmount']);
  const stored = await prisma.closing.findUnique({ where: { id: first.closingId } });
  assert.equal(stored.loanAmount, 100000);
  assert.equal(await prisma.teammateClosing.count({ where: { closingId: first.closingId } }), 0);
});
test('blank fields can be filled and officer updates are acknowledged', async () => {
  const p = payload({ loanAmount: undefined, closingDate: undefined });
  const first = await ingestGardenOrder(p);
  const next = await ingestGardenOrder({ ...p, loanAmount: 200000, escrowOfficer: { name: 'Updated' } });
  assert.equal(next.officerFieldsSet, 1);
  assert.equal((await prisma.closing.findUnique({ where: { id: first.closingId } })).loanAmount, 200000);
});
test('officer failure rolls back new closing, teammate and email intent; retry succeeds', async () => {
  const p = payload({ teammateEmail: 'agent@example.invalid', escrowOfficer: { name: 'Officer' } });
  failOfficer = true;
  assert.equal((await POST(request(p))).status, 503);
  assert.equal(await prisma.closing.count({ where: { gardenFileNumber: p.gardenFileNumber } }), 0);
  assert.equal(sent.length, 0);
  failOfficer = false;
  assert.equal((await POST(request(p))).status, 200);
});
test('failed emails persist pending intents and retry on existing closing without duplication', async () => {
  const p = payload({ teammateEmail: 'agent@example.invalid' });
  failEmail = true;
  const res = await POST(request(p));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'notification_pending');
  const row = await prisma.closing.findUnique({ where: { gardenFileNumber: p.gardenFileNumber } });
  assert.equal(await prisma.ingestDelivery.count({ where: { closingId: row.id, status: 'pending' } }), 2);
  failEmail = false;
  const done = await ingestGardenOrder(p);
  assert.equal(done.closingId, row.id);
  assert.equal(sent.length, 2);
  await ingestGardenOrder(p);
  assert.equal(sent.length, 2);
});
test('teammate failure rolls back all ingest writes rather than claiming teammateLinked', async () => {
  const p = payload({ teammateEmail: 'agent@example.invalid' });
  failTeammate = true;
  assert.equal((await POST(request(p))).status, 503);
  assert.equal(await prisma.closing.count({ where: { gardenFileNumber: p.gardenFileNumber } }), 0);
  assert.equal(sent.length, 0);
});
test('first borrower email arriving later creates one durable welcome intent', async () => {
  const p = payload({ borrowerEmail: undefined });
  const first = await ingestGardenOrder(p);
  assert.equal(sent.length, 0);
  await ingestGardenOrder({ ...p, borrowerEmail: 'late@example.invalid' });
  assert.equal(sent.length, 1);
  assert.equal(await prisma.ingestDelivery.count({ where: { closingId: first.closingId, kind: 'welcome' } }), 1);
});
test('dry-run without provider acceptance stays pending', async () => {
  dryRun = true;
  await assert.rejects(ingestGardenOrder(payload()), IngestPending);
});
test('concurrent identical ingests never create two closings; retriable races settle', async () => {
  const p = payload();
  const results = await Promise.all(Array.from({ length: 6 }, () => POST(request(p))));
  assert.ok(results.every(r => [200,503].includes(r.status)));
  const final = await POST(request(p));
  assert.equal(final.status, 200);
  assert.equal(await prisma.closing.count({ where: { gardenFileNumber: p.gardenFileNumber } }), 1);
  assert.equal(sent.filter(([kind]) => kind === 'welcome').length, 1);
});
test('unbound legacy lead is never automatically claimed by shared borrower identity', async () => {
  const lead = await prisma.closing.create({ data: { borrowerEmail: 'repeat@example.invalid' } });
  try { assert.notEqual((await ingestGardenOrder(payload())).closingId, lead.id); }
  finally { await prisma.closing.delete({ where: { id: lead.id } }); }
});
test('missing/invalid dates, missing identity and unknown fields fail before writing', async () => {
  for (const body of [payload({ closingDate: '2026-02-31' }), payload({ gardenFileNumber: '' }), payload({ typoField: 'x' })]) {
    assert.equal((await POST(request(body))).status, 400);
    if (body.gardenFileNumber) assert.equal(await prisma.closing.count({ where: { gardenFileNumber: body.gardenFileNumber } }), 0);
  }
});
test('authentication fails closed', async () => {
  const p = payload();
  assert.equal((await POST(request(p, 'wrong'))).status, 401);
  assert.equal(await prisma.closing.count({ where: { gardenFileNumber: p.gardenFileNumber } }), 0);
});
test('active notification lease is not stolen; expired lease is recoverable', async () => {
  const p = payload();
  failEmail = true; await assert.rejects(ingestGardenOrder(p), IngestPending);
  const c = await prisma.closing.findUnique({ where: { gardenFileNumber: p.gardenFileNumber } });
  await prisma.ingestDelivery.updateMany({ where: { closingId: c.id }, data: {
    status: 'sending', leaseToken: 'old-worker', leaseUntil: new Date(Date.now() + 60000),
  } });
  failEmail = false;
  await assert.rejects(deliverIngestNotifications(c.id), IngestPending);
  assert.equal(sent.length, 0);
  await prisma.ingestDelivery.updateMany({ where: { closingId: c.id }, data: { leaseUntil: new Date(0) } });
  await deliverIngestNotifications(c.id);
  assert.equal(sent.length, 1);
});
