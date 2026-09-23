const { test } = require('node:test');
const assert = require('node:assert/strict');
const { cases, receiptCases, capture } = require('./helpers/email-capture.cjs');
const { openEmailBrowser, offlinePage, layoutFacts } = require('./helpers/email-browser.cjs');

test('all 40 real email variants have matching desktop/mobile chrome without overflow or external requests', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    let checked = 0;
    for (const spec of [...cases, ...receiptCases]) {
      const { sent } = await capture(spec);
      for (const width of [800, 375, 320]) {
        await page.setViewport({ width, height: 1000 });
        await page.setContent(sent[0].htmlBody, { waitUntil: 'domcontentloaded' });
        const f = await layoutFacts(page);
        assert.equal(f.documentWidth, width, `${spec.id} ${width}: horizontal overflow`);
        assert.ok(f.card.width <= 560 && f.card.right <= width, spec.id);
        assert.equal(f.heading.x, f.card.x + (width <= 600 ? 25 : 33), spec.id);
        assert.equal(f.titleFont, '24px', spec.id);
        assert.equal(f.titleWeight, '800', spec.id);
        assert.equal(f.brand, 'BETTERCLOSE', spec.id);
        assert.ok(f.footer.y > f.heading.bottom, spec.id);
        assert.equal(f.badElements, 0, spec.id);
        if (f.button) {
          assert.equal(f.button.background, 'rgb(4, 120, 87)', spec.id);
          assert.equal(f.button.color, 'rgb(255, 255, 255)', spec.id);
          assert.equal(f.button.fontSize, '15px', spec.id);
          assert.equal(f.button.padding, '13px 23px', spec.id);
          assert.ok(f.button.right <= f.card.right, spec.id);
        }
        checked++;
      }
    }
    assert.equal(checked, 120);
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});

test('long contact fields stay readable at 320px even when an email client strips head styles', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    await page.setViewport({ width: 320, height: 1000 });
    for (const id of ['welcome', 'receipt', 'teammate-realtor', 'portal-verified', 'partner-referral']) {
      const spec = [...cases, ...receiptCases].find(s => s.id === id);
      const long = 'LongSyntheticName'.repeat(18);
      const data = { ...spec.data, propertyAddress: long, borrowerName: long, memberName: long, leadEmail: long + '@example.invalid', notes: long };
      const { sent } = await capture({ ...spec, data });
      await page.setContent(sent[0].htmlBody.replace(/<style>[\s\S]*?<\/style>/, ''), { waitUntil: 'domcontentloaded' });
      assert.equal((await layoutFacts(page)).documentWidth, 320, id);
    }
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});
