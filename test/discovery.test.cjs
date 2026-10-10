const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const harness = () => createHarness(new Proxy({}, { get() { throw new Error('Database forbidden'); } }));

test('sitemap includes only indexable public pages and the gate suppresses discovery', () => {
  const h = harness();
  const sitemap = h.load('src/app/sitemap.ts').default;
  const robots = h.load('src/app/robots.ts').default;
  const urls = sitemap().map(entry => new URL(entry.url));
  assert.equal(new Set(urls.map(url => url.href)).size, urls.length);
  for (const url of urls) {
    assert.equal(url.origin, 'https://betterclose.co');
    assert.equal(url.search, '');
    assert.ok(fs.existsSync(path.join(__dirname, '../src/app', url.pathname, 'page.tsx')));
    assert.doesNotMatch(url.pathname, /^\/(api|admin|login|dashboard|settings|teammate|file-access|resume|open|preview|for-my-team)(\/|$)/);
    assert.ok(!url.pathname.startsWith('/quote/'));
    assert.ok(!robots().rules.disallow.some(prefix => url.pathname.startsWith(prefix)));
  }
  assert.ok(urls.some(url => url.pathname === '/compare-title-fees'));
  assert.ok(urls.some(url => url.pathname === '/guides/keep-your-realtor-and-lender'));
  assert.equal(robots().sitemap, 'https://betterclose.co/sitemap.xml');
  h.env.COMING_SOON_MODE = 'true';
  assert.deepEqual(sitemap(), []);
  assert.deepEqual(robots(), { rules: { userAgent: '*', disallow: '/' } });
});

test('public metadata uses the exact page URL and organization schema avoids unsupported coverage and ratings', () => {
  const h = harness();
  const { publicMetadata, organizationData } = h.load('src/lib/publicMetadata.ts');
  const metadata = publicMetadata('/compare-title-fees', 'Compare fees', 'Compare equivalent quotes.');
  assert.equal(metadata.alternates.canonical, 'https://betterclose.co/compare-title-fees');
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.twitter.title, metadata.title);
  assert.equal(organizationData.legalName, 'First National Title & Escrow LLC');
  for (const key of ['aggregateRating', 'review', 'areaServed', 'sameAs']) assert.equal(organizationData[key], undefined);
});

test('quote entry preserves borrower and broker selection through the server page', () => {
  for (const source of [null, 'broker', 'realtor']) {
    const client = { exports: {} };
    const file = path.join(__dirname, '../src/components/quote/QuoteEntry.tsx');
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const deps = {
      react: React, 'react/jsx-runtime': require('react/jsx-runtime'),
      'next/navigation': { useSearchParams: () => new URLSearchParams(source ? { source } : {}) },
      '@/components/quote/BorrowerQuoteForm': () => React.createElement('p', null, 'Borrower form'),
      '@/components/quote/BrokerEstimateForm': () => React.createElement('p', null, 'Broker form'),
    };
    new Function('require', 'module', 'exports', code)(key => {
      if (!(key in deps)) throw new Error('Unapproved dependency: ' + key);
      return deps[key];
    }, client, client.exports);
    const html = require('react-dom/server').renderToStaticMarkup(React.createElement(client.exports.default));
    assert.match(html, new RegExp(source === 'broker' ? 'Broker form' : 'Borrower form'));
    assert.doesNotMatch(html, new RegExp(source === 'broker' ? 'Borrower form' : 'Broker form'));
  }
});

test('discovery guides render their complete content and links without client-side data or network', () => {
  const h = harness();
  for (const route of ['compare-title-fees', 'guides/keep-your-realtor-and-lender', 'pricing-methodology', 'closing-comparison-kit']) {
    const page = h.load(`src/app/${route}/page.tsx`);
    const html = h.render(React.createElement(page.default));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /href="\/quote"/);
    if (['compare-title-fees', 'guides/keep-your-realtor-and-lender'].includes(route)) assert.match(html, /consumerfinance.gov/);
    assert.doesNotMatch(html, /<input|<form|guaranteed savings|licensed nationwide/i);
    assert.equal(page.metadata.alternates.canonical, 'https://betterclose.co/' + route);
  }
  assert.equal(h.sent.length, 0);
});


test('estimate explanation exposes financing and location assumptions without creating another form', () => {
  const h = harness();
  const html = h.render(React.createElement(h.load('src/components/quote/EstimateExplanation.tsx').default));
  assert.match(html, /80%/);
  assert.match(html, /representative ZIP/);
  assert.match(html, /not a final bill or your full cash to close/);
  assert.doesNotMatch(html, /<form|<input/);
  assert.match(html, /href="\/pricing-methodology"/);
});

test('methodology separates modeled savings, credit and loan-life totals, and the kit download exists', () => {
  const h = harness();
  const html = h.render(React.createElement(h.load('src/app/pricing-methodology/page.tsx').default));
  const amounts = h.load('src/lib/stateSavings.ts').estimateSavings(500000, 'purchase', null);
  for (const amount of [amounts.saveAtClosing, amounts.saveOverLoan]) assert.ok(html.includes('$' + amount));
  assert.match(html, /inferred range is not a survey/);
  assert.match(html, /must not be added together/);
  assert.match(html, /minimum of zero/);
  const kit = h.render(React.createElement(h.load('src/app/closing-comparison-kit/page.tsx').default));
  assert.match(kit, /href="\/pdfs\/betterclose-closing-comparison-guide.pdf"/);
  assert.equal(fs.readFileSync(path.join(__dirname, '../public/pdfs/betterclose-closing-comparison-guide.pdf')).subarray(0,5).toString(), '%PDF-');
});
