const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('email and phone remain visible and readable in the next-steps panel at every size', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const Component = h.load('src/components/lender-request/NextStepsPanel.tsx').default;
  const html = h.render(React.createElement(Component, { source: 'synthetic-test', mode: 'pre-quote' }));
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [320, 390, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + '</style></head><body><main class="max-w-2xl mx-auto p-4">' + html + '</main></body></html>');
      assert.doesNotMatch(await page.$eval('body', el => el.innerText), /\bchat\b|here now|Most replies/i);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      const links = await page.$$eval('a[href^="mailto:"],a[href^="tel:"]', nodes => nodes.map(el => {
        const r = el.getBoundingClientRect();
        return { href: el.getAttribute('href'), text: el.innerText, left: r.left, right: r.right, height: r.height, fits: el.scrollWidth <= el.clientWidth };
      }));
      assert.equal(links.length, 2);
      assert.deepEqual(links.map(l => [l.href, l.text]), [['mailto:hello@betterclose.co', 'Email us'], ['tel:+18883780745', '888-378-0745']]);
      for (const link of links) assert.ok(link.left >= 0 && link.right <= width && link.height > 0 && link.fits);
      if (process.env.BC_CONTACT_SCREENSHOTS) await page.screenshot({ path: path.join(process.env.BC_CONTACT_SCREENSHOTS, `contact-options-${width}.png`), fullPage: true });
    }
    assert.equal(requestCount(), 0);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
