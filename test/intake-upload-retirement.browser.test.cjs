const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('retired intake notice fits mobile and desktop with an accessible file-workspace link', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const html = h.render(React.createElement(h.load('src/components/IntakeDocumentsNotice.tsx').default));
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + '</style></head><body><main class="max-w-2xl mx-auto p-4"><div class="p-8">' + html + '</div></main></body></html>');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.$('input[type=file]'), null);
      const link = await page.$eval('a', el => {
        const r = el.getBoundingClientRect();
        return { href: el.getAttribute('href'), target: el.target, rel: el.rel, left: r.left, right: r.right, height: r.height };
      });
      assert.equal(link.href, '/dashboard');
      assert.equal(link.target, '_blank');
      assert.equal(link.rel, 'noopener noreferrer');
      assert.ok(link.left >= 0 && link.right <= width && link.height >= 44);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '/dashboard');
      if (process.env.BC_INTAKE_SCREENSHOTS) await page.screenshot({
        path: path.join(process.env.BC_INTAKE_SCREENSHOTS, 'intake-documents-' + width + '.png'), fullPage: true,
      });
    }
    assert.equal(requestCount(), 0, 'No document or customer network traffic');
  } finally { await browser.close(); }
});
