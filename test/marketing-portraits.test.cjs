const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const sharp = require('sharp');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

const root = path.resolve(__dirname, '..');
const h = createHarness(new Proxy({}, { get() { throw new Error('No database access in marketing tests'); } }));
const portrait = '/images/marketing/nicole-portrait-v1.webp';
const operator = '/images/marketing/nicole-operator-v1.webp';

test('marketing dashboard uses Nicole, her local portrait and first-name-only email, not stock credentials', () => {
  const Component = h.load('src/components/DashboardTrustSection.tsx').default;
  const html = h.render(React.createElement(Component));
  assert.match(html, />Nicole</);
  assert.ok(html.includes(`src="${portrait}"`));
  assert.ok(html.includes('alt="Nicole"'));
  assert.ok(html.includes('nicole@betterclose.co'));
  assert.doesNotMatch(html, /\b(?:Jamie|Jane|Doe|NMLS)\b|2184593|micciche|unsplash/i);
  assert.match(html, /2 of 4 milestones complete/);
});

test('shared navigation renders the new operator avatar without changing support routing', () => {
  const Component = h.load('src/components/NavigationCredible.tsx').default;
  const html = h.render(React.createElement(Component));
  assert.ok(html.includes(`src="${operator}"`));
  assert.ok(html.includes('alt="Nicole — BetterClose support"'));
  assert.ok(html.includes('href="tel:1-800-316-9508"'));
  assert.doesNotMatch(html, /operator-face\.png|micciche/i);
});

test('all alternate marketing layouts use the same versioned operator asset', () => {
  for (const file of ['src/app/HomePageOriginal.tsx', 'src/components/StoryCalculator.tsx', 'src/components/PeaceOfMindSection.tsx']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(source.includes(operator), file);
    assert.doesNotMatch(source, /operator-face\.png|micciche/i, file);
  }
});

test('web portraits are local, small and have no embedded identifying metadata', async () => {
  for (const asset of [portrait, operator]) {
    const filename = path.join(root, 'public', asset);
    assert.ok(fs.statSync(filename).size < 50000, asset);
    const meta = await sharp(filename).metadata();
    assert.equal(meta.format, 'webp');
    assert.equal(meta.width, 512);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    if (asset === operator) assert.equal(meta.height, 512);
  }
});
