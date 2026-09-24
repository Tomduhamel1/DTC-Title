// Real old/new generator + Chromium, synthetic self-contained content only.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');
const ts = require('typescript');
const root = path.resolve(process.env.BC_PDF_SOURCE_ROOT || path.join(__dirname, '..'));
const sourceRequire = createRequire(path.join(root, 'package.json'));
const puppeteer = sourceRequire('puppeteer');
const output = process.env.BC_PDF_QA_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'betterclose-pdf-'));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{font:14px Arial,sans-serif;color:#172b35;margin:0}h1{font-size:28px;color:#047857}
header{border-bottom:3px solid #047857;padding-bottom:15px;margin-bottom:24px}
table{border-collapse:collapse;width:100%;margin:20px 0}td,th{padding:12px;border-bottom:1px solid #cbd5e1;text-align:left}
th{background:#e8f3ef}td:last-child,th:last-child{text-align:right}.total{font-weight:bold}
.page-two{break-before:page}.note{color:#475569;font-size:12px}
</style></head><body>
<header>BETTERCLOSE<h1>Synthetic PDF compatibility check</h1></header>
<p>File SYNTHETIC-001 | 123 Example Lane, Austin, TX 78701</p>
<table><thead><tr><th>Line item</th><th>Amount</th></tr></thead><tbody>
<tr><td>Settlement service</td><td>600.00</td></tr><tr><td>Recording charge</td><td>132.00</td></tr>
<tr><td>Credit adjustment</td><td>(25.00)</td></tr><tr class="total"><td>Total</td><td>707.00</td></tr></tbody></table>
<p class="note">Synthetic test only. No customer information or actual quote.</p>
<section class="page-two"><header>BETTERCLOSE<h1>Supporting detail</h1></header>
<p>Escrow Officer: Synthetic Officer</p><p>Reply address: officer@example.invalid</p>
<p>Long address: 456 Example Boulevard, Suite 200, Example City, Texas 78701</p>
<table><tr><th>Reference</th><th>Description</th></tr><tr><td>SYNTHETIC-001</td><td>Complete second-page content</td></tr></table>
<p class="note">End of synthetic document.</p></section></body></html>`;

function generator() {
  const browsers = []; let forbidden = 0;
  const module = { exports: {} };
  const actual = puppeteer.default || puppeteer;
  const wrapped = { ...actual, async launch(options) {
    const browser = await actual.launch({ ...options, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [...options.args, '--disable-background-networking', '--disable-component-update'] });
    browsers.push(browser);
    const original = browser.newPage.bind(browser);
    browser.newPage = async () => {
      const page = await original();
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.url().startsWith('data:') || req.url() === 'about:blank') return req.continue();
        forbidden++; return req.abort();
      });
      return page;
    };
    return browser;
  } };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/lib/pdf/generator.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    assert.equal(name, 'puppeteer'); return wrapped;
  }, module, module.exports);
  return { ...module.exports, browsers, forbidden: () => forbidden };
}

for (const kind of ['html', 'url']) test(`actual ${kind} PDF path preserves two-page Letter content and closes Chromium`, async () => {
  const g = generator();
  const pdf = kind === 'html' ? await g.generatePdfFromHtml(html)
    : await g.generatePdfFromUrl({ url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') });
  assert.ok(Buffer.isBuffer(pdf)); assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal(g.forbidden(), 0); assert.equal(g.browsers.length, 1);
  assert.equal(g.browsers[0].connected ?? g.browsers[0].isConnected(), false);
  fs.mkdirSync(output, { recursive: true });
  const file = path.join(output, 'synthetic-' + kind + '.pdf'); fs.writeFileSync(file, pdf);
  const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
  assert.match(info, /Pages:\s+2\b/); assert.match(info, /Page size:\s+612 x 792 pts/);
  const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
  for (const value of ['SYNTHETIC-001', '123 Example Lane', '600.00', '132.00', '(25.00)',
    '707.00', 'Supporting detail', 'officer@example.invalid', 'Complete second-page content', 'End of synthetic document.'])
    assert.ok(text.includes(value), value);
  execFileSync('pdftoppm', ['-scale-to', '1100', '-png', file, path.join(output, 'synthetic-' + kind)]);
});
