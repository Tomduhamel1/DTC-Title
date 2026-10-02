const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const root = path.resolve(__dirname, '..');
const css = require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root, 'tailwind.config.ts')))])
  .process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined }).then(result => result.css);
const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));

test('audited public copy and shared sample fit phone, tablet and desktop without changing page structure', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page } = await offlinePage(browser);
    const routes = ['about', 'for-brokers', 'for-realtors', 'for-lenders', 'for-my-team', 'security', 'open', 'quote/unavailable'];
    for (const route of routes) {
      const Page = h.load('src/app/' + route + '/page.tsx').default;
      const rendered = h.render(route === 'for-my-team' ? await Page({}) : React.createElement(Page));
      for (const width of [320, 390, 768, 1024, 1280]) {
        await page.setViewport({ width, height: 900 });
        await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + await css + 'body{color:white}</style></head><body>' + rendered + '</body></html>');
        const facts = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          overflow: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1)
            .slice(-8).map(el => ({ tag: el.tagName, text: el.textContent.slice(0, 90), classes: el.className, scroll: el.scrollWidth, client: el.clientWidth })),
          headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({
            text: el.textContent, fits: el.scrollWidth <= el.clientWidth + 1,
            left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right,
          })),
          sample: (() => {
            const el = document.querySelector('[data-marketing-fee-sample]');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { width: r.width, left: r.left, right: r.right, text: el.innerText,
              totalColor: getComputedStyle(el.querySelector('[data-sample-total]')).color,
              rows: [...el.querySelectorAll('[data-sample-fee]')].map(row => ({
                labelRight: row.querySelector('dt').getBoundingClientRect().right,
                amountLeft: row.querySelector('dd').getBoundingClientRect().left,
              })) };
          })(),
        }));
        assert.equal(facts.width, width, `${route} ${width}: no horizontal page overflow ${JSON.stringify(facts.overflow)}`);
        for (const heading of facts.headings) assert.ok(heading.fits && heading.left >= 0 && heading.right <= width + 1,
          `${route} ${width}: heading fits: ${heading.text}`);
        if (route === 'for-my-team') {
          assert.ok(facts.sample && facts.sample.left >= 0 && facts.sample.right <= width);
          assert.match(facts.sample.text, /Not your client's quote/);
          assert.notEqual(facts.sample.totalColor, 'rgb(255, 255, 255)', 'Totals must remain visible on white even when the app inherits light text');
          for (const row of facts.sample.rows) assert.ok(row.labelRight + 2 <= row.amountLeft, `${width}: sample amounts do not collide with labels`);
        }
        if (process.env.BC_COPY_SCREENSHOTS && ['for-my-team', 'about'].includes(route) && [390,1280].includes(width)) {
          assert.ok(fs.statSync(process.env.BC_COPY_SCREENSHOTS).isDirectory());
          await page.screenshot({ path: path.join(process.env.BC_COPY_SCREENSHOTS, route + '-' + width + '.png'), fullPage: true });
        }
      }
    }
    // offlinePage aborts every image/network request; no database or email calls.
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
