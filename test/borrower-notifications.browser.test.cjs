// Real client component, offline browser, controlled API responses.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildSync } = require('esbuild');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const code = buildSync({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
  import Settings from './src/components/teammate/BorrowerEmailSetting'; const root=createRoot(document.getElementById('root'));
  window.mount=(props)=>root.render(React.createElement(Settings,{key:JSON.stringify(props),...props}));`,
  resolveDir: process.cwd(), sourcefile: 'synthetic-settings.tsx' }, bundle: true, write: false,
  platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' } }).outputFiles[0].text;

test('default-off type choices, explicit save, error retention, defaults and missing borrower render honestly', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f4f6"><main style="max-width:720px;margin:24px auto;padding:0 16px"><div id="root"></div></main></body></html>');
    await page.evaluate(() => { window.calls = []; window.fetch = (...args) => {
      window.calls.push(args); return new Promise(resolve => window.complete = resolve);
    }; });
    await page.addScriptTag({ content: code });
    await page.evaluate(() => window.mount({ closingId: 'synthetic/file & one', initialEnabled: false,
      initialTypes: ['title_ordered', 'title_search', 'title_issued', 'closed'], initialVersion: 'v1', recipient: 'borrower@example.invalid' }));
    await page.waitForSelector('input[type=checkbox]');
    assert.equal(await page.$$eval('input', nodes => nodes.length), 4);
    assert.equal(await page.$$eval('input', nodes => nodes.filter(n => n.checked).length), 0);
    await page.click('input'); assert.equal(await page.evaluate(() => window.calls.length), 0, 'Choice alone sends nothing');
    await page.click('button'); await page.waitForFunction(() => window.calls.length === 1);
    assert.equal(await page.$eval('fieldset', el => el.disabled), true);
    const [url, options] = await page.evaluate(() => window.calls[0]);
    assert.equal(url, '/api/closings/synthetic%2Ffile%20%26%20one/borrower-notifications');
    assert.deepEqual(JSON.parse(options.body), { types: ['title_ordered'], expectedVersion: 'v1', recipient: 'borrower@example.invalid' });
    await page.evaluate(() => window.complete({ ok: false, status: 500, json: async () => ({ error: 'Internal secret reason' }) }));
    await page.waitForSelector('[role=alert]'); assert.equal(await page.$('[role=status]'), null);
    assert.doesNotMatch(await page.$eval('body', e => e.textContent), /Internal secret/);
    assert.equal(await page.$eval('input', el => el.checked), true, 'Retain unsaved choices for retry');
    await page.click('button'); await page.waitForFunction(() => window.calls.length === 2);
    await page.evaluate(() => window.complete({ ok: true, json: async () => ({ ok: true, types: ['title_ordered'], version: 'v2' }) }));
    await page.waitForSelector('[role=status]');
    assert.match(await page.$eval('[role=status]', el => el.textContent), /No email was sent/);
    await page.click('button'); await page.waitForFunction(() => window.calls.length === 3);
    assert.equal(await page.evaluate(() => JSON.parse(window.calls[2][1].body).expectedVersion), 'v2');
    await page.evaluate(() => window.complete({ ok: false, status: 409, json: async () => ({ error: 'These settings changed. Refresh the file before saving.' }) }));
    await page.waitForSelector('[role=alert]'); assert.match(await page.$eval('[role=alert]', el => el.textContent), /Refresh/);
    await page.evaluate(() => window.mount({ defaults: true, initialTypes: ['closed'] }));
    await page.waitForFunction(() => document.querySelector('h2').textContent.includes('defaults'));
    assert.equal(await page.$$eval('input', nodes => nodes.filter(n => n.checked).length), 1);
    await page.click('button'); await page.waitForFunction(() => window.calls.length === 4);
    assert.equal(await page.evaluate(() => window.calls[3][0]), '/api/settings/borrower-notifications');
    assert.deepEqual(await page.evaluate(() => JSON.parse(window.calls[3][1].body)), { types: ['closed'], expectedTypes: ['closed'] });
    await page.evaluate(() => window.complete({ ok: true, json: async () => ({ ok: true, types: ['closed'] }) }));
    await page.waitForSelector('[role=status]');
    const cssDir = path.resolve('.next/static/css');
    if (fs.existsSync(cssDir)) for (const name of fs.readdirSync(cssDir).filter(n => n.endsWith('.css')))
      await page.addStyleTag({ content: fs.readFileSync(path.join(cssDir, name), 'utf8') });
    for (const width of [390, 1280]) {
      await page.setViewport({ width, height: 800 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      if (process.env.BC_NOTIFICATION_PREVIEW_DIR) {
        fs.mkdirSync(process.env.BC_NOTIFICATION_PREVIEW_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.BC_NOTIFICATION_PREVIEW_DIR, `notification-defaults-${width}.png`), fullPage: true });
      }
    }
    await page.evaluate(() => window.mount({ closingId: 'no-borrower', initialEnabled: false }));
    await page.waitForFunction(() => document.body.textContent.includes('No borrower email'));
    assert.equal(await page.$('input'), null); assert.equal(await page.$('button'), null);
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});
