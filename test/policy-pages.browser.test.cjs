const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('published policies remain readable on mobile and desktop with keyboard-accessible contact links', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const route of ['privacy', 'terms']) {
      const html = h.render(React.createElement(h.load(`src/app/${route}/page.tsx`).default));
      for (const width of [390, 1280]) {
        await page.setViewport({ width, height: 900 });
        await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + '</style></head><body>' + html + '</body></html>');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        const layout = await page.$eval('h1', el => ({ color: getComputedStyle(el).color, width: el.getBoundingClientRect().width }));
        assert.notEqual(layout.color, 'rgb(255, 255, 255)');
        assert.ok(layout.width > 250 && layout.width <= width);
        assert.equal(await page.$eval('time', el => el.dateTime), '2026-10-01');
        assert.equal(await page.$$eval('details, summary, [aria-label="Policy draft notice"]', els => els.length), 0);
        await page.focus('a[href="mailto:contact@betterclose.co"]');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), 'mailto:contact@betterclose.co');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), 'tel:+18883780745');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        if (process.env.BC_POLICY_SCREENSHOTS) {
          await page.screenshot({ path: path.join(process.env.BC_POLICY_SCREENSHOTS, `policy-${route}-${width}.png`), fullPage: true });
        }
      }
    }
    assert.equal(requestCount(), 0);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
