const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const root = path.resolve(__dirname, '..');
const h = createHarness(new Proxy({}, { get() { throw new Error('No customer records in copy checks'); } }));

test('homepage document and payment guidance fits all sizes without security badges or claims of guarantees', async () => {
  const css = await require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root, 'tailwind.config.ts')))])
    .process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  const html = h.render(React.createElement(h.load('src/components/SecurityTrustSection.tsx').default));
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [320, 390, 768, 1024, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css.css + '</style></head><body>' + html + '</body></html>');
      const facts = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth, text: document.body.innerText,
        headings: [...document.querySelectorAll('h2,h3')].map(el => ({
          fits: el.scrollWidth <= el.clientWidth + 1, right: el.getBoundingClientRect().right,
        })),
        links: [...document.querySelectorAll('a')].map(el => el.getAttribute('href')),
      }));
      assert.equal(facts.width, width);
      assert.ok(facts.headings.every(el => el.fits && el.right <= width + 1));
      assert.doesNotMatch(facts.text, /HTTPS|SSL|encrypted|bank.level|guaranteed|certified|Your privacy is our priority/i);
      assert.match(facts.text, /Being part of a closing does not automatically/);
      assert.match(facts.text, /anyone with that link can view/);
      assert.match(facts.text, /Before you send funds/);
      assert.deepEqual(facts.links, ['/security', '/privacy']);
      if (process.env.BC_SECURITY_SCREENSHOTS && [390, 1280].includes(width)) await page.screenshot({
        path: path.join(process.env.BC_SECURITY_SCREENSHOTS, 'security-guidance-' + width + '.png'), fullPage: true,
      });
    }
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});
