const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const harness = () => createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

test('homepage savings copy is positive, at-closing, and uses plain-language location controls', () => {
  const h = harness();
  const Home = h.load('src/components/HomePageCredible.tsx').default;
  const html = h.render(React.createElement(Home, { heroVersion: 'magic' }));
  assert.match(text(html), /Save hundreds\./);
  assert.match(text(html), /In your area: National example Choose your state/);
  assert.doesNotMatch(text(html), /save thousands|📍|Auto-detected|[−-]\$[\d,]+ saved/i);
  const Provider = h.load('src/contexts/SavingsContext.tsx').SavingsProvider;
  const Team = h.load('src/components/TeamTrustSection.tsx').default;
  const team = text(h.render(React.createElement(Provider, null, React.createElement(Team))));
  const savings = h.load('src/lib/savingsCalculator.ts').getInitialSavings('purchase', 500000, '');
  assert.ok(team.includes(`$${savings.totalSavings.toLocaleString()} in estimated savings at closing.`));
  assert.doesNotMatch(team, /[−-]\$|over the life/);
});

for (const state of ['GA', 'TX', 'CA', 'RI']) {
  test(`${state}: sample retains all fees and exact totals, with detailed notes outside the card`, () => {
    const h = harness();
    const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport(state);
    const frozen = JSON.stringify(report);
    const { default: Table, FeeReportEstimateNotes: Notes } = h.load('src/components/FeeReportTable.tsx');
    const { computeTotals, formatCurrency, formatSavings } = h.load('src/lib/feeReport.ts');
    const totals = computeTotals(report);
    const preview = h.render(React.createElement(Table, { report, variant: 'preview' }));
    const full = h.render(React.createElement(Table, { report }));
    const notes = h.render(React.createElement(Notes, { report }));
    for (const item of report.lineItems) {
      // Decode React's apostrophe entity for the label comparison.
      assert.ok(text(preview).replace(/&#x27;/g, "'").includes(item.label), item.label);
      assert.ok(preview.includes(item.isCredit ? formatSavings(item.ourCost) : formatCurrency(item.ourCost)));
    }
    assert.ok(preview.includes(formatCurrency(totals.ourTotal)));
    assert.ok(preview.includes(formatCurrency(totals.estimatedSavings)));
    assert.doesNotMatch(preview, /competing service package/);
    assert.match(preview, /Save at closing/);
    assert.match(preview, /Save over the life of the loan/);
    assert.match(preview, /Loan-life total includes closing savings plus modeled interest avoided/);
    assert.ok(preview.includes(formatCurrency(totals.lifetimeSavings)));
    assert.match(preview, /Premiums and government fees are not discounted/);
    assert.match(full, /competing service package/);
    assert.match(full, /Save at closing/);
    assert.ok(full.includes(formatSavings(totals.estimatedSavings)));
    assert.match(notes, /<details[^>]*>/);
    assert.doesNotMatch(notes, /<details[^>]*\bopen/);
    assert.match(notes, /never counted toward savings/);
    assert.match(notes, /promotional credit from BetterClose, applied at closing/);
    if (totals.lifetimeSavings > 0) assert.match(notes, /6\.5% over 30 years/);
    assert.equal(JSON.stringify(report), frozen, 'Presentation must not mutate report data');
  });
}

test('legacy multi-line comparisons do not acquire an invented verified quote in moved notes', () => {
  const h = harness();
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport('GA');
  for (const item of report.lineItems.filter(item => item.typicalRange)) item.typicalRange.low = item.ourCost + 100;
  const Notes = h.load('src/components/FeeReportTable.tsx').FeeReportEstimateNotes;
  assert.doesNotMatch(h.render(React.createElement(Notes, { report })), /Compared against/);
});

test('positive savings labels never flip the sign of an actual fee credit', () => {
  const h = harness();
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport('TX');
  report.lineItems.push({ id: 'synthetic-credit', category: 'title-settlement', label: 'Test credit', ourCost: -100, isCredit: true, isFixed: false });
  const Table = h.load('src/components/FeeReportTable.tsx').default;
  const { computeTotals, formatCurrency } = h.load('src/lib/feeReport.ts');
  const preview = h.render(React.createElement(Table, { report, variant: 'preview' }));
  assert.match(preview, /−\$100/);
  assert.ok(preview.includes(formatCurrency(computeTotals(report).ourTotal)));
  assert.equal(report.lineItems.at(-1).ourCost, -100);
});

test('Georgia homepage sample includes the existing credit and both reconciling savings amounts', () => {
  const h = harness();
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport('GA');
  const { betterCloseBucksLine } = h.load('src/lib/betterCloseBucks.ts');
  const { computeTotals, lifetimeFinancedAmount } = h.load('src/lib/feeReport.ts');
  const credit = report.lineItems.filter(item => item.isCredit);
  assert.equal(credit.length, 1, 'The existing promotion is included once');
  assert.deepEqual(credit[0], betterCloseBucksLine(report.lineItems.filter(item => !item.isCredit), 'GA'));
  assert.equal(credit[0].ourCost, -114);
  const totals = computeTotals(report);
  assert.equal(totals.marketLow, 1383);
  assert.equal(totals.ourTotal, 1269);
  assert.equal(totals.marketLow - totals.ourTotal, totals.estimatedSavings);
  assert.equal(totals.estimatedSavings, 114);
  assert.equal(totals.lifetimeSavings, 259);
  assert.equal(totals.lifetimeSavings, lifetimeFinancedAmount(114));
  assert.equal(totals.breakdown.title_related, 0, 'Premium itself is not discounted');
  assert.equal(totals.serviceStack.savings, 0, 'No service-price advantage is fabricated');
  const Section = h.load('src/components/FeeReportPreviewSection.tsx').default;
  const html = h.render(React.createElement(Section));
  assert.match(html, /data-preview-closing-savings[^]*?\$114/);
  assert.match(html, /data-preview-lifetime-savings[^]*?\$259/);
  assert.doesNotMatch(html, /better loan pricing/);
});

test('marketing samples obey existing state credit gates, including exclusions and overrides', () => {
  const h = harness();
  const { buildSampleFeeReport } = h.load('src/lib/sampleReport.ts');
  for (const state of ['FL', 'TX', 'NM', 'NY']) {
    assert.equal(buildSampleFeeReport(state).lineItems.some(item => item.isCredit), false, state);
  }
  assert.equal(buildSampleFeeReport('RI').lineItems.find(item => item.isCredit).ourCost, -152);
});

test('zero-savings reports remain zero: presentation never manufactures an advantage', () => {
  const h = harness();
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport('GA');
  report.lineItems = report.lineItems.filter(item => !item.isCredit);
  const { computeTotals } = h.load('src/lib/feeReport.ts');
  assert.equal(computeTotals(report).estimatedSavings, 0);
  assert.equal(computeTotals(report).lifetimeSavings, 0);
  const Table = h.load('src/components/FeeReportTable.tsx').default;
  const html = h.render(React.createElement(Table, { report, variant: 'preview' }));
  assert.match(html, /data-preview-closing-savings[^]*?\$0/);
  assert.match(html, /data-preview-lifetime-savings[^]*?\$0/);
  assert.doesNotMatch(html, /\$114|\$259/);
});
