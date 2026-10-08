const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const root = path.resolve(__dirname, '..');
const css = require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root, 'tailwind.config.ts')))])
  .process(fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8'), { from: undefined }).then(result => result.css);

test('public pages reflow from small phones to desktop without clipping content', async () => {
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const browser = await openEmailBrowser();
  try {
    const { page } = await offlinePage(browser); // Abort every external request.
    const Nav = h.load('src/components/NavigationCredible.tsx').default;
    const Footer = h.load('src/components/FooterComprehensive.tsx').default;
    const cases = [
      ['home', 'src/components/HomePageCredible.tsx', { heroVersion: 'magic' }],
      ['brokers', 'src/app/for-brokers/page.tsx'],
      ['agents', 'src/app/for-realtors/page.tsx'],
      ['lenders', 'src/app/for-lenders/page.tsx'],
      ['security', 'src/app/security/page.tsx'],
      ['about', 'src/app/about/page.tsx'],
      ['terms', 'src/app/terms/page.tsx'],
      ['privacy', 'src/app/privacy/page.tsx'],
    ];
    for (const [name, file, props] of cases) {
      const Page = h.load(file).default;
      const body = h.render(React.createElement(React.Fragment, null,
        React.createElement(Nav), React.createElement(Page, props), React.createElement(Footer)));
      for (const width of [320, 390, 430, 768, 1024, 1440]) {
        await page.setViewport({ width, height: 900 });
        await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + await css + '</style></head><body>' + body + '</body></html>');
        const facts = await page.evaluate(() => {
          const client = document.documentElement.clientWidth;
          const clipped = [...document.querySelectorAll('h1,h2,h3,p,footer a')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width && (r.right > client + 1 || r.left < -1 || el.scrollWidth > el.clientWidth + 1);
          }).map(el => el.textContent.slice(0, 70));
          const h1 = document.querySelector('h1');
          return { client, scroll: document.documentElement.scrollWidth, clipped,
            headingSize: h1 && parseFloat(getComputedStyle(h1).fontSize),
            text: document.body.innerText };
        });
        assert.ok(facts.scroll <= width, name + ' ' + width + ': page overflow ' + facts.scroll);
        assert.deepEqual(facts.clipped, [], name + ' ' + width + ': text fits');
        if (width < 640) assert.ok(facts.headingSize <= 32, name + ': mobile heading scale');
        if (name === 'home') {
          for (const content of ['$360', '$819', 'Keep the Team You Trust', 'Real people.', 'Full transparency']) {
            assert.ok(facts.text.includes(content), 'Preserve homepage content: ' + content);
          }
        }
        if (process.env.BC_MOBILE_SCREENSHOTS && ['home', 'terms', 'lenders'].includes(name) && [390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(process.env.BC_MOBILE_SCREENSHOTS, name + '-' + width + '.png') });
        }
      }
    }
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
