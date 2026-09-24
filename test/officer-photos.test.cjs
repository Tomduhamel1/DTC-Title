const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

const photos = [
  ['Kristen Deyton', 'kdeyton@firstnte.com', 'kristen-deyton-ec0e43a7.jpg', 'ec0e43a777874a976ddfbb4224347c4d4a2cf1ac1bf70c583b00099b060e2de1'],
  ['Steve Patti', 'steve@firstnte.com', 'steve-patti-7e73be41.jpg', '7e73be4193cf6edbc59c38daf0360313278d54b29f591536f80e4bd23c212839'],
  ['Nicole Micciche', 'nmicciche@firstnte.com', 'nicole-micciche-af371149.jpg', 'af371149d22438d4f8b748fc8f07f55056665b817f2845a719630556632445fc'],
];
const url = file => 'https://betterclose.co/images/escrow-officers/' + file;
const emptyDb = new Proxy({}, { get() { throw new Error('Database access forbidden'); } });
const h = createHarness(emptyDb);
const resolve = h.load('src/lib/closing/officerPhoto.ts').officerPhotoUrl;

for (const [name, email, file, hash] of photos) test(`approved original and exact identity: ${name}`, () => {
  const bytes = fs.readFileSync(path.join(__dirname, '../public/images/escrow-officers', file));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'Original JPEG, not HTML or placeholder');
  for (const stored of [null, undefined, '', '  ']) {
    const input = Object.freeze({ escrowOfficerEmail: ' ' + email.toUpperCase() + ' ', escrowOfficerPhotoUrl: stored });
    assert.equal(resolve(input), url(file));
    assert.equal(input.escrowOfficerPhotoUrl, stored, 'Read resolution must not write back');
  }
});

test('no name, partial-address, prototype, or unrelated-contact matching', () => {
  for (const email of [null, '', 'constructor', '__proto__', 'kdeyton@other.invalid', 'kdeyton+other@firstnte.com', 'otherkdeyton@firstnte.com']) {
    assert.equal(resolve({ escrowOfficerName: 'Kristen Deyton', escrowOfficerEmail: email,
      borrowerEmail: photos[0][1], lenderEmail: photos[0][1] }), null);
  }
});

test('explicit per-file overrides survive; changing assigned email changes only the fallback photo', () => {
  const explicit = 'https://images.example.invalid/custom.jpg';
  for (const email of [photos[0][1], 'other@example.invalid', null]) {
    assert.equal(resolve({ escrowOfficerEmail: email, escrowOfficerPhotoUrl: explicit }), explicit);
  }
  assert.notEqual(resolve({ escrowOfficerEmail: photos[0][1] }), resolve({ escrowOfficerEmail: photos[1][1] }));
  assert.equal(resolve({ escrowOfficerEmail: 'unmapped@example.invalid' }), null);
});

test('a photo does not attest a mailbox, enable borrower notices or bypass invalid explicit-photo rejection', () => {
  const input = { escrowOfficerName: photos[0][0], escrowOfficerEmail: photos[0][1],
    escrowOfficerPhotoUrl: null, escrowOfficerPhone: null, escrowOfficerTitle: null };
  const policy = h.load('src/lib/closing/notificationPolicy.ts');
  const result = policy.officerConfiguration(input);
  assert.equal(result.officer, null);
  assert.deepEqual(result.issues, ['Configure the EO BetterClose reply address after verifying its mailbox or forwarding.']);
  assert.equal(policy.borrowerMayReceive({ ...input, borrowerEmail: 'borrower@example.invalid' }, 'borrower@example.invalid'), false);
  h.env.BC_EO_REPLY_ROUTES = JSON.stringify({ [photos[0][1]]: 'synthetic-reply@betterclose.co' });
  assert.equal(policy.verifiedOfficer(input).photoUrl, url(photos[0][2]));
  for (const photo of ['http://example.invalid/unsafe.jpg', 'javascript:alert(1)', 'https://user:password@example.invalid/a.jpg']) {
    assert.equal(policy.verifiedOfficer({ ...input, escrowOfficerPhotoUrl: photo }), null);
  }
  assert.equal(h.sent.length, 0);
  delete h.env.BC_EO_REPLY_ROUTES;
});

function pageHarness(photo) {
  const actor = { id: 'synthetic-owner', email: 'owner@example.invalid', name: 'Synthetic Owner' };
  const c = Object.freeze({ id: 'synthetic-closing', userId: actor.id, borrowerEmail: actor.email,
    gardenFileNumber: 'SYNTHETIC-001', propertyAddress: '123 Synthetic Lane', status: 'active',
    escrowOfficerName: photo[0], escrowOfficerEmail: photo[1], escrowOfficerPhotoUrl: null,
    escrowOfficerPhone: null, escrowOfficerTitle: null, escrowOfficerNmls: null,
    milestones: [], teammates: [], updatedAt: new Date('2026-09-24T00:00:00Z') });
  const readOnly = methods => new Proxy(methods, { get(object, key) {
    if (!Object.hasOwn(object, key)) throw new Error('Unexpected database method: ' + String(key));
    return object[key];
  } });
  const db = readOnly({
    closing: readOnly({
      findFirst: async ({ where }) => where.userId === actor.id && (!where.id || where.id === c.id) ? c : null,
      findMany: async ({ where }) => { assert.equal(where.userId, actor.id); return [c]; },
      findUnique: async ({ where }) => where.id === c.id ? c : null,
    }),
    brokerMembership: readOnly({ findFirst: async () => null }),
    teammateClosing: readOnly({ count: async () => 1,
      findFirst: async ({ where }) => where.userId === actor.id && where.closingId === c.id
        ? { id: 'synthetic-membership', closing: c, muted: false, mayManageBorrowerEmails: false } : null }),
    lenderRequest: readOnly({ findFirst: async () => null }),
    user: readOnly({ findUnique: async () => ({ ...actor, accountType: 'professional', brokerMemberships: [] }) }),
    ingestDelivery: readOnly({ groupBy: async () => [] }),
  });
  const harness = createHarness(db); harness.setActor(actor);
  return { harness, c, actor };
}

for (const photo of photos) test(`actual borrower/pro pages and TPS read agree for ${photo[0]}, without writes or sends`, async () => {
  const { harness: p, c } = pageHarness(photo);
  const borrower = p.load('src/app/dashboard/page.tsx').default;
  for (const variant of [undefined, 'unified']) {
    const html = p.render(await borrower({ searchParams: Promise.resolve({ closingId: c.id, variant }) }));
    assert.ok(html.includes('src="' + url(photo[2]) + '"'));
    assert.ok(html.includes('alt="' + photo[0] + '"'));
  }
  const pro = p.load('src/app/teammate/dashboard/[closingId]/page.tsx').default;
  assert.ok(p.render(await pro({ params: Promise.resolve({ closingId: c.id }) })).includes('src="' + url(photo[2]) + '"'));
  const get = p.load('src/app/api/tps/closings/[id]/route.ts').GET;
  const request = token => new Request('https://local.invalid/read', { headers: { authorization: 'Bearer ' + token } });
  assert.equal((await get(request('wrong'), { params: Promise.resolve({ id: c.id }) })).status, 401);
  const result = await (await get(request('synthetic-only'), { params: Promise.resolve({ id: c.id }) })).json();
  assert.equal(result.closing.escrowOfficer.photoUrl, url(photo[2]));
  assert.equal(result.closing.notificationReadiness.eoIntroduction.configurationReady, false, 'Photo alone cannot open email gate');
  assert.equal(result.closing.notificationReadiness.borrowerUpdatesEnabled, false);
  assert.equal(result.closing.notificationReadiness.deliveryVerified, false);
  assert.equal(c.escrowOfficerPhotoUrl, null);
  assert.equal(p.sent.length, 0);
  p.setActor(null);
  await assert.rejects(borrower({ searchParams: Promise.resolve({ closingId: c.id }) }), /REDIRECT:\/login/);
  await assert.rejects(pro({ params: Promise.resolve({ closingId: c.id }) }), /REDIRECT:\/login/);
  p.setActor({ id: 'other-user', email: 'other@example.invalid' });
  await assert.rejects(borrower({ searchParams: Promise.resolve({ closingId: c.id }) }), /NOT_FOUND/);
  await assert.rejects(pro({ params: Promise.resolve({ closingId: c.id }) }), /NOT_FOUND/);
});

test('approved static images remain reachable through the coming-soon gate without ungating marketing pages', () => {
  const middleware = h.load('src/middleware.ts').middleware;
  h.env.COMING_SOON_MODE = 'true';
  for (const [, , file] of photos) {
    const nextUrl = new URL(url(file)); nextUrl.clone = () => new URL(nextUrl);
    const response = middleware({ nextUrl, cookies: { get: () => undefined } });
    assert.equal(response.headers.get('x-middleware-next'), '1');
  }
  for (const pathname of ['/', '/licenses', '/for-lenders']) {
    const nextUrl = new URL(pathname, 'https://betterclose.co'); nextUrl.clone = () => new URL(nextUrl);
    assert.equal(new URL(middleware({ nextUrl, cookies: { get: () => undefined } }).headers.get('x-middleware-rewrite')).pathname, '/coming-soon');
  }
  delete h.env.COMING_SOON_MODE;
});
