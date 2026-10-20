const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const root = path.resolve(__dirname, '..');
const h = createHarness(new Proxy({}, { get() { throw new Error('No customer records in copy checks'); } }));

test('factual Security page guidance fits mobile and desktop without feature-sales cards', async () => {
  const css = await require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root, 'tailwind.config.ts')))])
    .process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  const rendered = h.render(React.createElement(h.load('src/app/security/page.tsx').default));
  const html = rendered.match(/<main\b[\s\S]*?<\/main>/)[0];
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [320, 390, 768, 1024, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css.css + '</style></head><body>' + html + '</body></html>');
      const facts = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth, text: document.body.innerText,
        headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({
          fits: el.scrollWidth <= el.clientWidth + 1, right: el.getBoundingClientRect().right,
        })),
        links: [...document.querySelectorAll('a')].map(el => el.getAttribute('href')),
      }));
      assert.equal(facts.width, width);
      assert.ok(facts.headings.every(el => el.fits && el.right <= width + 1));
      assert.doesNotMatch(facts.text, /HTTPS|SSL|encrypted|bank.level|certified|Your privacy is our priority|File-Specific Access|Preview and Download Permissions/i);
      assert.match(facts.text, /Recovery is not guaranteed/);
      assert.match(facts.text, /anyone with the link/);
      assert.match(facts.text, /Before you send funds/);
      assert.ok(facts.links.includes('/privacy'));
      assert.ok(facts.links.includes('https://www.ic3.gov/'));
      assert.ok(facts.links.includes('tel:+18883780745'));
      if (process.env.BC_SECURITY_SCREENSHOTS && [390, 1280].includes(width)) await page.screenshot({
        path: path.join(process.env.BC_SECURITY_SCREENSHOTS, 'security-guidance-' + width + '.png'), fullPage: true,
      });
    }
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});
