const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('No database access in policy tests'); } });

for (const [path, title] of [['privacy', 'Privacy Policy'], ['terms', 'Terms of Service']]) {
  test(`${title} has a public, accessible review page, not an effective policy`, () => {
    const h = createHarness(noDb);
    const page = h.load(`src/app/${path}/page.tsx`);
    const html = h.render(React.createElement(page.default));
    assert.match(html, new RegExp(`<h1[^>]*>${title}</h1>`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /Owner-approved draft — not yet effective/);
    assert.match(html, /Final legal and publication checks remain/);
    assert.match(html, /Before publishing this page/);
    assert.match(html, /BetterClose is a DBA \(doing business as\) of First National Title &amp; Escrow LLC/);
    assert.doesNotMatch(html, /Confirm the full legal entity name|Create and verify contact@betterclose.co|Confirm company-wide collection/);
    assert.doesNotMatch(html, /The Law Office of Stephen Patti/);
    assert.match(html, /final publication date as the effective date/);
    assert.match(html, /This draft is not yet effective/);
    assert.deepEqual(page.metadata.robots, { index: false, follow: false });
    assert.match(html, /href="mailto:contact@betterclose.co"/);
    assert.match(html, /href="tel:\+18883780745"/);
    assert.match(html, /888-378-0745/);
    for (const route of ['privacy', 'terms', 'licenses']) assert.match(html, new RegExp(`href="/${route}"`));
    assert.doesNotMatch(html, /href="#"|lorem ipsum|\[company\]|\[date\]/i);
    assert.equal(h.sent.length, 0);
  });
}

test('footer Privacy and Terms links point to their own pages', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/components/FooterComprehensive.tsx').default));
  assert.match(html, /<a[^>]*href="\/privacy"[^>]*>Privacy Policy<\/a>/);
  assert.match(html, /<a[^>]*href="\/terms"[^>]*>Terms of Service<\/a>/);
  assert.match(html, /BetterClose, a DBA of First National Title &amp; Escrow LLC/);
  assert.doesNotMatch(html, /a division of First National Title/);
});

test('privacy draft explains actual file and quote sharing without invented business guarantees', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/privacy/page.tsx').default));
  assert.match(html, /shared quote link can be viewed by anyone who has that link, without signing in/);
  assert.match(html, /document-specific access and sharing controls/);
  assert.match(html, /off by default unless enabled/);
  assert.match(html, /Cookie|cookie/);
  assert.match(html, /Retention and protection/);
  assert.doesNotMatch(html, /never sell|100% secure|GDPR compliant|CCPA compliant|delete.{0,20}30 days/i);
});

test('privacy reflects owner-confirmed marketing exclusions without preventing requested services', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/privacy/page.tsx').default));
  assert.match(html, /We do not sell your personal information or share it with other companies for their own marketing/);
  assert.match(html, /We do not send promotional emails or use customer lists for targeted advertising/);
  assert.match(html, /sharing information needed to provide the services described above/);
  assert.match(html, /sending sign-in links and file updates according to the applicable notification choices/);
  assert.match(html, /The notice is not evidence that those disclosures actually occur/);
  assert.doesNotMatch(html, /we may disclose.{0,250}marketing|we have joint marketing agreements|never share (any )?information/i);
  assert.equal(h.sent.length, 0);
});

test('retention distinguishes record types and required preservation without inventing disposal deadlines', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/privacy/page.tsx').default));
  assert.match(html, /type of information, whether a transaction was opened or completed/);
  assert.match(html, /legal and regulatory requirements, underwriter obligations/);
  assert.match(html, /unused estimates and inquiries and to title, escrow, and settlement records/);
  assert.match(html, /audit, investigation, claim, or legal proceeding/);
  assert.match(html, /requesting deletion does not necessarily remove transaction records that must be retained/);
  assert.doesNotMatch(html, /24 months|two years|seven years|automatically delet|retain.{0,40}(forever|indefinitely)/i);
});

test('terms draft distinguishes estimates and requests from binding closing documents', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/terms/page.tsx').default));
  assert.match(html, /Estimates are not final closing figures/);
  assert.match(html, /not by itself confirm acceptance/);
  assert.match(html, /Verify money-transfer instructions independently/);
  assert.match(html, /does not add a click-to-accept requirement or record agreement/);
  assert.doesNotMatch(html, /by (visiting|continuing|using).{0,50}agree|binding arbitration|waive your right|liability.{0,20}\$100/i);
});

test('terms reflect free estimates without publishing internal cancellation practices or inventing fees', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/terms/page.tsx').default));
  assert.match(html, /Free estimates, no obligation/);
  assert.match(html, /Requesting a BetterClose estimate is free and carries no obligation to order title or settlement services/);
  assert.match(html, /Getting an estimate does not authorize paid work/);
  assert.match(html, /any applicable charges are addressed separately with your closing team/);
  assert.doesNotMatch(html, /repeat offenders?|eat charges|cancellation fee|cancellation charge|waive all|all (services|closings) are free|non.?refundable/i);
  assert.doesNotMatch(html, /type="checkbox"/);
  assert.equal(h.sent.length, 0);
});
