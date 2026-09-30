const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('transaction amount labels fit the real quote table on phone and desktop', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const Table = h.load('src/components/FeeReportTable.tsx').default;
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [390, 1280]) {
      await page.setViewport({ width, height: 900 });
      for (const transactionType of ['purchase', 'refinance']) {
        const report = {
          state: 'TX', zip: '75201', homeValue: transactionType === 'purchase' ? 500000 : 0,
          loanAmount: 400000, transactionType, generatedAt: '2026-09-30T12:00:00Z',
          lineItems: [{ id: 'settlement', category: 'title-settlement', label: 'Settlement fee', ourCost: 500, isFixed: false }],
        };
        await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css +
          '</style></head><body><main class="max-w-3xl mx-auto p-4">' + h.render(React.createElement(Table, { report })) + '</main></body></html>');
        const layout = await page.evaluate(() => {
          const el = document.querySelector('h3').nextElementSibling;
          const rect = el.getBoundingClientRect();
          return { text: el.innerText, left: rect.left, right: rect.right, height: rect.height,
            fits: el.scrollWidth <= el.clientWidth, documentWidth: document.documentElement.scrollWidth };
        });
        assert.equal(layout.text, transactionType === 'purchase' ? 'Purchase · TX · Purchase price $500,000' : 'Refinance · TX · Loan amount $400,000');
        assert.ok(layout.height > 0 && layout.fits && layout.left >= 0 && layout.right <= width);
        assert.ok(layout.documentWidth <= width, `${width}: no horizontal overflow`);
        if (process.env.BC_QUOTE_SCREENSHOTS) {
          await page.screenshot({ path: path.join(process.env.BC_QUOTE_SCREENSHOTS, `quote-${transactionType}-${width}.png`), fullPage: true });
        }
      }
    }
    assert.equal(requestCount(), 0);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
