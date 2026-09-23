// Real per-file client control mounted in an isolated browser; PATCH is intercepted.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
test('borrower control is default-off; waits for success, preserves state on failure, and uses the exact file', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page } = await offlinePage(browser);
    await page.setContent('<!doctype html><div id="root"></div>');
    for (const pkg of ['react', 'react-dom']) await page.addScriptTag({ content: fs.readFileSync(
      path.join(path.dirname(require.resolve(pkg + '/package.json')), 'umd', pkg + '.development.js'), 'utf8') });
    const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname,
      '../src/components/teammate/BorrowerEmailSetting.tsx'), 'utf8'), { compilerOptions: {
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
    await page.evaluate(code => {
      const mod = { exports: {} }; window.calls = [];
      new Function('require', 'module', 'exports', 'fetch', code)(name => {
        if (name !== 'react') throw new Error('Unexpected dependency'); return React;
      }, mod, mod.exports, (...args) => { window.calls.push(args); return new Promise(resolve => window.complete = resolve); });
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(mod.exports.default,
        { closingId: 'synthetic/file & one', initialEnabled: false }));
    }, code);
    await page.waitForSelector('input[type=checkbox]');
    const checkbox = 'input[type=checkbox]';
    assert.equal(await page.$eval(checkbox, e => e.checked), false);
    assert.match(await page.$eval('body', e => e.textContent), /Off by default/);
    await page.click(checkbox);
    await page.waitForFunction(() => window.calls.length === 1);
    assert.equal(await page.$eval(checkbox, e => e.checked), false);
    assert.equal(await page.$eval(checkbox, e => e.disabled), true);
    assert.deepEqual(await page.evaluate(() => window.calls[0]), [
      '/api/closings/synthetic%2Ffile%20%26%20one/borrower-notifications',
      { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: '{"enabled":true}' } ]);
    await page.evaluate(() => window.complete({ ok: false, json: async () => ({ error: 'Internal secret reason' }) }));
    await page.waitForSelector('[role=alert]');
    assert.equal(await page.$eval(checkbox, e => e.checked), false);
    assert.doesNotMatch(await page.$eval('body', e => e.textContent), /Internal secret/);
    await page.click(checkbox); await page.waitForFunction(() => window.calls.length === 2);
    await page.evaluate(() => window.complete({ ok: true, json: async () => ({ ok: true, enabled: true }) }));
    await page.waitForFunction(() => document.querySelector('input').checked);
    assert.equal(await page.$('[role=alert]'), null);
    if (process.env.BC_NOTIFICATION_PREVIEW_DIR) {
      const output = path.resolve(process.env.BC_NOTIFICATION_PREVIEW_DIR); fs.mkdirSync(output, { recursive: true });
      const cssDir = path.resolve(__dirname, '../.next/static/css');
      for (const file of fs.readdirSync(cssDir).filter(f => f.endsWith('.css')))
        await page.addStyleTag({ content: fs.readFileSync(path.join(cssDir, file), 'utf8') });
      for (const width of [390, 1280]) {
        await page.setViewport({ width, height: 400 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        await page.screenshot({ path: path.join(output, 'borrower-setting-' + width + '.png') });
      }
    }
  } finally { await browser.close(); }
});
