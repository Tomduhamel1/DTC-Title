const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildSync } = require('esbuild');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const fixture = { enabled: true, uploadsEnabled: true, canManage: true, recipients: [{ id: 'borrower', label: 'Borrower — Alex Example' }, { id: 'lender', label: 'Lender — Tom Example' }],
  documents: [{ id: 'd1', fileName: 'Purchase agreement.pdf', fileSize: 12000, origin: 'participant', status: 'uploaded', revision: 2, recipientUserIds: [], canConfirm: false,
    canPreview: true, uploadedBy: { name: 'Tom Example', role: 'Lender' }, uploadedAt: '2026-09-25T18:15:00Z' }],
  estimates: { closed: false, missingFields: [], basis: { transactionType: 'purchase', zip: '75201', homeValue: 400000, loanAmount: 320000 },
    versions: [1, 2].map(revision => ({ revision, source: 'file_estimate', assumptions: [], createdAt: '2026-09-25T00:00:00Z',
      report: { transactionType: 'purchase', zip: '75201', state: 'TX', homeValue: 400000, loanAmount: 320000,
        lineItems: [{ id: 'settlement', label: 'Settlement fee', ourCost: revision === 1 ? 800 : 850 }], frozenTotals: { ourTotal: revision === 1 ? 800 : 850 } } })) } };
test('actual file workspace shows saved versions, explicit recipients and failure without a false success', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f4f6"><main style="max-width:960px;margin:24px auto;padding:0 16px"><div id="root"></div></main></body></html>');
    const code = buildSync({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import FileWorkspace from './src/components/dashboard/FileWorkspace'; const root=createRoot(document.getElementById('root')); window.mountFile=id=>root.render(React.createElement(FileWorkspace,{closingId:id}));`,
      resolveDir: process.cwd(), sourcefile: 'synthetic-workspace.tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' } }).outputFiles[0].text;
    await page.evaluate(fixture => {
      window.fixture = fixture; window.calls = []; window.fail = false;
      window.fetch = async (url, options) => {
        window.calls.push({ url, body: options?.body ? JSON.parse(options.body) : null });
        if (options?.method === 'POST' && window.pendingScan) return { ok: false, json: async () => ({ error: 'Upload received. The security scan is still running. Use Verify upload shortly. No email was sent.', code: 'DOCUMENT_SCAN_PENDING' }) };
        if (options?.method === 'POST') return { ok: !window.fail, json: async () => window.fail ? { error: 'Sharing could not be saved. No permissions changed.' } : {} };
        return { ok: true, json: async () => structuredClone(window.fixture) };
      };
    }, fixture);
    await page.addScriptTag({ content: code }); await page.evaluate(() => window.mountFile('synthetic/file'));
    await page.waitForSelector('section[aria-label="Documents"]');
    assert.equal((await page.evaluate(() => window.calls)).length, 1);
    assert.equal(await page.evaluate(() => window.calls[0].url), '/api/closings/synthetic%2Ffile/workspace');
    assert.match(await page.$eval('body', el => el.textContent), /not final settlement charges/);
    assert.match(await page.$eval('body', el => el.textContent), /Uploaded by Tom Example · Lender/);
    assert.equal(await page.$eval('time', el => el.dateTime), '2026-09-25T18:15:00Z');
    const preview = await page.$eval('a[aria-label^="View "]', el => ({ href: el.getAttribute('href'), target: el.target, rel: el.rel }));
    assert.deepEqual(preview, { href: '/api/closings/synthetic%2Ffile/documents/d1/preview', target: '_blank', rel: 'noopener noreferrer' });
    assert.match(await page.$eval('tfoot', el => el.textContent), /850/);
    await page.select('select', '1'); assert.match(await page.$eval('tfoot', el => el.textContent), /800/);
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent === 'Manage sharing').click());
    assert.equal(await page.$$eval('input[type=checkbox]', nodes => nodes.filter(n => n.checked).length), 0);
    await page.click('input[type=checkbox]'); await page.evaluate(() => { window.fail = true; [...document.querySelectorAll('button')].find(b => b.textContent === 'Save sharing').click(); });
    await page.waitForSelector('[role=alert]'); assert.equal(await page.$('[role=status]'), null);
    const share = await page.evaluate(() => window.calls.find(c => c.body)?.body);
    assert.deepEqual(share, { action: 'share', documentId: 'd1', revision: 2, recipientUserIds: ['borrower'] });
    await page.evaluate(() => { window.fail = false; [...document.querySelectorAll('button')].find(b => b.textContent === 'Save sharing').click(); });
    await page.waitForSelector('[role=status]');
    // A normal scan wait is a status, not an outage or false success. Refreshing
    // exposes the same pending upload instead of asking for another copy.
    await page.evaluate(() => {
      window.fixture.documents[0] = { ...window.fixture.documents[0], status: 'pending', canConfirm: true, canPreview: false, uploadedAt: null };
      window.mountFile('pending-scan-file');
    });
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent === 'Verify upload'));
    await page.evaluate(() => { window.pendingScan = true; [...document.querySelectorAll('button')].find(b => b.textContent === 'Verify upload').click(); });
    await page.waitForFunction(() => document.querySelector('[role=status]')?.textContent.includes('security scan is still running'));
    assert.equal(await page.$('[role=alert]'), null);
    assert.equal(await page.$$eval('button', nodes => nodes.filter(n => n.textContent === 'Download').length), 0);
    const scanCalls = await page.evaluate(() => window.calls.filter(c => c.url.includes('pending-scan-file')));
    assert.ok(scanCalls.filter(c => !c.body).length >= 2, 'Pending response must refresh the visible list');
    assert.deepEqual(scanCalls.find(c => c.body).body, { action: 'confirm', documentId: 'd1', revision: 2 });
    await page.evaluate(() => {
      window.pendingScan = false; window.fixture.documents[0] = { ...window.fixture.documents[0], status: 'uploaded', canConfirm: false,
        canPreview: true, uploadedAt: '2026-09-25T18:15:00Z' };
      [...document.querySelectorAll('button')].find(b => b.textContent === 'Verify upload').click();
    });
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent === 'Download'));
    const cssDir = path.resolve('.next/static/css');
    if (fs.existsSync(cssDir)) for (const name of fs.readdirSync(cssDir).filter(n => n.endsWith('.css'))) await page.addStyleTag({ content: fs.readFileSync(path.join(cssDir, name), 'utf8') });
    if (fs.existsSync(cssDir)) assert.notEqual(await page.$eval('h2', el => getComputedStyle(el).color), 'rgb(255, 255, 255)', 'White card headings must not inherit the marketing page white text');
    for (const width of [390, 1280]) {
      await page.setViewport({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      if (process.env.BC_WORKSPACE_PREVIEW_DIR) {
        fs.mkdirSync(process.env.BC_WORKSPACE_PREVIEW_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.BC_WORKSPACE_PREVIEW_DIR, `file-workspace-${width}.png`), fullPage: true });
      }
    }
    assert.equal(requestCount(), 0, 'No live network in this UI test');
  } finally { await browser.close(); }
});
