const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const fixture = require('./fixtures/purchase-sample-ri-20261020.json');
const noDb = new Proxy({}, { get() { throw new Error('No customer database in pricing tests'); } });

function setup(response = fixture.response) {
  let h;
  h = createHarness(noDb, {
    fetch: async () => ({ ok: true, json: async () => structuredClone(response) }),
    estimate: req => h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(req),
  });
  return h;
}

test('public purchase search uses the approved RI service fees and an unchanged competitor package', async () => {
  const h = setup();
  const result = await h.load('src/app/api/fee-estimate/route.ts').POST(new Request('https://example.invalid/api/fee-estimate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionType: 'purchase', zip: '02903', homeValue: 600000 }),
  }));
  assert.equal(result.status, 200);
  const { report } = await result.json();
  assert.equal(report.loanAmount, 480000, 'Existing 80% LTV default');
  for (const [label, amount] of [['Notary Fee', 140], ['Attorney Fee', 40], ['Abstractor Title Search', 90]]) {
    const rows = report.lineItems.filter(item => item.label === label);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].ourCost, amount);
  }
  const totals = h.load('src/lib/feeReport.ts').computeTotals(report);
  assert.equal(totals.ourTotal, 2475);
  assert.equal(totals.estimatedSavings, 600);
  assert.deepEqual(totals.serviceStack, { ourTotal: 520, typicalLow: 690, typicalHigh: 770, savings: 170, comparableCount: 4 });
  assert.equal(h.sent.length, 0);
});

test('refinance search uses $90 whether the abstractor row is returned or restored from an upstream gap', async () => {
  for (const returned of [true, false]) {
    const response = structuredClone(fixture.response);
    response.rateCalcGuideResponse = response.rateCalcGuideResponse.filter(row =>
      !/Owner's Title Insurance/.test(row.FeeDescription) && (returned || !/Abstractor Title Search/.test(row.FeeDescription)));
    const h = setup(response);
    const report = await h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate({ ...fixture.capture.input, transactionType: 'refinance', homeValue: 0 });
    const rows = report.lineItems.filter(item => item.label === 'Abstractor Title Search');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].ourCost, 90);
    assert.equal(h.load('src/lib/feeReport.ts').computeTotals(report).serviceStack.savings, 170);
    const credits = report.lineItems.filter(item => item.isCredit);
    assert.equal(credits.length, 1);
    assert.equal(credits[0].ourCost, -240, 'Credit remains 20% of lender premium only on this synthetic refinance');
  }
});

test('state-scoped fees do not override other states, missing services, premiums, CPL or government charges', async () => {
  const h = setup();
  const fees = h.load('src/lib/betterCloseFees.ts');
  for (const state of ['TX', 'FL', 'MA', undefined]) {
    for (const label of ['Notary Fee', 'Attorney Fee', 'Abstractor Title Search']) {
      assert.equal(fees.betterCloseServiceFee(label, state, 'purchase'), undefined);
    }
  }
  assert.equal(fees.betterCloseServiceFee('notary fee', 'ri', 'refinance'), 140);
  assert.equal(fees.ensuredLinesFor('MA', 'refinance')[0].amount, 300);
  assert.equal(fees.ENSURE_LINES.RI.refinance[0].amount, 100, 'Original upstream gap evidence stays intact');
  const report = await h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(fixture.capture.input);
  for (const [label, amount] of [["Owner's Title Insurance", 950], ["Lender's Title Insurance", 1200], ['Closing Protection Letter', 35], ['Conveyance Deed - Recording Fee', 87], ['Mortgage (Deed of Trust) - Recording Fee', 88], ['Recording Service Fee', 25]]) {
    assert.equal(report.lineItems.find(row => row.label === label).ourCost, amount, label);
  }
  assert.ok(!report.lineItems.some(row => /Stamp Tax/.test(row.label)), 'Seller-only transfer tax is not moved to buyer');
  const missing = structuredClone(fixture.response);
  missing.rateCalcGuideResponse = missing.rateCalcGuideResponse.filter(row => !/Notary|Attorney/.test(row.FeeDescription));
  const m = setup(missing);
  const without = await m.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(fixture.capture.input);
  assert.ok(!without.lineItems.some(row => /Notary|Attorney/.test(row.label)), 'No new services are invented');
});

test('Bucks groups last in Title & Settlement without repricing or mutating issued reports', () => {
  const h = setup();
  const { groupByCategory, computeTotals } = h.load('src/lib/feeReport.ts');
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport();
  const credit = report.lineItems.find(item => item.isCredit);
  credit.category = 'other'; // Legacy saved report shape.
  report.lineItems.unshift(report.lineItems.pop()); // Even if source order puts Bucks first.
  report.frozenTotals = { ...computeTotals(report), ourTotal: 1234, estimatedSavings: 55 };
  const before = structuredClone(report);
  const groups = groupByCategory(report.lineItems);
  assert.equal(groups.get('title-settlement').at(-1).id, 'betterclose-bucks');
  assert.equal([...groups.values()].flat().filter(item => item.id === 'betterclose-bucks').length, 1);
  assert.ok(!groups.get('other').some(item => item.id === 'betterclose-bucks'));
  assert.deepEqual(computeTotals(report), before.frozenTotals);
  assert.deepEqual(report, before);
});
