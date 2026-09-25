const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { isIP } = require('node:net');
const { PrismaClient } = require('@prisma/client');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const target = new URL(process.env.DATABASE_URL || 'http://missing');
assert.ok(['127.0.0.1', 'localhost'].includes(target.hostname));
assert.match(target.pathname, /^\/garden_ldi_betterclose_journeys(?:_[a-z0-9]+)*$/);
const prisma = new PrismaClient();
const prefix = 'workspace-' + Date.now() + '-'; let sequence = 0, verified = false;
const id = () => prefix + (++sequence);
const user = (name = 'Person') => { const uid = id(); return prisma.user.create({ data: { id: uid, name, email: uid + '@example.invalid', emailVerified: new Date() } }); };
const file = data => prisma.closing.create({ data: { id: id(), status: 'active', transactionType: 'purchase', propertyZip: '75201', salePrice: 400000, loanAmount: 320000, ...data } });
const report = input => ({ transactionType: input.transactionType, zip: input.zip, state: 'TX', homeValue: input.homeValue, loanAmount: input.loanAmount,
  generatedAt: '2026-09-25T00:00:00.000Z', lineItems: [{ id: 'fee', label: 'Synthetic settlement charge', category: 'title-settlement', ourCost: 800, isFixed: true }] });
function harness(admin) {
  const storageCalls = [], estimates = [];
  const storage = { storageEnabled: () => true,
    signUpload: async input => { storageCalls.push(['put', input]); return { url: 'https://private.invalid/upload', headers: {} }; },
    verifyUpload: async input => { storageCalls.push(['verify', input]); return 'immutable-version'; },
    signDownload: async input => { storageCalls.push(['get', input]); return 'https://private.invalid/download'; },
  };
  const h = createHarness(prisma, { env: { BC_FILE_WORKSPACE_ENABLED: 'true', ADMIN_EMAILS: admin.email }, storage,
    estimate: async input => { estimates.push(input); return report(input); } });
  const route = h.load('src/app/api/closings/[id]/workspace/route.ts');
  const tps = h.load('src/app/api/tps/closings/[id]/workspace/route.ts');
  const call = async (c, body, options = {}) => {
    const req = new Request('https://betterclose.example.invalid/api/closings/' + c.id + '/workspace', {
      method: body ? 'POST' : 'GET', headers: { origin: 'https://betterclose.example.invalid', 'content-type': 'application/json', ...options.headers },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const response = await (options.garden ? tps : route)[body ? 'POST' : 'GET'](req, { params: Promise.resolve({ id: c.id }) });
    return { status: response.status, body: await response.json() };
  };
  return { ...h, call, storage, storageCalls, estimates };
}
const begin = { action: 'begin', fileName: 'synthetic.pdf', fileSize: 42, mimeType: 'application/pdf', sha256: 'a'.repeat(64) };
async function uploaded(h, c) {
  const started = await h.call(c, begin); assert.equal(started.status, 200);
  const d = started.body.document;
  const done = await h.call(c, { action: 'confirm', documentId: d.id, revision: d.revision }); assert.equal(done.status, 200);
  return done.body.document;
}
before(async () => {
  const [r] = await prisma.$queryRaw`SELECT current_database() AS db, current_user AS role, inet_server_addr()::text AS host`;
  assert.equal(r.db, target.pathname.slice(1)); assert.equal(r.role, decodeURIComponent(target.username));
  const container = process.env.GITHUB_ACTIONS === 'true' && process.env.BC_TEST_POSTGRES_ADDR;
  assert.ok(['127.0.0.1', '127.0.0.1/32', '::1', '::1/128'].includes(r.host) || (container && isIP(container) && r.host.replace(/\/\d+$/, '') === container)); verified = true;
});
after(async () => {
  if (verified) {
    await prisma.feeQuote.deleteMany({ where: { shareToken: { startsWith: prefix } } });
    await prisma.closing.deleteMany({ where: { OR: [{ id: { startsWith: prefix } }, { gardenFileNumber: { startsWith: prefix } }] } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
  }
  await prisma.$disconnect();
});

test('anonymous, unrelated user, forged EO contact and cross-site mutation are refused before storage access', async () => {
  const admin = await user(), stranger = await user(), borrower = await user();
  const c = await file({ userId: borrower.id, escrowOfficerEmail: stranger.email }); const h = harness(admin);
  assert.equal((await h.call(c)).status, 401);
  h.setActor(stranger); assert.equal((await h.call(c)).status, 404);
  assert.equal((await h.call(c, begin)).status, 404);
  h.setActor(borrower); assert.equal((await h.call(c, begin, { headers: { origin: 'https://evil.invalid' } })).status, 403);
  assert.deepEqual(h.storageCalls, []);
});

test('disabling the workspace cannot return a false success for an already-open upload form', async () => {
  const admin = await user(); const c = await file(); const h = harness(admin); h.setActor(admin);
  h.env.BC_FILE_WORKSPACE_ENABLED = 'false';
  assert.deepEqual((await h.call(c)).body, { enabled: false });
  assert.equal((await h.call(c, begin)).status, 409); assert.equal(h.storageCalls.length, 0);
});

test('uploaded borrower docs stay private; staff selects exact recipients, download binds immutable version, no emails', async () => {
  const admin = await user(), borrower = await user(), pro = await user(), other = await user();
  const c = await file({ userId: borrower.id });
  for (const u of [pro, other]) await prisma.teammateClosing.create({ data: { closingId: c.id, userId: u.id, matchedEmail: u.email, role: 'lender' } });
  const h = harness(admin); h.setActor(borrower); const d = await uploaded(h, c);
  h.setActor(pro); assert.deepEqual((await h.call(c)).body.documents, []);
  assert.equal((await h.call(c, { action: 'download', documentId: d.id })).status, 404);
  h.setActor(admin);
  const shared = await h.call(c, { action: 'share', documentId: d.id, revision: d.revision, recipientUserIds: [pro.id] }); assert.equal(shared.status, 200);
  h.setActor(pro); const listed = (await h.call(c)).body.documents;
  assert.equal(listed.length, 1); for (const key of ['storageKey', 'storageVersion', 'sha256', 'recipientUserIds', 'uploaderId']) assert.equal(key in listed[0], false);
  assert.equal((await h.call(c, { action: 'download', documentId: d.id })).status, 200);
  assert.equal(h.storageCalls.at(-1)[1].version, 'immutable-version');
  assert.equal((await h.call(c, { action: 'share', documentId: d.id, revision: shared.body.document.revision, recipientUserIds: [other.id] })).status, 403);
  h.setActor(other); assert.deepEqual((await h.call(c)).body.documents, []);
  assert.deepEqual(h.sent, []);
  assert.equal(await prisma.closingDocumentEvent.count({ where: { documentId: d.id } }), 4);
});

test('different file ID, forged source/key, excess size, removed membership and unregistered recipient are rejected', async () => {
  const admin = await user(), pro = await user(), stranger = await user(); const h = harness(admin);
  const c = await file(), another = await file();
  const m = await prisma.teammateClosing.create({ data: { closingId: c.id, userId: pro.id, matchedEmail: pro.email } });
  h.setActor(pro); const d = await uploaded(h, c);
  for (const invalid of [{ ...begin, sourceDocumentId: 'f'.repeat(36) }, { ...begin, fileSize: 20971521 }, { ...begin, storageKey: 'someone-else' }, { ...begin, fileName: '../secret' }]) assert.equal((await h.call(c, invalid)).status, 400);
  h.setActor(admin); assert.equal((await h.call(another, { action: 'download', documentId: d.id })).status, 404);
  assert.equal((await h.call(c, { action: 'share', documentId: d.id, revision: d.revision, recipientUserIds: [stranger.id] })).status, 400);
  await prisma.teammateClosing.delete({ where: { id: m.id } }); h.setActor(pro);
  assert.equal((await h.call(c, { action: 'download', documentId: d.id })).status, 404);
});

test('revocation and optimistic revision checks prevent a stale share from restoring access', async () => {
  const admin = await user(), borrower = await user(); const c = await file({ userId: borrower.id }); const h = harness(admin); h.setActor(admin);
  const d = await uploaded(h, c);
  assert.equal((await h.call(c, { action: 'revoke', documentId: d.id, revision: d.revision })).status, 200);
  assert.equal((await h.call(c, { action: 'share', documentId: d.id, revision: d.revision, recipientUserIds: [borrower.id] })).status, 409);
  assert.equal((await h.call(c, { action: 'download', documentId: d.id })).status, 409);
});

test('failed upload verification and security scan never yield a downloadable URL', async () => {
  const admin = await user(); const c = await file(); const h = harness(admin); h.setActor(admin);
  const started = await h.call(c, begin), d = started.body.document;
  h.storage.verifyUpload = async () => { throw new Error('bad checksum/size/version'); };
  assert.equal((await h.call(c, { action: 'confirm', documentId: d.id, revision: d.revision })).status, 503);
  assert.equal((await prisma.closingDocument.findUnique({ where: { id: d.id } })).status, 'pending');
  h.storage.verifyUpload = async () => 'v2';
  assert.equal((await h.call(c, { action: 'confirm', documentId: d.id, revision: d.revision })).status, 200);
  h.storage.signDownload = async () => { throw new Error('scan did not pass'); };
  const result = await h.call(c, { action: 'download', documentId: d.id }); assert.equal(result.status, 503); assert.equal(result.body.url, undefined);
});

test('pending scan is a typed wait state, not an outage or a confirmed publication', async () => {
  const admin = await user(); const c = await file(); const h = harness(admin); h.setActor(admin);
  const started = await h.call(c, begin); const d = started.body.document;
  const { WorkspaceError } = h.load('src/lib/fileWorkspace/access.ts');
  h.storage.verifyUpload = async () => { throw new WorkspaceError(409, 'Upload received. The security scan is still running.', 'DOCUMENT_SCAN_PENDING'); };
  const waiting = await h.call(c, { action: 'confirm', documentId: d.id, revision: d.revision });
  assert.equal(waiting.status, 409); assert.equal(waiting.body.code, 'DOCUMENT_SCAN_PENDING');
  assert.equal(waiting.body.url, undefined);
  const stored = await prisma.closingDocument.findUnique({ where: { id: d.id } });
  assert.equal(stored.status, 'pending'); assert.equal(stored.revision, d.revision); assert.equal(stored.storageVersion, null);
  assert.deepEqual(stored.recipientUserIds, []); assert.deepEqual(h.sent, []);
});

test('Garden must authenticate AND match closing/order/file identity; source retry does not create another document', async () => {
  const admin = await user(); const orderId = '44444444-4444-4444-8444-444444444444';
  const c = await file({ gardenOrderId: orderId, gardenFileNumber: id(), gardenLinkedAt: new Date(), gardenLinkSource: 'garden_first' }); const h = harness(admin);
  const headers = { authorization: 'Bearer synthetic-only', 'x-garden-order-id': orderId, 'x-garden-file-number': c.gardenFileNumber, 'x-garden-actor-id': '7' };
  assert.equal((await h.call(c, null, { garden: true, headers: { ...headers, 'x-garden-file-number': 'other-file' } })).status, 404);
  assert.equal((await h.call(c, null, { garden: true, headers: { ...headers, authorization: 'Bearer wrong' } })).status, 401);
  const body = { ...begin, sourceDocumentId: '55555555-5555-4555-8555-555555555555', sourceVersion: '1:a' };
  const a = await h.call(c, body, { garden: true, headers }); assert.equal(a.status, 200);
  const b = await h.call(c, body, { garden: true, headers }); assert.equal(b.body.document.id, a.body.document.id);
  assert.equal((await h.call(c, { ...body, sha256: 'b'.repeat(64) }, { garden: true, headers })).status, 409);
  assert.deepEqual(a.body.document.recipientUserIds, []);
});

test('dashboard GET is read-only; purchase/refinance use the actual website engine inputs, history remains immutable', async () => {
  const admin = await user(); const c = await file(); const h = harness(admin); h.setActor(admin);
  assert.equal((await h.call(c)).body.estimates.versions.length, 0); assert.equal(h.estimates.length, 0);
  assert.equal((await h.call(c, { action: 'estimate', expectedRevision: 0 })).status, 200);
  assert.deepEqual(h.estimates[0], { transactionType: 'purchase', zip: '75201', homeValue: 400000, loanAmount: 320000 });
  const original = await prisma.closingEstimateVersion.findFirst({ where: { closingId: c.id } });
  assert.equal((await h.call(c, { action: 'estimate', expectedRevision: 1, input: { transactionType: 'refinance', zip: '75201', homeValue: null, loanAmount: 250000 } })).status, 200);
  assert.deepEqual(h.estimates[1], { transactionType: 'refinance', zip: '75201', homeValue: 0, loanAmount: 250000 });
  assert.deepEqual(await prisma.closingEstimateVersion.findUnique({ where: { id: original.id } }), original);
  assert.equal((await prisma.closing.findUnique({ where: { id: c.id } })).loanAmount, 320000);
});

test('linked website quote is preserved byte-for-byte without repricing', async () => {
  const admin = await user(); const c = await file(); const h = harness(admin); h.setActor(admin);
  const output = { ...report({ transactionType: 'purchase', zip: '75201', homeValue: 300000, loanAmount: 200000 }), frozenTotals: { ourTotal: 812.34 } };
  await prisma.feeQuote.create({ data: { shareToken: id(), inputHash: 'original', inputJson: { transactionType: 'purchase', zip: '75201', homeValue: 300000, loanAmount: 200000 }, outputJson: output, convertedClosingId: c.id, expiresAt: new Date('2030-01-01') } });
  assert.equal((await h.call(c, { action: 'estimate', expectedRevision: 0 })).status, 200);
  const saved = await prisma.closingEstimateVersion.findFirst({ where: { closingId: c.id } });
  assert.deepEqual(saved.outputJson, output); assert.equal(saved.source, 'linked_quote'); assert.equal(h.estimates.length, 0);
});

test('missing transaction type and cash zero are not inferred; 80% website assumption is explicit and not written to file', async () => {
  const admin = await user(); const h = harness(admin); h.setActor(admin);
  const unknown = await file({ transactionType: null }); assert.equal((await h.call(unknown, { action: 'estimate', expectedRevision: 0 })).status, 422);
  const cash = await file({ loanAmount: 0 }); assert.equal((await h.call(cash, { action: 'estimate', expectedRevision: 0 })).status, 422);
  const missingLoan = await file({ loanAmount: null }); assert.equal((await h.call(missingLoan, { action: 'estimate', expectedRevision: 0 })).status, 200);
  const saved = await prisma.closingEstimateVersion.findFirst({ where: { closingId: missingLoan.id } });
  assert.match(saved.assumptions[0], /80%/); assert.equal((await prisma.closing.findUnique({ where: { id: missingLoan.id } })).loanAmount, null);
});

test('concurrent initial estimates save only one baseline; closed files and participant recalculation are refused', async () => {
  const admin = await user(), borrower = await user(); const c = await file({ userId: borrower.id }); const h = harness(admin); h.setActor(admin);
  const results = await Promise.all([h.call(c, { action: 'estimate', expectedRevision: 0 }), h.call(c, { action: 'estimate', expectedRevision: 0 })]);
  assert.equal(results.filter(r => r.status === 200).length, 1); assert.equal(await prisma.closingEstimateVersion.count({ where: { closingId: c.id } }), 1);
  h.setActor(borrower); assert.equal((await h.call(c, { action: 'estimate', expectedRevision: 1 })).status, 403);
  h.setActor(admin); await prisma.closing.update({ where: { id: c.id }, data: { status: 'closed' } });
  assert.equal((await h.call(c, { action: 'estimate', expectedRevision: 1 })).status, 409);
});

test('new emailed/Garden file automatically captures an initial quote, replay preserves it and does not send email', async () => {
  const admin = await user(); const h = harness(admin);
  const input = { gardenFileNumber: id(), gardenOrderId: require('node:crypto').randomUUID(), transactionType: 'purchase', propertyZip: '75201', salePrice: 300000, loanAmount: 240000 };
  const ingest = h.load('src/lib/closing/gardenIngest.ts').ingestGardenOrder;
  const opened = await ingest(input);
  assert.equal(await prisma.closingEstimateVersion.count({ where: { closingId: opened.closingId } }), 1);
  await ingest(input); assert.equal(h.estimates.length, 1); assert.deepEqual(h.sent, []);
});

test('direct order intake captures a starting estimate; missing pricing details do not fabricate one or stop file creation', async () => {
  const admin = await user(); const h = harness(admin);
  const create = h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder;
  const opened = await create({ gardenFileNumber: id(), transactionType: 'refinance', propertyZip: '75201', loanAmount: 200000 }, { matchExisting: false });
  assert.equal(await prisma.closingEstimateVersion.count({ where: { closingId: opened.closingId } }), 1);
  const incomplete = await create({ gardenFileNumber: id(), propertyAddress: 'Synthetic missing details' }, { matchExisting: false });
  assert.equal(await prisma.closingEstimateVersion.count({ where: { closingId: incomplete.closingId } }), 0);
  assert.deepEqual(h.sent, []);
});

test('concurrent source-data change prevents saving a misleading estimate', async () => {
  const c = await file();
  const h = createHarness(prisma, { estimate: async input => {
    await prisma.closing.update({ where: { id: c.id }, data: { salePrice: 500000 } });
    return report(input);
  } });
  await assert.rejects(h.load('src/lib/fileWorkspace/estimates.ts').createEstimate(c.id, 'synthetic', 0), e => e.status === 409);
  assert.equal(await prisma.closingEstimateVersion.count({ where: { closingId: c.id } }), 0);
});

test('expired Garden upload can safely restart without changing the reviewed bytes or creating another document', async () => {
  const admin = await user(); const c = await file({ gardenOrderId: require('node:crypto').randomUUID(), gardenFileNumber: id(), gardenLinkedAt: new Date(), gardenLinkSource: 'garden_first' });
  const h = harness(admin);
  const headers = { authorization: 'Bearer synthetic-only', 'x-garden-order-id': c.gardenOrderId, 'x-garden-file-number': c.gardenFileNumber, 'x-garden-actor-id': '7' };
  const body = { ...begin, sourceDocumentId: require('node:crypto').randomUUID(), sourceVersion: '1:unchanged' };
  const first = await h.call(c, body, { garden: true, headers }); const doc = first.body.document;
  const prior = await prisma.closingDocument.update({ where: { id: doc.id }, data: { uploadExpiresAt: new Date('2000-01-01') } });
  const second = await h.call(c, body, { garden: true, headers }); assert.equal(second.status, 200);
  assert.equal(second.body.document.id, doc.id); assert.equal(second.body.document.revision, doc.revision + 1);
  assert.notEqual((await prisma.closingDocument.findUnique({ where: { id: doc.id } })).storageKey, prior.storageKey);
  assert.equal(await prisma.closingDocument.count({ where: { closingId: c.id } }), 1);
});
