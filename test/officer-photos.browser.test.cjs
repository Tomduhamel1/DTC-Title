const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser } = require('./helpers/email-browser.cjs');

const photos = [
  ['Kristen Deyton', 'kdeyton@firstnte.com', 'kristen-deyton-ec0e43a7.jpg'],
  ['Steve Patti', 'steve@firstnte.com', 'steve-patti-7e73be41.jpg'],
  ['Nicole Micciche', 'nmicciche@firstnte.com', 'nicole-micciche-af371149.jpg'],
  ['Brittany Arrington', 'barrington@firstnte.com', 'brittany-arrington-e9d3a3b8.jpg'],
];
const root = path.resolve(__dirname, '..');

test('all approved headshots render on dashboard cards and EO email at desktop/mobile; no live network or messages', async () => {
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: root, input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }), {
    env: { BC_EO_REPLY_ROUTES: JSON.stringify(Object.fromEntries(photos.map(([, email]) => [email, 'synthetic-reply@betterclose.co']))) },
  });
  const policy = h.load('src/lib/closing/notificationPolicy.ts');
  const Card = h.load('src/components/dashboard/EscrowOfficerCard.tsx').default;
  const browser = await openEmailBrowser();
  let forbiddenRequests = 0;
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      const file = photos.find(([, , file]) => request.url() === 'https://betterclose.co/images/escrow-officers/' + file)?.[2];
      if (file) return request.respond({ status: 200, contentType: 'image/jpeg', body: fs.readFileSync(path.join(root, 'public/images/escrow-officers', file)) });
      forbiddenRequests++; return request.abort();
    });
    for (const [name, email, file] of photos) {
      const officer = policy.verifiedOfficer({ escrowOfficerName: name, escrowOfficerEmail: email,
        escrowOfficerPhotoUrl: null, escrowOfficerTitle: 'Escrow Officer', escrowOfficerPhone: null });
      assert.ok(officer);
      await h.load('src/lib/email/eo-introduction.ts').sendEOIntroductionEmail({
        to: 'recipient@example.invalid', propertyAddress: '123 Synthetic Lane', gardenFileNumber: 'SYNTHETIC-001',
        dashboardUrl: 'https://betterclose.example.invalid/teammate/dashboard/synthetic', officer,
      });
      const emailHtml = h.sent.at(-1).htmlBody;
      const card = { ...officer, email, nmls: null };
      const dashboardHtml = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css +
        '</style></head><body><main class="bg-gray-100 p-4 space-y-4">' +
        h.render(React.createElement(Card, { officer: card })) +
        h.render(React.createElement(Card, { officer: card, variant: 'rail' })) + '</main></body></html>';
      for (const width of [375, 800]) for (const [surface, html] of [['email', emailHtml], ['dashboard', dashboardHtml]]) {
        await page.setViewport({ width, height: 1100 });
        await page.setContent(html, { waitUntil: 'load' });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${name} ${surface}: no overflow`);
        const images = await page.$$eval('img', elements => elements.map(el => ({
          alt: el.alt, src: el.src, naturalWidth: el.naturalWidth,
          width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height,
          fit: getComputedStyle(el).objectFit, position: getComputedStyle(el).objectPosition,
        })));
        assert.equal(images.length, surface === 'email' ? 1 : 2);
        for (const image of images) {
          assert.equal(image.alt, name); assert.equal(image.src, officer.photoUrl);
          assert.ok(image.naturalWidth > 300, 'Actual supplied photograph loaded');
          assert.equal(image.width, image.height, 'Circular frame must not distort the headshot');
          assert.equal(image.fit, 'cover'); assert.equal(image.position, '50% 30%');
        }
        if (surface === 'email') assert.equal(images[0].width, 112);
        if (process.env.BC_EO_PHOTO_PREVIEW_DIR) {
          const output = path.resolve(process.env.BC_EO_PHOTO_PREVIEW_DIR); fs.mkdirSync(output, { recursive: true });
          await page.screenshot({ path: path.join(output, `${file.replace('.jpg', '')}-${surface}-${width}.png`), fullPage: true });
        }
      }
    }
    assert.equal(forbiddenRequests, 0);
    assert.equal(h.sent.length, photos.length, 'Only intercepted synthetic messages; no SES dependency');
  } finally { await browser.close(); }
});
