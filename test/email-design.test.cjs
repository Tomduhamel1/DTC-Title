const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHarness, capture, invoke, cases, contract, decodeHtml } = require('./helpers/email-capture.cjs');
const baseline = require('./fixtures/email-delivery-contract.json');

test('personal Pro file links explain passwordless access and forwarding risk in both email formats', async () => {
  const h = createHarness();
  const link = 'https://betterclose.example.invalid/file-access/synthetic-file#key=' + 'a'.repeat(64);
  await h.load('src/lib/email/eo-introduction.ts').sendEOIntroductionEmail({
    to: 'pro@example.invalid', propertyAddress: 'Synthetic Access Lane', gardenFileNumber: 'TEST-ONLY',
    dashboardUrl: link, officer: { name: 'Synthetic Officer', title: 'Escrow Officer',
      replyEmail: 'eo@example.invalid', photoUrl: 'https://example.invalid/eo.jpg' },
  });
  await h.load('src/lib/email/closing-update-teammate.ts').sendClosingUpdateTeammateEmail({
    to: 'pro@example.invalid', role: 'lender', milestoneKind: 'title_ordered', teammateDashboardUrl: link,
  });
  assert.equal(h.sent.length, 2);
  for (const message of h.sent) {
    assert.match(message.htmlBody, /View my file/);
    for (const body of [message.htmlBody, message.textBody]) {
      assert.match(body, /No password or account setup needed/);
      assert.match(body, /works once and expires after 24 hours/);
      assert.match(body, /Please don’t forward it/);
      assert.ok(body.includes(link));
      assert.doesNotMatch(body, /Verified sign-in is required/);
    }
  }
});

for (const spec of cases) test(`${spec.id}: shared design and unchanged delivery/content/link contract`, async () => {
  const { sent } = await capture(spec);
  assert.equal(sent.length, 1);
  assert.deepEqual(contract(sent[0]), baseline[spec.id]);
  const html = sent[0].htmlBody;
  assert.equal((html.match(/data-bc-email=/g) || []).length, 1);
  assert.equal((html.match(/data-bc-title/g) || []).length, 1);
  assert.equal((html.match(/data-bc-footer/g) || []).length, 1);
  assert.match(html, /max-width:560px/);
  assert.match(html, /font-size:24px;line-height:32px;font-weight:800/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.doesNotMatch(html, /TrueFee|SUPPORT PHONE TBD|#059669|#16a34a|font-size:26px|font-size:48px|display:\s*grid/);
  if (contract(sent[0]).links.length) {
    assert.equal((html.match(/data-bc-action/g) || []).length, 1);
    assert.match(html, /background:#047857/);
    assert.match(html, /padding:13px 23px/);
  }
});

test('every external template uses the shared layout; internal ops are deliberately excluded', () => {
  const dir = path.resolve(__dirname, '../src/lib/email');
  const actual = fs.readdirSync(dir).filter(name => name.endsWith('.ts') && !name.endsWith('-ops.ts') && name !== 'layout.ts').sort();
  assert.deepEqual(actual, ['broker-portal-welcome.ts', 'broker-quote.ts', 'closing-completed.ts', 'closing-update-teammate.ts', 'closing-update.ts', 'eo-introduction.ts', 'lender-request.ts', 'magic-link.ts', 'partner-referral.ts', 'teammate-invite.ts', 'welcome.ts'].sort());
  for (const name of actual) {
    const source = fs.readFileSync(path.join(dir, name), 'utf8');
    assert.match(source, /renderEmail\(/, name);
    assert.doesNotMatch(source, /<!DOCTYPE|<html|<body|<h1|font-family:/, name);
  }
});

test('brand and button contrast are pinned centrally; signed URLs round-trip exactly', () => {
  const { EMAIL_THEME, emailButton, renderEmail } = createHarness().load('src/lib/email/layout.ts');
  assert.equal(EMAIL_THEME.width, 560);
  assert.equal(EMAIL_THEME.brand, '#047857');
  const url = 'https://betterclose.example.invalid/?token=a%2Bb&email=a%2Bb%40example.invalid&callback=%2Fteammate';
  assert.equal(decodeHtml(emailButton(url, 'Open →').match(/href="([^"]+)"/)[1]), url);
  const html = renderEmail({ title: '<img src=x>', context: 'A & B', contentHtml: '<p>safe</p>' });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img src=x&gt;/);
  assert.match(html, /A &amp; B/);
  const luminance = hex => hex.match(/[0-9a-f]{2}/g).map(v => parseInt(v, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  assert.ok(1.05 / (luminance(EMAIL_THEME.brand) + 0.05) >= 4.5);
});

test('optional fields and hostile contact text cannot inject markup', async () => {
  const hostile = '<img src=x onerror="bad()"> & "Example"';
  for (const spec of cases.filter(s => ['welcome', 'borrower-title_ordered', 'teammate-broker', 'invite-realtor', 'portal-verified', 'quote-savings', 'completed-savings', 'lender-request', 'partner-referral'].includes(s.id))) {
    const data = { ...spec.data };
    for (const key of ['borrowerName', 'borrowerFirstName', 'recipientFirstName', 'propertyAddress', 'placingBorrowerName', 'memberName', 'brokerCompanyName', 'brokerDisplayName', 'lenderFirstName', 'clientName', 'note', 'partnerName', 'leadName', 'notes', 'referralId']) {
      if (Object.hasOwn(data, key)) data[key] = hostile;
    }
    const { sent } = await capture({ ...spec, data });
    assert.doesNotMatch(sent[0].htmlBody, /<img\b|<script\b/);
    assert.match(sent[0].htmlBody, /&lt;img/);
  }
});

test('borrower, professional roles and verified-company copy remain distinct', async () => {
  const html = async id => (await capture(cases.find(s => s.id === id))).sent[0].htmlBody;
  assert.match(await html('borrower-title_ordered'), /Your title order is in/);
  assert.match(await html('teammate-broker'), /Title order opened/);
  assert.match(await html('teammate-broker'), />Broker<\/p>/);
  assert.match(await html('teammate-realtor'), /Real estate agent/);
  assert.doesNotMatch(await html('welcome-broker'), /Your broker from Example/);
  assert.match(await html('welcome-lender'), /Your lender from Example Mortgage/);
  assert.match(await html('portal-verified'), /Your company is verified/);
  assert.match(await html('portal-unverified'), /conversion unlocks once/);
});

test('all existing dry-run gates still prevent sending', async () => {
  for (const spec of cases.filter(s => s.dryRun)) {
    const { sent, returned } = await capture(spec, { env: { AUTH_EMAIL_DRY_RUN: 'true' } });
    assert.equal(sent.length, 0, spec.id);
    assert.equal(returned, spec.id === 'sign-in' ? undefined : null, spec.id);
  }
});

test('SES failure behavior is unchanged; partner legacy boolean is preserved', async () => {
  for (const spec of cases.filter(s => ['welcome', 'borrower-title_ordered', 'invite-broker', 'sign-in', 'lender-request', 'portal-verified'].includes(s.id))) {
    await assert.rejects(capture(spec, { failSend: true }), /Synthetic delivery refusal/);
  }
  const partner = await capture(cases.find(s => s.id === 'partner-referral'), { failSend: true });
  assert.equal(partner.returned, false);
  assert.equal(partner.sent.length, 0);
});

test('real auth provider retains rate limiting and configured sender precedence', async () => {
  const h = createHarness({ env: { APP_AWS_SES_FROM_EMAIL: 'configured@example.invalid', AWS_SES_FROM_EMAIL: 'fallback@example.invalid' } });
  const provider = h.load('src/lib/auth/options.ts').authOptions.providers[0];
  assert.equal(provider.from, 'configured@example.invalid');
  const spec = cases.find(s => s.id === 'sign-in');
  for (let i = 0; i < 5; i++) await invoke(h, spec);
  await assert.rejects(invoke(h, spec), /Too many sign-in requests/);
  assert.equal(h.sent.length, 5);
});

test('real support number is shown only when configured, in HTML and plain text', async () => {
  const spec = cases.find(s => s.id === 'welcome');
  const { sent } = await capture(spec, { mocks: { '@/lib/contact': { SUPPORT_PHONE_DISPLAY: '(212) 555-0100', SUPPORT_PHONE_TEL: '2125550100' } } });
  assert.match(sent[0].htmlBody, /or call \(212\) 555-0100/);
  assert.match(sent[0].textBody, /or call \(212\) 555-0100/);
});

test('HTML savings preserve computed and frozen amounts, including absent and zero values', async () => {
  const rendered = async id => (await capture(cases.find(s => s.id === id))).sent[0].htmlBody;
  assert.match(await rendered('quote-savings'), />\$400<\/div>/);
  const completed = await rendered('completed-savings');
  assert.match(completed, />\$400<\/div>/);
  assert.match(completed, />\$910<\/div>/);
  for (const id of ['quote-no-fees', 'quote-malformed', 'quote-zero', 'completed-no-fees']) {
    assert.doesNotMatch(await rendered(id), /data-bc-panel/, id);
  }
  assert.match(await rendered('completed-zero'), />\$0<\/div>/);
  for (const id of ['quote-savings', 'completed-savings']) {
    const spec = cases.find(s => s.id === id);
    const frozenTotals = { estimatedSavings: 725, lifetimeSavings: 1649 };
    const { sent } = await capture({ ...spec, data: { ...spec.data,
      feeReport: { ...spec.data.feeReport, frozenTotals } } });
    assert.match(sent[0].htmlBody, />\$725<\/div>/, id);
    assert.doesNotMatch(sent[0].htmlBody, />\$400<\/div>/, id);
    assert.match(sent[0].textBody, /\$725/, id);
    if (id === 'completed-savings') {
      assert.match(sent[0].htmlBody, />\$1,649<\/div>/);
      assert.match(sent[0].textBody, /\$1,649/);
    }
  }
});

test('referral HTML retains every contact, loan and notes field after the table conversion', async () => {
  const html = (await capture(cases.find(s => s.id === 'partner-referral'))).sent[0].htmlBody;
  for (const field of ['SYNTHETIC-REFERRAL', 'Morgan Example', 'borrower@example.invalid',
    '212-555-0100', 'Email', 'Good (670-739)', 'Single Family', 'Primary Residence',
    '30 Year Fixed', '$320,000', '20%', 'Please contact by email.']) {
    assert.ok(html.includes(field), field);
  }
});
