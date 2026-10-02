const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildSync } = require('esbuild');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
async function addWorkspaceCss(page) {
  // This suite also runs in CI without a Next build. Never silently omit CSS
  // or use stale build output for responsive-layout assertions.
  const postcss = require('postcss');
  const tailwindcss = require('tailwindcss');
  const loadConfig = require('tailwindcss/loadConfig');
  const css = await postcss([tailwindcss(loadConfig(path.resolve('tailwind.config.ts')))])
    .process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  await page.addStyleTag({ content: css.css });
}
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
    await addWorkspaceCss(page);
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
    assert.match(await page.$eval('[data-document-row] td:nth-child(2)', el => el.textContent), /Tom Example.*Lender/);
    assert.equal(await page.$eval('time', el => el.dateTime), '2026-09-25T18:15:00Z');
    const preview = await page.$eval('a[aria-label^="View "]', el => ({ href: el.getAttribute('href'), target: el.target, rel: el.rel }));
    assert.deepEqual(preview, { href: '/api/closings/synthetic%2Ffile/documents/d1/preview', target: '_blank', rel: 'noopener noreferrer' });
    assert.match(await page.$eval('tfoot', el => el.textContent), /850/);
    await page.select('select', '1'); assert.match(await page.$eval('tfoot', el => el.textContent), /800/);
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent === 'Manage sharing').click());
    assert.equal(await page.$eval('fieldset', el => el.closest('td').colSpan), 5, 'Sharing editor spans the document columns');
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
    assert.notEqual(await page.$eval('h2', el => getComputedStyle(el).color), 'rgb(255, 255, 255)', 'White card headings must not inherit the marketing page white text');
    for (const width of [390, 1280]) {
      await page.setViewport({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      if (process.env.BC_WORKSPACE_PREVIEW_DIR) {
        fs.mkdirSync(process.env.BC_WORKSPACE_PREVIEW_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.BC_WORKSPACE_PREVIEW_DIR, `file-workspace-${width}.png`), fullPage: true });
      }
    }
    await page.evaluate(() => {
      for (const version of window.fixture.estimates.versions) {
        version.report = { ...version.report, transactionType: 'refinance', homeValue: 0, loanAmount: 400000 };
      }
      window.mountFile('synthetic-refinance-label');
    });
    await page.waitForFunction(() => document.body.textContent.includes('Loan amount $400,000'));
    assert.doesNotMatch(await page.$eval('body', el => el.textContent), /Refinance.*Loan \$0/);
    await page.evaluate(() => {
      for (const version of window.fixture.estimates.versions) version.report.loanAmount = null;
      window.mountFile('synthetic-legacy-refinance-label');
    });
    await page.waitForFunction(() => document.body.textContent.includes('Loan amount unavailable'));
    assert.equal(requestCount(), 0, 'No live network in this UI test');
  } finally { await browser.close(); }
});

test('many documents use aligned desktop columns and readable mobile rows, preserving every action and status', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f4f6"><main style="max-width:1024px;margin:24px auto;padding:0 16px"><div id="root"></div></main></body></html>');
    await addWorkspaceCss(page);
    const code = buildSync({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import FileWorkspace from './src/components/dashboard/FileWorkspace'; const root=createRoot(document.getElementById('root')); window.mountFile=id=>root.render(React.createElement(FileWorkspace,{closingId:id}));`,
      resolveDir: process.cwd(), sourcefile: 'synthetic-document-columns.tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' } }).outputFiles[0].text;
    const many = structuredClone(fixture);
    many.canManage = false;
    many.documents = Array.from({ length: 24 }, (_, i) => ({ ...many.documents[0], id: `document-${i}`, fileName: `Closing document ${i + 1}.pdf` }));
    many.documents[21] = { ...many.documents[21], fileName: 'LongUnbrokenDocumentName'.repeat(7)+'.pdf', uploadedBy: { name: 'LongUploaderName'.repeat(6), role: 'Lender' } };
    many.documents[22] = { ...many.documents[22], status: 'pending', canConfirm: true, uploadedAt: null };
    many.documents[23] = { ...many.documents[23], status: 'revoked', uploadedAt: null, uploadedBy: undefined };
    await page.evaluate(fixture => {
      window.fixture = fixture; window.calls = [];
      window.fetch = async (url, options) => { window.calls.push({ url, method: options?.method || 'GET' }); return { ok: true, json: async () => structuredClone(window.fixture) }; };
    }, many);
    await page.addScriptTag({ content: code });
    await page.evaluate(() => window.mountFile('synthetic-compact-documents'));
    await page.waitForSelector('[data-document-row]');
    assert.equal(await page.$$eval('[data-document-row]', rows => rows.length), 24);
    assert.deepEqual(await page.$$eval('section[aria-label="Documents"] th', nodes => nodes.map(n => n.textContent.replace(/\s+/g,' ').trim())),
      ['Document', 'Uploaded by', 'Uploaded Your local time', 'Status', 'Actions']);
    assert.equal(await page.$$eval('[data-document-row]:nth-last-child(-n+2) a', nodes => nodes.length), 0, 'Pending and revoked records cannot expose View even with a stale canPreview flag');
    assert.match(await page.$eval('[data-document-row]:nth-last-child(2)', el => el.textContent), /Not confirmed.*Upload not yet confirmed.*Verify upload/);
    assert.match(await page.$eval('[data-document-row]:last-child', el => el.textContent), /Not available.*Not recorded.*Sharing revoked/);
    assert.equal(await page.$$eval('[data-document-row]:last-child button', nodes => nodes.length), 0);
    assert.equal(await page.$$eval('[data-document-row] a', nodes => nodes.length), 22);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewport({ width, height: 1000 });
      const facts = await page.evaluate(() => {
        const row = document.querySelector('[data-document-row]');
        const cells = [...row.cells].map(el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right, bottom:r.bottom }; });
        const headings = [...document.querySelectorAll('section[aria-label="Documents"] th')].map(el => el.getBoundingClientRect().x);
        return { width:document.documentElement.scrollWidth, cells, headings, height:row.getBoundingClientRect().height,
          verticalAlign:[...row.cells].map(el => getComputedStyle(el).verticalAlign),
          contentCenters:[row.cells[2].querySelector('time'), row.cells[4].querySelector('div')].map(el => {
            const r = el.getBoundingClientRect(), c = el.closest('td').getBoundingClientRect();
            return Math.abs((r.top + r.bottom) / 2 - (c.top + c.bottom) / 2);
          }),
          rowDisplay:getComputedStyle(row).display, actionHeight:row.querySelector('a').getBoundingClientRect().height,
          overflow:[...document.querySelectorAll('[data-document-row] td')].some(el => el.scrollWidth > el.clientWidth + 1) };
      });
      assert.equal(facts.width, width, `No page overflow at ${width}px`);
      assert.equal(facts.overflow, false, `No cell overflow, including long names, at ${width}px`);
      if (width >= 768) {
        assert.equal(facts.rowDisplay, 'table-row');
        assert.ok(facts.verticalAlign.every(value => value === 'middle'), 'Every desktop document cell is vertically centered');
        assert.ok(facts.contentCenters.every(delta => delta <= 3), `Short metadata and actions sit at cell centers: ${facts.contentCenters}`);
        assert.ok(facts.cells.every(c => Math.abs(c.y - facts.cells[0].y) < 1), 'All five cells occupy one desktop row');
        assert.ok(facts.cells.every((c,i) => Math.abs(c.x - facts.headings[i]) < 1), 'Columns align with headings');
        if (width >= 1024) assert.ok(facts.height <= 76, `Ordinary lender rows stay compact (${facts.height}px)`);
      } else {
        assert.equal(facts.rowDisplay, 'block');
        assert.ok(facts.cells[1].y >= facts.cells[0].bottom, 'Mobile metadata stacks below the filename');
        assert.ok(facts.actionHeight >= 44, 'Mobile document actions remain touch-sized');
      }
      if (process.env.BC_WORKSPACE_PREVIEW_DIR && [390,1440].includes(width)) {
        fs.mkdirSync(process.env.BC_WORKSPACE_PREVIEW_DIR, { recursive:true });
        await page.screenshot({ path:path.join(process.env.BC_WORKSPACE_PREVIEW_DIR,`document-columns-${width}.png`) });
      }
    }
    assert.ok((await page.evaluate(() => window.calls)).every(c => c.method === 'GET'), 'Layout does not mutate document state');
    assert.equal(requestCount(), 0, 'No live network or customer data in layout checks');
  } finally { await browser.close(); }
});
