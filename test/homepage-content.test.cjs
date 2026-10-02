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
  const savings = h.load('src/lib/savingsCalculator.ts').getInitialSavings('purchase', 500000, 'Texas');
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
      assert.ok(preview.includes(formatCurrency(item.ourCost)));
    }
    assert.ok(preview.includes(formatCurrency(totals.ourTotal)));
    assert.ok(preview.includes(formatCurrency(totals.estimatedSavings)));
    assert.doesNotMatch(preview, /[−-]\$|Save over the loan|competing service package/);
    assert.match(preview, /Savings exclude title insurance, recording fees and taxes/);
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
