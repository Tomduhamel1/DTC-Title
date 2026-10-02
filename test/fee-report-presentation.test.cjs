const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('No database access in presentation tests'); } });

function fixture(overrides = {}) {
  return {
    state: 'TX', zip: '75201', homeValue: 0, loanAmount: 400000,
    transactionType: 'refinance', generatedAt: '2026-09-30T12:00:00Z',
    lineItems: [{ id: 'settlement', category: 'title-settlement', label: 'Settlement fee', ourCost: 500, isFixed: false }],
    ...overrides,
  };
}

function render(report, props = {}) {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/components/FeeReportTable.tsx').default, { report, ...props }));
  assert.equal(h.sent.length, 0);
  return html;
}

test('refinance heading identifies the loan amount, never the zero purchase field', () => {
  const html = render(fixture());
  assert.match(html, /Refinance · TX · Loan amount \$400,000/);
  assert.doesNotMatch(html, /Refinance · TX · \$0|Purchase price/);
});

test('refinance uses the loan even when a property value is also present', () => {
  const html = render(fixture({ homeValue: 500000 }));
  assert.match(html, /Loan amount \$400,000/);
  assert.doesNotMatch(html, /\$500,000/);
});

test('purchase heading identifies purchase price rather than the loan', () => {
  const html = render(fixture({ transactionType: 'purchase', homeValue: 500000 }));
  assert.match(html, /Purchase · TX · Purchase price \$500,000/);
  assert.doesNotMatch(html, /Loan amount \$400,000/);
});

for (const value of [undefined, null, 0, -1, NaN, Infinity, '400000']) {
  test(`missing or invalid refinance loan ${String(value)} stays unavailable`, () => {
    const html = render(fixture({ homeValue: 500000, loanAmount: value }));
    assert.match(html, /Refinance · TX · Loan amount unavailable/);
    assert.doesNotMatch(html, /Loan amount \$|\$500,000/);
  });
}

test('missing purchase price stays unavailable and does not use the loan', () => {
  assert.match(render(fixture({ transactionType: 'purchase', homeValue: 0 })), /Purchase price unavailable/);
});

test('amount presentation does not mutate saved quotes or recalculate frozen totals', () => {
  const h = createHarness(noDb);
  const { computeTotals } = h.load('src/lib/feeReport.ts');
  const original = fixture();
  original.frozenTotals = { ...computeTotals(original), ourTotal: 1234, estimatedSavings: 75 };
  const before = structuredClone(original);
  Object.freeze(original.frozenTotals);
  Object.freeze(original);
  const html = render(original);
  assert.match(html, /Loan amount \$400,000/);
  assert.match(html, /\$1,234/);
  assert.deepEqual(original, before);
  assert.deepEqual(computeTotals(original), before.frozenTotals);
});

test('embedded preview still omits the built-in transaction heading', () => {
  const html = render(fixture(), { variant: 'preview' });
  assert.doesNotMatch(html, /Loan amount|Refinance · TX|Closing fees/);
});
