const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

for (const [heroVersion, hero] of [['magic', 'HeroMagicReveal'], ['A', 'HeroOptionA'], ['B', 'HeroOptionB'], ['C', 'HeroOptionC']]) {
  test(`${heroVersion}: Team takes the old Why position and Why follows Backed By, with no lost sections`, () => {
    const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
    const Home = h.load('src/components/HomePageCredible.tsx').default;
    const expectedNames = [hero, 'TeamTrustSection', 'FeeReportPreviewSection', 'DashboardTrustSection',
      'CompanyCredentialsSection', 'HowItWorksSection', 'UnderwriterLogos', 'TrustStripSection',
      'FAQSection', 'SecurityTrustSection', 'ReadyToSaveSection'];
    const expected = expectedNames.map(name => h.load(`src/components/${name}.tsx`).default);
    const tree = Home({ heroVersion });
    const types = React.Children.toArray(tree.props.children.props.children)
      .filter(React.isValidElement).map(node => node.type);
    assert.deepEqual(types.filter(type => expected.includes(type)), expected);
    assert.equal(types.indexOf(expected[1]), types.indexOf(expected[0]) + 1, 'Team immediately follows hero');
    assert.equal(types.indexOf(expected[7]), types.indexOf(expected[6]) + 1, 'Why immediately follows Backed By');
    for (const type of expected) assert.equal(types.filter(t => t === type).length, 1);
    const html = h.render(React.createElement(Home, { heroVersion }));
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    for (const heading of ['Keep the Team You Trust', 'Why BetterClose', 'Backed By America']) {
      assert.equal(text.split(heading).length - 1, 1, `${heading} renders exactly once`);
    }
    assert.ok(text.indexOf('Keep the Team You Trust') < text.indexOf('See every fee, line by line.'));
    assert.ok(text.indexOf('Backed By America') < text.indexOf('Why BetterClose'));
    assert.equal(h.sent.length, 0);
  });
}
