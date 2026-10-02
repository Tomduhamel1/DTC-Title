const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const h = createHarness(new Proxy({}, { get() { throw new Error('No database access in public copy tests'); } }));
const text = html => html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '').replace(/<[^>]*>/g, ' ').replace(/&#x27;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

const pages = [
  ['home', 'src/components/HomePageCredible.tsx', { heroVersion: 'magic' }],
  ['about', 'src/app/about/page.tsx'], ['brokers', 'src/app/for-brokers/page.tsx'],
  ['agents', 'src/app/for-realtors/page.tsx'], ['lenders', 'src/app/for-lenders/page.tsx'],
  ['security', 'src/app/security/page.tsx'], ['team', 'src/app/for-my-team/page.tsx', {}],
  ['order', 'src/app/open/page.tsx'], ['availability', 'src/app/quote/unavailable/page.tsx'],
];
for (const [name, file, props] of pages) {
  test(name + ': public copy avoids audited false promises and misleading savings', async () => {
    const Component = h.load(file).default;
    const html = h.render(name === 'team' ? await Component(props) : React.createElement(Component, props));
    const rendered = text(html);
    for (const prohibited of [
      /itemized below|every other title company|save thousands|few thousand dollars/i,
      /Typical rates in this area|[−-]\s*\$[\d,]+\s+(?:saved|in estimated savings)/,
      /automates underwriting|identical coverage|Same protection|Works with all banks|all lender requirements|we never slow|same-day underwriting/i,
      /what you see is what you pay|no surprises|no liens/i,
      /24\/7|immediate response|under 2 hours|we're here now|human support, whenever/i,
      /directly licensed|remaining states through|Equal Housing Lender|BBB Accredited|SSL Secured/,
      /notify the borrower|Funds disbursed\. Keys handed over|\bNPN\b|same SLA|coming soon/i,
    ]) assert.doesNotMatch(rendered, prohibited, name + ': ' + prohibited);
    assert.equal(h.sent.length, 0);
  });
}

test('homepage leads with transparent line-by-line pricing and no directional promise', () => {
  const Home = h.load('src/components/HomePageCredible.tsx').default;
  const rendered = text(h.render(React.createElement(Home, { heroVersion: 'magic' })));
  assert.match(rendered, /transparent, line-by-line pricing/);
  assert.match(rendered, /what each charge covers, how our fees compare, and where you can save/);
  assert.match(rendered, /Total over the loan/);
  assert.match(rendered, /includes at-closing savings plus modeled interest avoided/);
  assert.doesNotMatch(rendered, /better loan pricing|exact estimate/);
  const amount = h.load('src/lib/stateSavings.ts').estimateSavings(500000, 'purchase', null).saveAtClosing;
  assert.ok(rendered.includes('$' + amount.toLocaleString() + ' in estimated savings at closing.'), 'SSR team matches national hero before hydration');
});

test('sample fee card derives every price, total and savings from one report, never a client headline', () => {
  const Card = h.load('src/components/MarketingFeeSample.tsx').default;
  const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport();
  const { computeTotals, formatCurrency } = h.load('src/lib/feeReport.ts');
  const totals = computeTotals(report);
  const html = h.render(React.createElement(Card));
  const rendered = text(html);
  assert.equal((html.match(/data-sample-fee=/g) || []).length, report.lineItems.length);
  for (const item of report.lineItems) {
    assert.ok(rendered.includes(item.label));
    assert.ok(html.includes(formatCurrency(item.ourCost)));
    if (item.feeSource === 'underwriter' || item.feeSource === 'state') assert.equal(item.typicalRange, undefined);
  }
  assert.ok(html.includes('data-sample-total="true">' + formatCurrency(totals.ourTotal)));
  assert.ok(html.includes('data-sample-savings="true">' + formatCurrency(totals.estimatedSavings)));
  assert.match(rendered, /Providence, RI.*300,000 purchase.*240,000 loan.*Not your client's quote/);
  assert.equal(totals.ourTotal, report.lineItems.reduce((sum, item) => sum + item.ourCost, 0));
  const page = source('src/app/for-my-team/page.tsx');
  assert.doesNotMatch(page, /previewSavings|QuotePreviewMockup|MockLineItem|\$685|\$1,240/);
});

test('homepage sample is explicitly a separate fixed scenario, never an unserved local quote', () => {
  const html = h.render(React.createElement(h.load('src/components/FeeReportPreviewSection.tsx').default));
  assert.match(text(html), /\$300,000 purchase in Providence, RI, with a \$240,000 loan/);
  assert.match(text(html), /Calculated with our quote engine—not a quote for your property/);
  assert.match(text(html), /\$360 at closing: \$140 in service fees plus a \$220 BetterClose Bucks credit/);
  assert.doesNotMatch(source('src/components/FeeReportPreviewSection.tsx'), /api\/geo|exactly what you're saving/);
});

test('marketing stages reuse real customer descriptions and four-stage counts', () => {
  const copy = h.load('src/lib/closing/milestoneCopy.ts');
  const real = h.load('src/lib/closing.ts');
  assert.deepEqual(real.MILESTONE_DESCRIPTIONS, copy.MILESTONE_DESCRIPTIONS);
  const kinds = h.load('src/lib/closing/customerMilestones.ts').CUSTOMER_MILESTONE_KINDS;
  const html = text(h.render(React.createElement(h.load('src/components/DashboardTrustSection.tsx').default)));
  for (const kind of kinds) assert.ok(html.includes(copy.MILESTONE_DESCRIPTIONS[kind]));
  assert.match(html, /Sample dashboard.*2 of 4 milestones complete/);
  for (const file of ['src/app/for-brokers/page.tsx','src/app/for-realtors/page.tsx']) {
    const rendered = text(h.render(React.createElement(h.load(file).default)));
    assert.doesNotMatch(rendered, /[024] \/ 5|loan locked/i);
    assert.ok(source(file).includes('total: CUSTOMER_MILESTONE_KINDS.length'));
  }
});

test('footer portal action points to sign-in and About uses the existing share flow', () => {
  const html = h.render(React.createElement(h.load('src/components/FooterComprehensive.tsx').default));
  assert.match(html, /href="\/login\?callbackUrl=\/teammate\/dashboard"/);
  assert.doesNotMatch(html, /href="#"|Equal Housing Lender|BBB Accredited/);
  assert.match(text(html), new RegExp('© ' + new Date().getFullYear() + ' BetterClose'));
  const about = source('src/app/about/page.tsx');
  assert.match(about, /onClick=\{\(\) => setShareOpen\(true\)\}/);
  assert.match(about, /<ShareWithTeamSheet open=\{shareOpen\}/);
});

test('order confirmation distinguishes a received request from an opened file', () => {
  const order = source('src/app/open/page.tsx');
  assert.match(order, /Your title order request was received/);
  assert.match(order, /Once your file is opened and an escrow officer is assigned/);
  assert.doesNotMatch(order, /Your file is opened|Opening your file|within one business day|We've emailed/);
  const broker = text(h.render(React.createElement(h.load('src/app/for-brokers/page.tsx').default)));
  assert.match(broker, /Borrower emails follow your notification defaults and per-file choices; they are off unless enabled/);
});

test('borrower notification policy remains permission- and event-specific', () => {
  const { borrowerMayReceive } = h.load('src/lib/closing/notificationPolicy.ts');
  const recipient = 'borrower@example.invalid';
  const permission = { borrowerEmail: recipient, borrowerEmailsEnabled: true,
    borrowerEmailPermissionRecipient: recipient, borrowerEmailPermissionAt: new Date(),
    borrowerEmailPermissionVersion: 'synthetic', borrowerEmailTypes: ['opening'] };
  assert.equal(borrowerMayReceive({}, recipient), false);
  assert.equal(borrowerMayReceive({ ...permission, borrowerEmailsEnabled: false }, recipient), false);
  assert.equal(borrowerMayReceive(permission, 'other@example.invalid', undefined, 'opening'), false);
  assert.equal(borrowerMayReceive(permission, recipient, undefined, 'completion'), false);
  assert.equal(borrowerMayReceive(permission, recipient, undefined, 'opening'), true);
});
