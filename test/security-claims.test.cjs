const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('No database access in security-copy tests'); } });
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/&#x27;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const unsupported = /guaranteed security|bank[- ](?:level|grade)|certified processes|FDIC.insured|advanced security protocols|just as secure|same security|wire fraud prevention|\bHTTPS\b(?!:)|\bSSL\b|encrypted (?:website )?connection|military.grade|SOC.?2|100%.secure/i;

for (const file of [
  'src/app/PageWrapper.tsx', 'src/app/security/page.tsx',
  'src/components/TrustBadges.tsx',
  'src/components/CompanyCredentialsSection.tsx', 'src/components/StorytellingSection.tsx',
]) {
  test(file + ': rendered claims describe specific controls, not guarantees', () => {
    const h = createHarness(noDb);
    const html = h.render(React.createElement(h.load(file).default, {
      homeValue: 300000, state: 'RI', transactionType: 'purchase', estimatedSavings: 360,
    }));
    assert.doesNotMatch(text(html), unsupported);
    assert.doesNotMatch(text(html), /security measures|Your privacy is our priority/);
    assert.equal(h.sent.length, 0);
  });
}

for (const pathname of ['/', '/preview']) {
  test(pathname + ': every retired variant renders the unchanged current homepage', () => {
    const render = searchParams => {
      const h = createHarness(noDb, { pathname, searchParams });
      return h.render(React.createElement(h.load('src/app/PageWrapper.tsx').default));
    };
    const canonical = render('');
    for (const variant of ['ai', 'ai2', 'e', 'credible', 'credible-a', 'credible-b', 'credible-c', 'magic', 'unknown']) {
      assert.equal(render('variant=' + variant + '&ref=synthetic&utm_source=test'), canonical, variant);
    }
    const h = createHarness(noDb);
    assert.equal(canonical, h.render(React.createElement(h.load('src/components/HomePageCredible.tsx').default, { heroVersion: 'magic' })));
    assert.match(source(pathname === '/' ? 'src/app/page.tsx' : 'src/app/preview/page.tsx'), /<PageWrapper\s*\/>/);
  });
}

test('security guidance distinguishes bank transfers and tells users to call their bank first after suspected fraud', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/app/security/page.tsx').default));
  const rendered = text(html);
  assert.match(rendered, /Banks process funds transfers/);
  assert.match(rendered, /A portal message or uploaded document does not verify payment instructions/);
  assert.match(rendered, /phone number you previously verified with your closing team/);
  assert.match(rendered, /contact your sending bank immediately and request a wire recall\. Then notify your closing team/);
  assert.match(rendered, /Recovery is not guaranteed/);
  assert.match(rendered, /Do not wait for a BetterClose email response before contacting your bank/);
  assert.match(html, /href="https:\/\/www\.ic3\.gov\/"/);
  assert.match(html, /href="tel:\+18883780745"/);
  assert.doesNotMatch(rendered, /confirm any wire transfer details|likely fraud|How We Protect You|Security & Fraud Protection/);
});

test('obsolete badge components cannot reintroduce unsupported certifications or blanket escrow coverage', () => {
  const h = createHarness(noDb);
  for (const file of ['TrustBadges', 'CompanyCredentialsSection']) {
    const rendered = text(h.render(React.createElement(h.load('src/components/' + file + '.tsx').default)));
    assert.doesNotMatch(rendered, /FDIC|BBB Accredited|ACCREDITED & CERTIFIED|SSL Secured|licensed in 50|licensed nationwide|compliant in all|fully licensed/i);
  }
});

test('claims regression is part of release checks', () => {
  assert.match(source('.github/workflows/release-typecheck.yml'), /node --test test\/security-claims\.test\.cjs/);
  assert.match(source('.github/workflows/release-typecheck.yml'), /node --test test\/security-claims\.browser\.test\.cjs/);
});

test('footer and search/share metadata use the same specific security wording', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/components/FooterComprehensive.tsx').default));
  const metadata = h.load('src/app/security/layout.tsx').metadata;
  assert.match(text(html), /Security & Wire-Fraud Awareness/);
  assert.match(html, /href="\/security"/);
  assert.match(JSON.stringify(metadata), /Security & Wire-Fraud Awareness/);
  assert.doesNotMatch(text(html) + JSON.stringify(metadata), /Fraud Protection|guaranteed|bank.level/i);
});

test('legacy calculator prompts do not promise equivalent security or blanket remote-signing eligibility', () => {
  for (const component of ['AICalculator', 'AICalculatorModule', 'StoryCalculator']) {
    const content = source('src/components/' + component + '.tsx');
    assert.doesNotMatch(content, unsupported);
    assert.doesNotMatch(content, /just as secure and legally binding/);
    assert.match(content, /if it is available for your transaction/);
    assert.match(content, /Your closing team will confirm your options/);
  }
});

test('homepage has no security sales section and security page offers practical guidance, not feature promotion', () => {
  const h = createHarness(noDb);
  const home = h.render(React.createElement(h.load('src/components/HomePageCredible.tsx').default));
  const page = text(h.render(React.createElement(h.load('src/app/security/page.tsx').default)));
  assert.doesNotMatch(home, /data-security-guidance|Document sharing with clear controls|Before you send funds/);
  assert.doesNotMatch(source('src/components/HomePageCredible.tsx'), /SecurityTrustSection/);
  assert.equal(fs.existsSync(path.join(__dirname, '../src/components/SecurityTrustSection.tsx')), false);
  const footer = h.render(React.createElement(h.load('src/components/FooterComprehensive.tsx').default));
  assert.match(footer, /href="\/security"/, 'Security remains reachable in the footer');
  assert.match(page, /Before you send funds/);
  assert.match(page, /If you suspect wire fraud/);
  assert.match(page, /Keep sign-in links private/);
  assert.match(page, /anyone with the link/);
  assert.doesNotMatch(page, /File-Specific Access|Preview and Download Permissions|Access-Controlled Document Sharing|How File and Document Access Works/);
  assert.doesNotMatch(page, unsupported);
  assert.doesNotMatch(page, /malware.free|unhackable|fraud.proof|zero.risk|certified|compliant with/i);
});

test('public rendering has no HTTPS security promotion, including dormant badge components', () => {
  for (const dir of ['src/components', 'src/app', 'public']) {
    function check(directory) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) check(file);
        else if (/\.(tsx|html|svg)$/.test(entry.name)) {
          const content = fs.readFileSync(file, 'utf8').replace(/https:\/\/[^\s"'<>]+/gi, '');
          assert.doesNotMatch(content, /HTTPS (?:encrypts|between|website)|Encrypted (?:Website )?Connection|>HTTPS</i, file);
        }
      }
    }
    check(path.join(__dirname, '..', dir));
  }
});
