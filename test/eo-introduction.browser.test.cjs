const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./helpers/email-capture.cjs');
const { openEmailBrowser, layoutFacts } = require('./helpers/email-browser.cjs');
const fs = require('node:fs');
const path = require('node:path');

// Synthetic placeholder, not an actual employee photo. No remote image fetch.
const photoUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112"><rect width="112" height="112" fill="#e2e8f0"/><text x="56" y="70" text-anchor="middle" font-size="40" fill="#475569">EO</text></svg>');
const data = { to: 'pro@example.invalid', propertyAddress: '123 Synthetic Lane, Austin, TX',
  gardenFileNumber: 'SYNTHETIC-001', dashboardUrl: 'https://betterclose.example.invalid/teammate/dashboard/synthetic',
  officer: { name: 'Alex Example', title: 'Escrow Officer', photoUrl,
    replyEmail: 'alex.synthetic@betterclose.co', phone: '555-0100' } };
async function capture(input = data, env) {
  const h = createHarness({ env });
  await h.load('src/lib/email/eo-introduction.ts').sendEOIntroductionEmail(input);
  return h.sent;
}
test('EO intro uses shared brand, actual officer reply-to and escaped contact text', async () => {
  const [message] = await capture({ ...data, officer: { ...data.officer, name: '<script>Officer</script> & "Example"' } });
  assert.equal(message.to, data.to);
  assert.equal(message.replyTo, data.officer.replyEmail);
  assert.equal(message.from, undefined, 'Use the centrally verified sender, not an unprovisioned EO sender');
  assert.match(message.htmlBody, /&lt;script&gt;Officer/);
  assert.doesNotMatch(message.htmlBody, /<script/);
  assert.equal((message.htmlBody.match(/data-bc-email=/g) || []).length, 1);
  assert.equal((message.htmlBody.match(/<img /g) || []).length, 1);
  assert.match(message.textBody, /reply without creating an account/);
  assert.match(message.textBody, /Verified sign-in is required only/);
  assert.equal((await capture(data, { AUTH_EMAIL_DRY_RUN: 'true' })).length, 0);
});
test('EO introduction fits desktop and mobile with the photo and no external network', async () => {
  const browser = await openEmailBrowser();
  try {
    const page = await browser.newPage();
    let externalRequests = 0;
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url() === photoUrl) return request.continue(); // inline synthetic fixture only
      externalRequests++; return request.abort();
    });
    const [message] = await capture();
    for (const width of [800, 375, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.setContent(message.htmlBody, { waitUntil: 'load' });
      const f = await layoutFacts(page);
      assert.equal(f.documentWidth, width);
      assert.equal(f.brand, 'BETTERCLOSE'); assert.equal(f.titleFont, '24px');
      assert.equal(f.badElements, 1, 'Only the EO photo; no script or iframe');
      assert.equal(await page.$eval('img', el => el.width), 112);
      assert.equal(await page.$eval('img', el => el.naturalWidth), 112);
      assert.equal(await page.$eval('img', el => el.alt), 'Alex Example');
      assert.match(f.bodyText, /reply directly to this email/);
      if (process.env.BC_NOTIFICATION_PREVIEW_DIR) {
        const output = path.resolve(process.env.BC_NOTIFICATION_PREVIEW_DIR); fs.mkdirSync(output, { recursive: true });
        await page.screenshot({ path: path.join(output, 'eo-introduction-' + width + '.png'), fullPage: true });
      }
    }
    assert.equal(externalRequests, 0);
  } finally { await browser.close(); }
});
