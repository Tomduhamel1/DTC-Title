const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('No database access in public launch tests'); } });

test('licensing contact page contains no placeholder numbers or unconfirmed state claims', () => {
  const h = createHarness(noDb);
  const page = h.load('src/app/licenses/page.tsx');
  const html = h.render(React.createElement(page.default));
  assert.match(html, /Contact us for licensing information/);
  assert.match(html, /mailto:contact@betterclose.co\?subject=Licensing%20information/);
  assert.match(html, /href="tel:\+18883780745"/);
  assert.match(html, /888-378-0745/);
  assert.match(html, /state where the property is located/);
  assert.doesNotMatch(html + JSON.stringify(page.metadata), /\[number\]|Lic #|directly licensed|all 50|workshare|California|Texas/i);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal(h.sent.length, 0);
});

test('shared footer links describe the licensing contact page without an unconfirmed state list', () => {
  const h = createHarness(noDb);
  const footer = h.render(React.createElement(h.load('src/components/FooterComprehensive.tsx').default));
  assert.match(footer, /Licensing Information/);
  assert.match(footer, /Request licensing information/);
  assert.match(footer, /href="\/licenses"/);
  assert.doesNotMatch(footer, /See all state licenses|Directly licensed in 34|remaining 16|workshare partners/i);
});

test('marketing switch opens public routes and can still restore the Coming Soon gate', () => {
  const h = createHarness(noDb);
  const middleware = h.load('src/middleware.ts').middleware;
  for (const mode of ['false', 'true']) {
    h.env.COMING_SOON_MODE = mode;
    for (const pathname of ['/', '/licenses', '/for-lenders', '/how-it-works', '/security']) {
      const nextUrl = new URL(pathname, 'https://betterclose.example.invalid');
      nextUrl.clone = () => new URL(nextUrl);
      const response = middleware({ nextUrl, cookies: { get: () => undefined } });
      if (mode === 'false') {
        assert.equal(response.headers.get('x-middleware-next'), '1');
        assert.equal(response.headers.get('x-middleware-rewrite'), null);
        assert.equal(response.headers.get('set-cookie'), null);
      } else {
        assert.equal(new URL(response.headers.get('x-middleware-rewrite')).pathname, '/coming-soon');
      }
    }
  }
});

test('old Coming Soon URL redirects home only after the marketing gate is off', () => {
  const h = createHarness(noDb);
  const page = h.load('src/app/coming-soon/page.tsx').default;
  h.env.COMING_SOON_MODE = 'true';
  assert.match(h.render(React.createElement(page)), /BetterClose is launching soon/);
  h.env.COMING_SOON_MODE = 'false';
  assert.throws(() => page(), /^Error: REDIRECT:\/$/);
});

test('turning marketing live does not enable California quotes or anonymous private-file access', async () => {
  const h = createHarness(noDb, { env: { COMING_SOON_MODE: 'false' } });
  const availability = h.load('src/lib/stateMaster.ts');
  assert.equal(availability.stateOffered('CA', 'purchase'), false);
  assert.equal(availability.stateOffered('CA', 'refinance'), false);
  assert.equal(availability.stateOffered('TX', 'purchase'), true);
  for (const file of ['src/app/dashboard/page.tsx', 'src/app/teammate/dashboard/[closingId]/page.tsx']) {
    const page = h.load(file).default;
    await assert.rejects(page({ searchParams: Promise.resolve({}), params: Promise.resolve({ closingId: 'synthetic-only' }) }), /REDIRECT:\/login/);
  }
  assert.equal(h.sent.length, 0);
});
