const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

const h = createHarness(new Proxy({}, { get() { throw new Error('No database access in marketing tests'); } }));
const page = h.load('src/app/for-lenders/page.tsx');
const html = h.render(React.createElement(page.default));
const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
const hero = main.slice(0, main.indexOf('</section>'));

test('lender page leads with borrower savings tailored to the lending team', () => {
  assert.match(hero, /Give your borrowers lower closing costs/);
  assert.match(hero, /Make your loan offer stand out/);
  assert.match(hero, /alongside your\s+financing/);
  assert.match(hero, /Example borrower savings/);
  assert.match(hero, /Save at closing/);
  assert.match(hero, /Save over the loan/);
  assert.doesNotMatch(hero, /Encompass/);
  assert.match(hero, /Get estimate/);
  assert.match(hero, /href="#place-an-order"/);
  assert.match(main, /id="place-an-order"/);
  assert.match(main, /You don’t need a BetterClose account to send an order/);
  assert.match(main, /Encompass integration/);
  assert.match(main, /one-touch title ordering and document exchange through Encompass/);
  assert.match(page.metadata.description, /Encompass/);
  assert.match(page.metadata.description, /borrowers lower title and settlement costs/);
  assert.ok(main.indexOf('Lower costs for your borrower') < main.indexOf('Ordering &amp; integrations'));
});

test('lender savings and cost comparison use the same national example as broker and agent pages', () => {
  const { estimateSavings, estimateCostBasis } = h.load('src/lib/stateSavings.ts');
  const { formatCurrency, LIFETIME_RATE_PCT, LIFETIME_TERM_YEARS } = h.load('src/lib/feeReport.ts');
  const savings = estimateSavings(500000, 'purchase', null);
  const basis = estimateCostBasis(500000, 'purchase', null);
  const value = id => hero.match(new RegExp('data-testid="' + id + '"[^>]*>([^<]+)<'))?.[1];
  assert.equal(value('savings-at-closing'), '−' + formatCurrency(savings.saveAtClosing));
  assert.equal(value('savings-over-loan'), '−' + formatCurrency(savings.saveOverLoan));
  assert.equal(value('betterclose-estimate'), formatCurrency(basis.ourTotal));
  assert.equal(value('comparison-estimate'), formatCurrency(basis.typicalTotal));
  assert.equal(basis.typicalTotal - basis.ourTotal, savings.saveAtClosing);
  for (const audience of ['brokers', 'realtors']) {
    const reference = h.render(React.createElement(h.load(`src/app/for-${audience}/page.tsx`).default));
    for (const amount of [savings.saveAtClosing, savings.saveOverLoan, basis.ourTotal, basis.typicalTotal]) assert.ok(reference.includes(formatCurrency(amount)), audience + ': same shared example');
  }
  // React's static markup inserts comments around adjacent dynamic text.
  const text = hero.replace(/<[^>]*>/g, '');
  assert.match(text, /Illustrative \$500,000 purchase, not a quote or guarantee/);
  assert.match(text, /national example/);
  assert.ok(text.includes(`at ${LIFETIME_RATE_PCT}% over ${LIFETIME_TERM_YEARS} years`));
  assert.match(text, /include the at-closing savings plus modeled interest avoided/);
  assert.match(text, /Not additional cash at closing or a change to your loan rate/);
  assert.doesNotMatch(text, /Typical rates in this area/);
});

test('savings explanation separates pass-through costs and does not promise every borrower savings', () => {
  assert.match(main, /Where your borrower saves/);
  assert.match(main, /Title insurance premiums, government fees, recording charges and transfer taxes/);
  assert.match(main, /not every borrower will save the same amount/);
  assert.match(main, /If we’re lower/);
  assert.match(main, /First American Financial/);
  assert.match(main, /AmTrust Title/);
});

test('unsupported API products, discounts and operational guarantees are not advertised', () => {
  assert.doesNotMatch(main, /API-first|Quick Quote API|Advanced Quote API|TPS integration|api@betterclose|\/api\/quote\/quick|Request API Access|API Documentation|Developer Portal|webhook|volume discount|bulk pricing|compliance reporting|technical account managers|in minutes|SmartFees|Qualia|ResWare/i);
  assert.doesNotMatch(hero, /\bAPI\b/i);
  assert.doesNotMatch(main, /<pre\b|<form\b/);
});

test('API is visible alongside other workflow options, not buried in the footer or sold as live access', () => {
  const workflow = main.match(/<section id="place-an-order"[\s\S]*?<\/section>/)[0];
  assert.match(workflow, /<h3[^>]*>Custom lender APIs<\/h3>/);
  assert.match(workflow, /Encompass integration/);
  assert.match(workflow, /Email your title order/);
  assert.ok(main.indexOf('Custom lender APIs') < main.indexOf('closing-path-heading'));
  assert.match(workflow, /discuss building a custom API/);
  assert.match(workflow, /Scope, security requirements and availability would be agreed before development/);
  assert.match(workflow, /not an existing self-service API/);
  const inquiry = [...main.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(href => href.startsWith('mailto:partners@'));
  assert.equal(inquiry.length, 1);
  assert.equal(new URL(inquiry[0]).searchParams.get('subject'), 'Custom lender integration inquiry');
});

test('quote, file access, company phone and order actions point to existing destinations', () => {
  assert.match(main, /href="\/quote\?source=broker"/);
  assert.match(main, /href="\/login\?callbackUrl=\/teammate\/dashboard"/);
  assert.match(main, /href="tel:\+18883780745"/);
  assert.match(main, /Call 888-378-0745/);
  const mailtos = [...main.matchAll(/href="(mailto:[^"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&')));
  const order = mailtos.find(url => url.searchParams.get('subject') === 'New title order');
  assert.equal(order.pathname, 'orders@betterclose.co');
  for (const field of ['Borrower(s):', 'Property address:', 'Loan amount:', 'Lender / loan officer name:']) assert.ok(order.searchParams.get('body').includes(field), field);
  assert.ok(mailtos.some(url => url.pathname === 'orders@betterclose.co' && url.searchParams.get('subject').includes('Encompass')));
  for (const route of ['quote', 'login', 'teammate/dashboard']) assert.ok(fs.existsSync(path.resolve(__dirname, '../src/app', route, 'page.tsx')), route);
});

test('page has semantic landmarks and responsive layout without a new service dependency', () => {
  assert.equal((main.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.match(main, /<ol\b/);
  assert.match(main, /lg:grid-cols-2/);
  assert.match(main, /md:grid-cols-3/);
  assert.match(main, /flex flex-col sm:flex-row sm:items-center gap-4/);
  assert.equal(h.sent.length, 0);
});

test('lender page uses the same real-people progress section as the agent page and homepage', () => {
  // React may hoist image preload links ahead of the actual section.
  const shared = h.render(React.createElement(h.load('src/components/DashboardTrustSection.tsx').default)).match(/<section\b[\s\S]*<\/section>/)[0];
  assert.ok(main.includes(shared), 'Reuse the complete shared section, not a separate imitation');
  assert.match(shared, /Real people\./);
  assert.match(shared, /Real-time progress\./);
  assert.match(shared, />Nicole</);
  assert.match(shared, /2 of 4 milestones complete/);
  assert.doesNotMatch(shared, /loan lock/i);
  for (const file of ['src/app/for-realtors/page.tsx', 'src/components/HomePageCredible.tsx']) {
    assert.match(fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8'), /<DashboardTrustSection\s*\/>/);
  }
});

test('lender presentation matches established broker and realtor design patterns', () => {
  const broker = fs.readFileSync(path.resolve(__dirname, '../src/app/for-brokers/page.tsx'), 'utf8');
  const realtor = fs.readFileSync(path.resolve(__dirname, '../src/app/for-realtors/page.tsx'), 'utf8');
  const classes = [
    'py-20 bg-gradient-to-br from-primary-50 to-white',
    'container mx-auto px-4 max-w-6xl',
    'grid lg:grid-cols-2 gap-12 items-center',
    'inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-bold mb-4',
    'text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight',
    'text-lg text-gray-700 mb-8 leading-relaxed',
    'inline-flex items-center justify-center gap-2 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg',
    'bg-white rounded-2xl shadow-2xl p-7 border border-gray-200',
    'text-center mb-12',
  ];
  for (const value of classes) {
    assert.ok(broker.includes('className="' + value + '"'), 'Broker design reference: ' + value);
    assert.ok(realtor.includes('className="' + value + '"'), 'Realtor design reference: ' + value);
    assert.ok(main.includes('class="' + value + '"'), 'Lender design parity: ' + value);
  }
  const orderTile = 'bg-white rounded-2xl border border-gray-200 shadow-sm p-6';
  assert.ok(broker.includes('className="' + orderTile + '"'));
  assert.ok(main.includes('class="' + orderTile + '"'));
  assert.doesNotMatch(hero, /from-emerald-50|via-white|lg:text-6xl|bg-dark-900|tracking-tight/);
  assert.match(hero, /<span class="text-primary-600">Make your loan offer stand out/);
  const savingsTile = 'rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center';
  for (const reference of [broker, realtor]) assert.ok(reference.includes('className="' + savingsTile + '"'));
  assert.ok(hero.includes('class="' + savingsTile + '"'));
});
