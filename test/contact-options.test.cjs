const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('No database access in contact tests'); } });

function render(file, props = {}) {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load(file).default, props));
  assert.equal(h.sent.length, 0);
  return html;
}

function assertContactOptions(html) {
  assert.match(html, /href="mailto:hello@betterclose.co"/);
  assert.match(html, /href="tel:\+18883780745"/);
  assert.match(html, /888-378-0745/);
  assert.match(html, /Email us/);
  assert.doesNotMatch(html, /\bchat\b|here now|Most replies|instant answers|animate-ping/i);
}

test('contact strip advertises email and the company phone, not chat or live presence', () => {
  const html = render('src/components/lender-request/AvailabilityStrip.tsx', { className: 'mt-5' });
  assertContactOptions(html);
  assert.match(html, /Need help\?/);
  assert.match(html, /mt-5/);
  assert.equal((html.match(/<a\b/g) || []).length, 2);
  assert.equal((html.match(/<button\b/g) || []).length, 0);
});

for (const mode of ['pre-quote', 'post-quote']) {
  test(`${mode} next steps use real contact options without changing the order links`, () => {
    const html = render('src/components/lender-request/NextStepsPanel.tsx', { source: 'synthetic-test', mode });
    assertContactOptions(html);
    assert.match(html, /href="\/dashboard"/);
    if (mode === 'pre-quote') {
      assert.match(html, /href="\/quote"/);
      assert.doesNotMatch(html, /href="\/open"/);
    } else {
      assert.match(html, /href="\/open"/);
      assert.match(html, /href="\/for-my-team"/);
    }
  });
}

test('story homepage replaces inert chat buttons with email and call links', () => {
  const html = render('src/components/StoryCalculator.tsx');
  assertContactOptions(html);
  assert.match(html, /Phone or Email Support/);
  assert.match(html, /<a[^>]+href="mailto:hello@betterclose.co"[^>]*>Email us<\/a>/);
  assert.match(html, /href="tel:\+18883780745"[^>]*>.*?<span>Call us<\/span><\/a>/);
  assert.doesNotMatch(html, /title="Text\/Email"|by chat|Chat Available|Start Chat/i);
  assert.match(html, /id="calculator"/, 'The automated savings calculator remains intact');
});
