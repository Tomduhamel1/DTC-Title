const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const root = path.resolve(__dirname, '..');
const h = createHarness(new Proxy({}, { get() { throw Error('No database access'); } }));
const display = '888-378-0745';
const tel = 'tel:+18883780745';

test('owner-supplied company phone is centralized and old public numbers are absent', () => {
  assert.deepEqual(h.load('src/lib/contact.ts'), { SUPPORT_PHONE_DISPLAY: display, SUPPORT_PHONE_TEL: '+18883780745' });
  for (const dir of ['src', 'marketing']) {
    const visit = folder => {
      for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) visit(file);
        else if (/\.(tsx?|html)$/.test(file)) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /800[-. ]?316[-. ]?9508|\(401\) 847-3080|SUPPORT PHONE TBD/, file);
      }
    };
    visit(path.join(root, dir));
  }
});

for (const file of ['NavigationCredible', 'FooterComprehensive', 'quote/CalculatorUnresponsiveNotice', 'dashboard/ContactRail']) {
  test(`${file} shows the new phone and a matching call link`, () => {
    const Component = h.load(`src/components/${file}.tsx`).default;
    const html = h.render(React.createElement(Component));
    assert.ok(html.includes(display));
    assert.ok(html.includes(`href="${tel}"`));
  });
}

test('officer cards use the company line and preserve the top of the portrait', () => {
  const Component = h.load('src/components/dashboard/EscrowOfficerCard.tsx').default;
  for (const variant of ['main', 'rail']) {
    const officer = { name: 'Synthetic Officer', title: 'Escrow Officer', email: 'eo@example.invalid', phone: '212-555-0100', photoUrl: '/portrait.jpg', nmls: null };
    const html = h.render(React.createElement(Component, { officer, variant }));
    assert.ok(html.includes(display)); assert.ok(html.includes(`href="${tel}"`));
    assert.doesNotMatch(html, /212-555-0100|center_30%/);
    assert.match(html, /object-cover object-top/);
    assert.equal(officer.phone, '212-555-0100', 'Display-only; source contact record is not mutated');
  }
});

test('officer email retains identity and reply routing with new phone and top-aligned portrait', async () => {
  await h.load('src/lib/email/eo-introduction.ts').sendEOIntroductionEmail({
    to: 'tom@example.invalid', propertyAddress: '100 Synthetic Lane', gardenFileNumber: 'TEST-ONLY',
    dashboardUrl: 'https://betterclose.example.invalid/teammate/dashboard/test',
    officer: { name: 'Brittany — TEST ONLY', title: 'TEST Escrow Officer', replyEmail: 'eo-test@betterclose.co', photoUrl: 'https://betterclose.co/images/escrow-officers/brittany-arrington-e9d3a3b8.jpg', phone: '212-555-0100' },
  });
  const message = h.sent.at(-1);
  assert.equal(message.to, 'tom@example.invalid'); assert.equal(message.replyTo, 'eo-test@betterclose.co');
  assert.match(message.htmlBody, /object-position:center top/);
  assert.ok(message.htmlBody.includes(`href="${tel}"`));
  for (const body of [message.htmlBody, message.textBody]) {
    assert.ok(body.includes(display)); assert.ok(body.includes('Brittany — TEST ONLY'));
    assert.doesNotMatch(body, /212-555-0100/);
  }
});
