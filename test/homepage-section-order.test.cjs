const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

for (const [heroVersion, hero] of [['magic', 'HeroMagicReveal'], ['A', 'HeroOptionA'], ['B', 'HeroOptionB'], ['C', 'HeroOptionC']]) {
  test(`${heroVersion}: Backed By follows Transparency, removed sections stay absent, accreditation is last`, () => {
    const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
    const Home = h.load('src/components/HomePageCredible.tsx').default;
    const expectedNames = [hero, 'TeamTrustSection', 'FeeReportPreviewSection', 'UnderwriterLogos',
      'DashboardTrustSection', 'HowItWorksSection', 'FAQSection', 'SecurityTrustSection',
      'ReadyToSaveSection', 'AccreditationSection'];
    const expected = expectedNames.map(name => h.load(`src/components/${name}.tsx`).default);
    const tree = Home({ heroVersion });
    const types = React.Children.toArray(tree.props.children.props.children)
      .filter(React.isValidElement).map(node => node.type);
    assert.deepEqual(types.filter(type => expected.includes(type)), expected);
    assert.equal(types.indexOf(expected[1]), types.indexOf(expected[0]) + 1, 'Team immediately follows hero');
    assert.equal(types.indexOf(expected[3]), types.indexOf(expected[2]) + 1, 'Backed By immediately follows Transparency');
    assert.equal(types.indexOf(expected.at(-1)), types.length - 2, 'Accreditation immediately precedes footer');
    for (const removed of ['CompanyCredentialsSection', 'TrustStripSection']) {
      assert.ok(!types.includes(h.load(`src/components/${removed}.tsx`).default));
    }
    for (const type of expected) assert.equal(types.filter(t => t === type).length, 1);
    const html = h.render(React.createElement(Home, { heroVersion }));
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    for (const heading of ['Keep the Team You Trust', 'Backed By America', 'ACCREDITED &amp; CERTIFIED BY']) {
      assert.equal(text.split(heading).length - 1, 1, `${heading} renders exactly once`);
    }
    assert.ok(text.indexOf('Keep the Team You Trust') < text.indexOf('See every fee, line by line.'));
    assert.ok(text.indexOf('See every fee, line by line.') < text.indexOf('Backed By America'));
    assert.ok(text.indexOf('Backed By America') < text.indexOf('Real people.'));
    assert.ok(text.indexOf('ACCREDITED &amp; CERTIFIED BY') > text.indexOf('Make BetterClose your closing company.'));
    assert.doesNotMatch(text, /Why BetterClose|Licensed in 50 States|remaining 16/);
    assert.equal(h.sent.length, 0);
  });
}
