const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser } = require('./helpers/email-browser.cjs');

test('lender page and navigation fit phone, tablet and desktop without live requests', async () => {
  const root = path.resolve(__dirname, '..');
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: root, input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const Page = h.load('src/app/for-lenders/page.tsx').default;
  const Nav = h.load('src/components/NavigationCredible.tsx').default;
  const Footer = h.load('src/components/FooterComprehensive.tsx').default;
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css +
    '</style></head><body>' + h.render(React.createElement(React.Fragment, null, React.createElement(Nav), React.createElement(Page), React.createElement(Footer))) + '</body></html>';
  const browser = await openEmailBrowser();
  const denied = [];
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      // Chrome requests a site icon even though this isolated page has none.
      // Satisfy it locally; every other unexpected request remains forbidden.
      if (request.url() === 'https://preview.example.invalid/favicon.ico') {
        return request.respond({ status: 204, body: '' });
      }
      if (request.url() === 'https://preview.example.invalid/for-lenders') {
        return request.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      }
      if (request.url() === 'https://preview.example.invalid/images/marketing/nicole-operator-v1.webp') {
        return request.respond({ status: 200, contentType: 'image/webp', body: fs.readFileSync(path.join(root, 'public/images/marketing/nicole-operator-v1.webp')) });
      }
      denied.push(request.url()); return request.abort();
    });
    for (const width of [375, 768, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.goto('https://preview.example.invalid/for-lenders', { waitUntil: 'load' });
      const layout = await page.evaluate(() => {
        const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
        return {
          scrollWidth: document.documentElement.scrollWidth,
          heading: box('h1'), share: box('button[aria-label="Send to my team"]'), nav: box('header nav'),
          shareText: document.querySelector('button[aria-label="Send to my team"]').innerText,
          actions: [...document.querySelectorAll('main a')].map(el => ({text: el.innerText, right: el.getBoundingClientRect().right, left: el.getBoundingClientRect().left})),
          hero: document.querySelector('main section').innerText,
        };
      });
      assert.ok(layout.scrollWidth <= width, `${width}: no horizontal overflow`);
      assert.ok(layout.heading.width > 250 && layout.heading.left >= 0 && layout.heading.right <= width);
      assert.ok(layout.share.top >= layout.nav.top && layout.share.bottom <= layout.nav.bottom, `${width}: share button fits header`);
      assert.equal(layout.shareText, width < 640 ? 'Share' : 'Send to my team');
      for (const action of layout.actions) assert.ok(action.left >= 0 && action.right <= width, `${width}: ${action.text} fits`);
      assert.doesNotMatch(layout.hero, /\bAPI\b/);
      await page.click('a[href="#place-an-order"]');
      const headingTop = await page.$eval('#order-heading', el => el.getBoundingClientRect().top);
      assert.ok(headingTop >= 80 && headingTop < 900, `${width}: order anchor clears fixed header`);
    }
    assert.deepEqual(denied, []);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
