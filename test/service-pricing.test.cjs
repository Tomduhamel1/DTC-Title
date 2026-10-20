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

test('discounts use exact nationwide proportions without changing the underlying state schedule', () => {
  const h = setup();
  const fees = h.load('src/lib/betterCloseFees.ts');
  for (const [label, amount, expected] of [
    ['Notary Fee', 150, 140], ['Notary Fee', 175, 163.33],
    ['Attorney Fee', 50, 40], ['Attorney Fee', 75, 60],
    ['Abstractor Title Search', 100, 90], ['Abstractor Title Search', 295, 265.5],
    ['Abstractor Title Search', 18, 16.2], [' notary fee ', 150, 140],
    ['Notary Fee', 0, 0], ['Notary Fee', -50, -50],
    ['Settlement Fee', 350, 350], ["Lender's Title Insurance", 1200, 1200],
    ['Closing Protection Letter', 35, 35], ['Recording Service Fee', 25, 25],
  ]) {
    assert.equal(fees.discountedServiceFee(label, amount), expected, label + ' ' + amount);
  }
  assert.equal(fees.betterCloseServiceFee('notary fee', 'ri', 'refinance'), undefined);
  assert.equal(fees.betterCloseServiceFee('Settlement Fee', 'RI', 'purchase'), 250);
  assert.equal(fees.ensuredLinesFor('MA', 'refinance')[0].amount, 300);
  assert.equal(fees.ENSURE_LINES.RI.refinance[0].amount, 100, 'Original upstream gap evidence stays intact');
});

test('purchase and refinance preserve state differences, comparison package dollars and credit exclusions nationwide', async () => {
  const states = Object.keys(setup().load('src/lib/representativeZip.ts').REPRESENTATIVE_ZIP_BY_STATE);
  for (const [index, state] of states.entries()) {
    for (const transactionType of ['purchase', 'refinance']) {
      const response = structuredClone(fixture.response);
      response.stateCode = state;
      const oldFees = { 'Notary Fee': 150 + index, 'Attorney Fee': 50 + index, 'Abstractor Title Search': 100 + index };
      for (const row of response.rateCalcGuideResponse) {
        const label = row.FeeDescription?.replace(/^Title - /, '');
        if (Object.hasOwn(oldFees, label)) row.BuyerFee = oldFees[label];
      }
      const input = { ...fixture.capture.input, transactionType };
      const h = setup(response);
      const old = setup(response);
      old.load('src/lib/betterCloseFees.ts').discountedServiceFee = (_label, amount) => amount;
      const before = await old.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(input, { skipAvailabilityCheck: true });
      const after = await h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(input, { skipAvailabilityCheck: true });
      const compute = h.load('src/lib/feeReport.ts').computeTotals;
      const a = compute(after), b = compute(before);
      const band = h.load('src/lib/marketBaseline.ts').serviceBandFor(state, transactionType, input.zip);
      assert.equal(a.serviceStack.typicalLow, Math.round(band.packageRange?.low ?? b.serviceStack.ourTotal * band.low),
        state + ' low uses the original schedule, not the discounted one');
      assert.equal(a.serviceStack.typicalHigh, Math.round(band.packageRange?.high ?? b.serviceStack.ourTotal * band.high),
        state + ' high package is allocated exactly once');
      let reduction = 0;
      for (const [label, amount] of Object.entries(oldFees)) {
        const expected = h.load('src/lib/betterCloseFees.ts').discountedServiceFee(label, amount);
        assert.equal(after.lineItems.find(row => row.label === label).ourCost, expected, state + ' ' + label);
        reduction += amount - expected;
      }
      assert.equal(Math.round((b.ourTotal - a.ourTotal) * 100), Math.round(reduction * 100));
      assert.equal(a.serviceStack.typicalLow, b.serviceStack.typicalLow, state + ' comparison low');
      assert.equal(a.serviceStack.typicalHigh, b.serviceStack.typicalHigh, state + ' comparison high');
      assert.deepEqual(after.lineItems.filter(row => row.isCredit), before.lineItems.filter(row => row.isCredit));
      if (['FL', 'TX', 'NM', 'NY'].includes(state)) assert.ok(!after.lineItems.some(row => row.isCredit));
      for (const row of after.lineItems.filter(row => row.isFixed && /Abstractor/.test(row.label))) {
        assert.equal(row.typicalRange, undefined, 'Excluded search lines do not acquire comparison savings');
      }
    }
  }
});

test('missing refinance searches receive the same discount exactly once, including the upstream REFI alias', async () => {
  for (const [state, original] of [['MA', 300], ['AL', 295], ['TX', 150], ['SD', 18]]) {
    for (const source of ['missing', 'returned', 'alias']) {
      const response = structuredClone(fixture.response);
      response.stateCode = state;
      response.rateCalcGuideResponse = response.rateCalcGuideResponse.filter(row => !/Abstractor/.test(row.FeeDescription));
      if (source !== 'missing') response.rateCalcGuideResponse.push({
        FeeDescription: source === 'alias' ? 'Title - AbstractorTitleSearchREFI' : 'Title - Abstractor Title Search',
        BuyerFee: original,
      });
      const h = setup(response);
      const report = await h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(
        { ...fixture.capture.input, transactionType: 'refinance' }, { skipAvailabilityCheck: true });
      const rows = report.lineItems.filter(row => /Abstractor/.test(row.label));
      assert.equal(rows.length, 1, state + ' ' + source);
      assert.equal(rows[0].ourCost, Math.round(original * 90) / 100);
    }
  }
});

test('a cheaper competitor stays cheaper: fee reductions do not manufacture package savings', async () => {
  for (const state of ['OK', 'NV', 'UT', 'MO']) {
    const h = setup({ ...structuredClone(fixture.response), stateCode: state });
    const report = await h.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(fixture.capture.input, { skipAvailabilityCheck: true });
    const { serviceStack } = h.load('src/lib/feeReport.ts').computeTotals(report);
    assert.ok(serviceStack.typicalLow < serviceStack.ourTotal, state);
    assert.equal(serviceStack.savings, 0, state);
    for (const row of report.lineItems.filter(row => row.typicalRange)) {
      assert.ok(row.typicalRange.low >= 0 && row.typicalRange.high >= row.typicalRange.low,
        state + ' does not invent negative or inverted line-item prices');
    }
  }
});

test('discounts do not add missing services or alter premiums, CPL, government charges, or state availability', async () => {
  const h = setup();
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
  const off = setup({ ...fixture.response, stateCode: 'CA' });
  await assert.rejects(() => off.load('src/lib/elendCalc.ts').fetchElendFeeEstimate(fixture.capture.input), { name: 'ServiceNotOfferedError' });
});

test('currency formatting preserves proportional cents without adding decimals to whole-dollar fees', () => {
  const { formatCurrency } = setup().load('src/lib/feeReport.ts');
  for (const [amount, expected] of [[163.33, '$163.33'], [265.5, '$265.50'], [16.2, '$16.20'], [140, '$140'], [-430, '-$430']]) {
    assert.equal(formatCurrency(amount), expected);
  }
});

test('marketing anchors and curves agree with the matching quote-engine matrix scenarios', () => {
  const h = setup();
  const { STATE_MATRIX } = h.load('src/lib/stateMatrix.generated.ts');
  const { STATE_CURVES, CURVE_HOME_VALUES } = h.load('src/lib/stateSavingsCurve.generated.ts');
  const { STATE_ANCHORS } = h.load('src/lib/stateSavings.generated.ts');
  assert.deepEqual(Object.keys(STATE_ANCHORS).sort(), Object.keys(STATE_MATRIX).sort());
  assert.deepEqual(Object.keys(STATE_CURVES).sort(), Object.keys(STATE_MATRIX).sort());
  for (const state of Object.keys(STATE_MATRIX)) {
    for (const mode of ['purchase', 'refinance']) {
      const anchor = STATE_MATRIX[state][mode]['500000'];
      assert.deepEqual(STATE_ANCHORS[state][mode], { save: anchor.save, ourTotal: anchor.pay }, state + ' ' + mode);
      for (const [index, value] of CURVE_HOME_VALUES.entries()) {
        const scenario = STATE_MATRIX[state][mode][String(value)];
        assert.deepEqual(STATE_CURVES[state][mode][index], { save: scenario.save, pay: scenario.pay }, state + ' ' + mode);
      }
    }
  }
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
