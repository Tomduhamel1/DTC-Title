// Generate previews from the real send functions with send/DB boundaries mocked.
// All recipients/data are synthetic; browser network requests are aborted.
const fs = require('node:fs');
const path = require('node:path');
const { cases, capture } = require('../test/helpers/email-capture.cjs');
const { openEmailBrowser, offlinePage } = require('../test/helpers/email-browser.cjs');
const out = path.resolve(process.argv[2] || '/tmp/betterclose-email-preview');
const selected = ['welcome', 'borrower-title_ordered', 'sign-in', 'teammate-broker', 'invite-realtor', 'portal-verified', 'quote-savings', 'completed-savings', 'lender-request', 'partner-referral'];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const id of selected) {
      const { sent } = await capture(cases.find(s => s.id === id));
      fs.writeFileSync(path.join(out, id + '.html'), sent[0].htmlBody);
      for (const [label, width] of [['desktop', 800], ['mobile', 375]]) {
        await page.setViewport({ width, height: 1000 });
        await page.setContent(sent[0].htmlBody, { waitUntil: 'domcontentloaded' });
        await page.screenshot({ path: path.join(out, `${id}-${label}.png`), fullPage: true });
      }
    }
    if (requestCount()) throw new Error('Unexpected blocked network request');
    const index = `<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BetterClose email design review</title>
      <style>body{margin:0;background:#f1f5f9;color:#0f172a;font:15px system-ui}header{padding:24px;max-width:1100px;margin:auto}section{max-width:1400px;margin:auto;padding:24px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;border-top:1px solid #cbd5e1}h2{width:100%;margin:0}img{max-width:100%;height:auto;border:1px solid #e2e8f0}a{color:#047857}</style>
      <header><h1>One BetterClose email system</h1><p>Synthetic previews only. No messages sent. Left: desktop. Right: mobile.</p><nav>${selected.map(id => `<a href="#${id}">${id}</a>`).join(' · ')}</nav></header>
      ${selected.map(id => `<section id="${id}"><h2>${id}</h2><img width="640" src="${id}-desktop.png" alt="${id} desktop preview"><img width="300" src="${id}-mobile.png" alt="${id} mobile preview"></section>`).join('')}
      </html>`;
    fs.writeFileSync(path.join(out, 'index.html'), index);
    console.log(`Generated ${selected.length} emails / ${selected.length * 2} images. No live sends or network requests. ${out}/index.html`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
