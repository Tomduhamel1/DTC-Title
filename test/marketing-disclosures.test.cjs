const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const disclosure = require('../src/lib/marketing-disclosure.json');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const ratingClaim = /\bA\+?[\s\u002d\u2010-\u2015]*(?:rated|rating)\b|(?:A\.?M\.? Best[^\n<>]{0,50})?rated A(?:\+| or higher)?\b/i;

test('all customer-facing source and handouts exclude blanket underwriter rating claims', () => {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : /\.(tsx?|jsx?|html|json|svg)$/.test(entry.name) ? [target] : [];
  });
  for (const directory of ['src', 'marketing', 'public']) {
    for (const file of walk(path.join(root, directory))) {
      const content = fs.readFileSync(file, 'utf8').replace(/&(?:nbsp|ndash|mdash|#160|#8208|#8211|#8212);/gi, '-');
      assert.doesNotMatch(content, ratingClaim, path.relative(root, file));
    }
  }
});

for (const file of ['agents-one-pager.html', 'brokers-one-pager.html', 'closing-comparison-guide.html']) {
  test(`${file} includes the complete disclosure, with legal identity and wire warning emphasized`, () => {
    const html = read(`marketing/${file}`);
    const text = html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    for (const phrase of Object.values(disclosure)) assert.ok(text.includes(phrase), phrase);
    assert.match(html, /<strong>BetterClose is a DBA of First National Title &amp; Escrow LLC\.<\/strong>/);
    assert.match(html, /<strong>Before sending funds,<\/strong>/);
    assert.doesNotMatch(html, /division of First National|34-state coverage|A\.M\. Best rated/i);
  });
}

test('online comparison guide uses the same disclosure and still links the printable PDF', () => {
  assert.match(read('src/app/closing-comparison-kit/page.tsx'), /<MarketingDisclosure\s*\/>/);
  assert.match(read('src/app/closing-comparison-kit/page.tsx'), /\/pdfs\/betterclose-closing-comparison-guide\.pdf/);
  assert.match(read('src/components/MarketingDisclosure.tsx'), /marketing-disclosure\.json/);
});

test('rating cleanup preserves the published handout example amounts', () => {
  const agents = read('marketing/agents-one-pager.html');
  const brokers = read('marketing/brokers-one-pager.html');
  for (const amount of ['$2,225', '$2,725', '$3,625', '$4,475', '$6,425', '$7,975']) assert.ok(agents.includes(amount));
  for (const amount of ['$500', '$850', '$1,550', '$260', '$380', '$620', '$1,140']) assert.ok(brokers.includes(amount));
});

test('saved quote layouts drop the old stock rating description without changing frozen data', () => {
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const { feeDescription, computeTotals } = h.load('src/lib/feeReport.ts');
  const item = Object.freeze({ id: 'title', label: "Lender's Title Insurance", category: 'title-settlement', feeSource: 'underwriter',
    description: 'A-rated underwriter coverage', ourCost: 760, isFixed: false, typicalRange: Object.freeze({ low: 760, high: 760 }) });
  const report = { state: 'RI', transactionType: 'purchase', homeValue: 300000, loanAmount: 240000, lineItems: Object.freeze([item]) };
  report.frozenTotals = Object.freeze(computeTotals(report));
  Object.freeze(report);
  const before = structuredClone(report);
  for (const view of ['DesignInvoice', 'DesignCards']) {
    const html = h.render(React.createElement(h.load(`src/components/feeReportDesigns/${view}.tsx`).default, { report }));
    assert.doesNotMatch(html, ratingClaim);
    assert.match(html, /Title insurance coverage/);
    assert.match(html, /\$760/);
  }
  assert.deepEqual(report, before);
  assert.equal(feeDescription({ description: 'Custom policy note', feeSource: 'underwriter' }), 'Custom policy note');
  assert.equal(feeDescription({}), undefined);
  assert.equal(h.sent.length, 0);
});
