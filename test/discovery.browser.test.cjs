const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('discovery articles remain readable on small phones and desktop, with printable worksheets', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const route of ['compare-title-fees', 'guides/keep-your-realtor-and-lender']) {
      const module = h.load(`src/app/${route}/page.tsx`);
      const content = h.render(React.createElement(module.default));
      const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + module.metadata.title + '</title><style>' + css + '</style></head><body>' + content + '</body></html>';
      if (process.env.BC_DISCOVERY_PREVIEW) {
        fs.mkdirSync(process.env.BC_DISCOVERY_PREVIEW, { recursive: true });
        fs.writeFileSync(path.join(process.env.BC_DISCOVERY_PREVIEW, route.split('/').pop() + '.html'), html);
      }
      for (const width of [320, 390, 768, 1280]) {
        await page.setViewport({ width, height: 900 });
        await page.setContent(html);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        assert.equal(await page.$$eval('h1', els => els.length), 1);
        assert.equal(await page.$eval('h1', el => getComputedStyle(el).color), 'rgb(15, 23, 42)');
        assert.ok(await page.$eval('h1', el => el.getBoundingClientRect().width > 250));
        await page.focus('a[href="/quote"]');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '/quote');
        if (process.env.BC_DISCOVERY_PREVIEW && [390, 1280].includes(width)) {
          await page.screenshot({ path: path.join(process.env.BC_DISCOVERY_PREVIEW, route.split('/').pop() + '-' + width + '.png'), fullPage: true });
        }
      }
      if (route === 'compare-title-fees') {
        await page.emulateMediaType('print');
        assert.equal(await page.$eval('aside', el => getComputedStyle(el).display), 'none');
        assert.match(await page.$eval('article', el => el.innerText), /Quote A:/);
        await page.emulateMediaType('screen');
      }
    }
    assert.equal(requestCount(), 0);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
