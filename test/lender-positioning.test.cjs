const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

const h = createHarness(new Proxy({}, { get() { throw new Error('No database access in marketing tests'); } }));
const page = h.load('src/app/for-lenders/page.tsx');
const html = h.render(React.createElement(page.default));
const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
const hero = main.slice(0, main.indexOf('</section>'));

test('lender page leads with real closing services, Encompass and email ordering', () => {
  assert.match(hero, /Your lending workflow/);
  assert.match(hero, /Our closing team/);
  assert.match(hero, /Encompass integration available/);
  assert.match(hero, /Get a quote/);
  assert.match(hero, /href="#place-an-order"/);
  assert.match(main, /id="place-an-order"/);
  assert.match(main, /You don’t need a BetterClose account to send an order/);
  assert.match(main, /Work through Encompass/);
  assert.match(page.metadata.description, /Encompass/);
});

test('unsupported API products, discounts and operational guarantees are not advertised', () => {
  assert.doesNotMatch(main, /API-first|Quick Quote API|Advanced Quote API|TPS integration|api@betterclose|\/api\/quote\/quick|Request API Access|API Documentation|Developer Portal|webhook|volume discount|bulk pricing|compliance reporting|technical account managers|in minutes|SmartFees|Qualia|ResWare/i);
  assert.doesNotMatch(hero, /\bAPI\b/i);
  assert.doesNotMatch(main, /<pre\b|<form\b/);
});

test('custom integration is a secondary inquiry, not a launch promise or access button', () => {
  assert.ok(main.indexOf('Need a custom integration?') > main.indexOf('lender-contact-heading'));
  assert.match(main, /Scope and availability would be agreed separately/);
  assert.match(main, /don’t currently offer self-service API access/);
  const inquiry = [...main.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(href => href.startsWith('mailto:partners@'));
  assert.equal(inquiry.length, 1);
  assert.equal(new URL(inquiry[0]).searchParams.get('subject'), 'Custom lender integration inquiry');
});

test('quote, file access, company phone and order actions point to existing destinations', () => {
  assert.match(main, /href="\/quote\?source=broker"/);
  assert.match(main, /href="\/login\?callbackUrl=\/teammate\/dashboard"/);
  assert.match(main, /href="tel:\+18883780745"/);
  assert.match(main, /Call 888-378-0745/);
  const mailtos = [...main.matchAll(/href="(mailto:[^"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&')));
  const order = mailtos.find(url => url.searchParams.get('subject') === 'New title order');
  assert.equal(order.pathname, 'orders@betterclose.co');
  for (const field of ['Borrower(s):', 'Property address:', 'Loan amount:', 'Lender / loan officer name:']) assert.ok(order.searchParams.get('body').includes(field), field);
  assert.ok(mailtos.some(url => url.pathname === 'orders@betterclose.co' && url.searchParams.get('subject').includes('Encompass')));
  for (const route of ['quote', 'login', 'teammate/dashboard']) assert.ok(fs.existsSync(path.resolve(__dirname, '../src/app', route, 'page.tsx')), route);
});

test('page has semantic landmarks and responsive layout without a new service dependency', () => {
  assert.equal((main.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.match(main, /<ol\b/);
  assert.match(main, /lg:grid-cols-2/);
  assert.match(main, /md:grid-cols-2/);
  assert.match(main, /flex-col gap-3 sm:flex-row/);
  assert.equal(h.sent.length, 0);
});

test('shared mobile share control stays compact without changing its action or accessible name', () => {
  const Nav = h.load('src/components/NavigationCredible.tsx').default;
  const nav = h.render(React.createElement(Nav));
  assert.match(nav, /aria-label="Send to my team"/);
  assert.match(nav, /class="sm:hidden" aria-hidden="true">Share</);
  assert.match(nav, /class="hidden sm:inline" aria-hidden="true">Send to my team</);
  assert.match(nav, /whitespace-nowrap/);
  const source = fs.readFileSync(path.resolve(__dirname, '../src/components/NavigationCredible.tsx'), 'utf8');
  assert.ok(source.includes('onClick={() => setShareOpen(true)}'));
});
