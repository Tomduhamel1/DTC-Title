const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHarness, capture, cases, contract } = require('./helpers/email-capture.cjs');

for (const role of [undefined, 'unknown', 'broker', 'realtor', 'lender']) {
  test(`receipt for ${role || 'borrower'} is not a file-opened confirmation`, async () => {
    const spec = { ...cases[0], data: { ...cases[0].data,
      closingId: 'synthetic-receipt', purpose: 'request_received',
      placingParty: role ? { role, lenderCompany: 'Example Mortgage' } : undefined } };
    const { sent } = await capture(spec);
    assert.equal(sent.length, 1);
    const msg = sent[0];
    assert.equal(msg.subject, 'We received your title order request · BetterClose');
    for (const body of [msg.htmlBody, msg.textBody]) {
      assert.match(body, /still needs to open the file/);
      assert.match(body, /123 Example Lane/);
      assert.doesNotMatch(body, /just opened|Title order opened|Your title order is in|search is underway/);
      if (!role || role === 'unknown') assert.match(body, /We've received|We&#39;ve received/);
      if (role === 'broker') assert.match(body, /Your broker submitted/);
      if (role === 'realtor') assert.match(body, /Your real estate agent submitted/);
      if (role === 'lender') assert.match(body, /Your lender from Example Mortgage submitted/);
    }
    assert.deepEqual(contract(msg).links, [
      'https://betterclose.example.invalid/welcome?email=recipient%40example.invalid&closingId=synthetic-receipt',
    ]);
    assert.equal((msg.htmlBody.match(/data-bc-email=/g) || []).length, 1);
  });
}

test('Garden/ops dashboard welcome, including legacy queued payloads, never asserts a milestone', async () => {
  for (const purpose of [undefined, 'dashboard_ready']) {
    const { sent } = await capture({ ...cases[0], data: { ...cases[0].data, purpose } });
    assert.equal(sent[0].subject, 'Your BetterClose dashboard is ready');
    for (const body of [sent[0].htmlBody, sent[0].textBody]) {
      assert.match(body, /shared your title order details/);
      assert.match(body, /separate title-order update/);
      assert.doesNotMatch(body, /just opened|still needs to open|Title order opened/);
    }
  }
});

test('receipt context stays escaped, with the same recipient and exact file link', async () => {
  const { sent } = await capture({ ...cases[0], data: { ...cases[0].data,
    purpose: 'request_received', propertyAddress: '<script>synthetic</script>',
    placingParty: { role: 'lender', lenderCompany: '<img src=x>' } } });
  assert.equal(sent[0].to, cases[0].data.borrowerEmail);
  assert.match(sent[0].htmlBody, /&lt;script&gt;/);
  assert.match(sent[0].htmlBody, /&lt;img/);
  assert.doesNotMatch(sent[0].htmlBody, /<script|<img/);
});

test('intake helper sends one receipt, leaves milestones pending and does not call Garden', async () => {
  const writes = [];
  const h = createHarness({ mocks: {
    '@/lib/db': { prisma: { closing: { create: async ({ data }) => {
      writes.push(data); return { id: 'synthetic-new-request', ...data };
    } } } },
  } });
  const result = await h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder({
    borrowerEmail: 'borrower@example.invalid', propertyAddress: 'Synthetic Lane',
  }, { matchExisting: false, welcomePurpose: 'request_received', borrowerInitiated: true });
  assert.equal(result.closingId, 'synthetic-new-request');
  assert.equal(writes.length, 1);
  assert.equal(writes[0].gardenFileNumber, null);
  assert.equal(writes[0].milestones.create.length, 5);
  assert.ok(writes[0].milestones.create.every(m => m.status === undefined));
  assert.equal(h.sent.length, 1);
  assert.match(h.sent[0].subject, /received your title order request/);
  // Harness has no network capability and refuses unapproved dependencies.
});

test('only borrower public intake selects receipt mode; broker and ops do not opt borrowers in', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../src/app/api/orders/open/route.ts'), 'utf8');
  assert.match(source, /borrowerInitiated: d.role === 'borrower'/);
  const broker = fs.readFileSync(path.resolve(__dirname, '../src/app/api/broker/quotes/[id]/convert/route.ts'), 'utf8');
  assert.doesNotMatch(broker, /borrowerInitiated|welcomePurpose/);
  const admin = fs.readFileSync(path.resolve(__dirname, '../src/app/api/admin/closings/route.ts'), 'utf8');
  assert.doesNotMatch(admin, /welcomePurpose/);
});

test('real public route sends a receipt and separate ops handoff, not an opened-file update', async () => {
  const logs = [];
  const h = createHarness({ mocks: {
    'next/server': require('next/server'), zod: require('zod'),
    '@/lib/stateMaster': { stateOffered: () => true },
    '@/lib/db': { prisma: {
      closing: { create: async ({ data }) => ({ id: 'synthetic-public-receipt', ...data }) },
      user: { findUnique: async () => null },
      notificationLog: { create: async ({ data }) => { logs.push(data); return data; } },
    } },
  } });
  const route = h.load('src/app/api/orders/open/route.ts');
  const response = await route.POST(new Request('https://betterclose.example.invalid/api/orders/open', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ role: 'borrower', borrowerEmail: 'borrower@example.invalid',
      propertyAddress: '123 Synthetic Lane', propertyState: 'TX', propertyZip: '78701',
      transactionType: 'purchase', welcomePurpose: 'dashboard_ready' }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).closingId, 'synthetic-public-receipt');
  assert.equal(h.sent.length, 2);
  assert.equal(h.sent[0].to, 'borrower@example.invalid');
  assert.match(h.sent[0].subject, /received your title order request/);
  assert.equal(h.sent[1].to, 'orders@betterclose.co');
  assert.match(h.sent[1].textBody, /Garden Create New Order/);
  assert.equal(logs[0].kind, 'web:open-file:ops');
  assert.ok(h.sent.every(m => !/^Title ordered/.test(m.subject)));
});

test('caller-supplied intake data cannot turn a receipt into an opened-file email', async () => {
  const h = createHarness({ mocks: {
    '@/lib/db': { prisma: { closing: { create: async ({ data }) => ({ id: 'synthetic', ...data }) } } },
  } });
  await h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder({
    borrowerEmail: 'borrower@example.invalid', purpose: 'title_ordered', welcomePurpose: 'dashboard_ready',
  }, { matchExisting: false, welcomePurpose: 'request_received', borrowerInitiated: true });
  assert.equal(h.sent.length, 1);
  assert.match(h.sent[0].subject, /received your title order request/);
});

test('Pro-created request does not email the borrower, even with forged permission fields', async () => {
  const h = createHarness({ mocks: {
    '@/lib/db': { prisma: { closing: { create: async ({ data }) => ({ id: 'synthetic', ...data }) } } },
  } });
  const result = await h.load('src/lib/closing/createFromOrder.ts').createClosingFromOrder({
    borrowerEmail: 'borrower@example.invalid', borrowerInitiated: true, borrowerEmailsEnabled: true,
  }, { matchExisting: false });
  assert.equal(h.sent.length, 0);
  assert.equal(result.welcomeEmailedTo, null);
});
