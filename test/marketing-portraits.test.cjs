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
  assert.ok(html.includes('href="tel:+18883780745"'));
  assert.ok(html.includes('888-378-0745'));
  assert.match(html, /overflow-hidden rounded-full/);
  assert.match(html, /origin-top scale-150/);
  assert.doesNotMatch(html, /operator-face\.png|micciche/i);
});

test('all navigation layouts use the same tight face crop', () => {
  for (const file of ['src/components/NavigationCredible.tsx', 'src/app/HomePageOriginal.tsx', 'src/components/StoryCalculator.tsx']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(source.includes('<NavOperatorPortrait />'), file);
    assert.doesNotMatch(source, /operator-face\.png|micciche/i, file);
  }
});

test('nav crop is isolated from the larger marketing portraits', () => {
  const Component = h.load('src/components/NavOperatorPortrait.tsx').default;
  const html = h.render(React.createElement(Component));
  assert.ok(html.includes(operator));
  assert.match(html, /w-16 h-16 shrink-0 overflow-hidden rounded-full/);
  assert.match(html, /origin-top scale-150/);
  const largerPortrait = fs.readFileSync(path.join(root, 'src/components/PeaceOfMindSection.tsx'), 'utf8');
  assert.ok(largerPortrait.includes(operator));
  assert.doesNotMatch(largerPortrait, /NavOperatorPortrait|scale-150/);
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
