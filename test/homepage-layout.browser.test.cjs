const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { build } = require('esbuild');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');
const root = path.resolve(__dirname, '..');
const css = require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root, 'tailwind.config.ts')))])
  .process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined }).then(result => result.css);
const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
const pageHtml = (styles, body) => '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + styles + '</style></head><body>' + body + '</body></html>';

test('mobile opening leads with savings and a first-screen quote action, with reassurance after the service proposition', async () => {
  const Nav = h.load('src/components/NavigationCredible.tsx').default;
  const Hero = h.load('src/components/HeroMagicReveal.tsx').default;
  const Provider = h.load('src/contexts/SavingsContext.tsx').SavingsProvider;
  const markup = h.render(React.createElement(React.Fragment, null,
    React.createElement(Nav), React.createElement('div', { className: 'h-20' }),
    React.createElement(Provider, null, React.createElement(Hero))))
    .replaceAll('/images/marketing/nicole-operator-v1.webp', 'data:image/webp;base64,' +
      fs.readFileSync(path.join(root, 'public/images/marketing/nicole-operator-v1.webp')).toString('base64'));
  const browser = await openEmailBrowser();
  try {
    const { page } = await offlinePage(browser);
    for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 900], [1280, 900], [1440, 900]]) {
      await page.setViewport({ width, height });
      await page.setContent(pageHtml(await css, markup));
      const facts = await page.evaluate(() => {
        const box = selector => { const e = document.querySelector(selector), r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height, width: r.width, text: e.innerText }; };
        return { width: document.documentElement.scrollWidth, header: box('[data-bc-marketing-nav]'),
          hero: box('[data-home-hero]'), title: box('h1'), description: box('[data-hero-description]'),
          reassurance: box('[data-hero-reassurance]'), action: box('[data-hero-mobile-action]'),
          actionLink: box('[data-hero-mobile-action] a'), calculator: box('[data-hero-calculator]'),
          quoteHref: document.querySelector('[data-hero-mobile-action] a').getAttribute('href'),
          titleFirst: document.querySelector('[data-hero-copy]').firstElementChild.tagName === 'H1',
          overflow: [...document.querySelectorAll('[data-home-hero] h1, [data-home-hero] [data-savings-card]')]
            .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.innerText),
          text: document.querySelector('[data-hero-copy]').innerText };
      });
      assert.equal(facts.width, width, `${width}: no horizontal overflow`);
      assert.deepEqual(facts.overflow, [], `${width}: title and savings cards fit`);
      assert.equal(facts.header.height, 80, 'Shared site navigation keeps its stable height');
      assert.ok(facts.titleFirst, 'A contextless badge must not precede the value proposition');
      assert.equal(facts.title.text.replace(/\s+/g, ' ').trim(), "Don't overpay for closing costs. Save hundreds.", 'Preserve the approved headline exactly');
      assert.match(facts.description.text, /title and settlement at a lower cost/);
      assert.ok(facts.reassurance.top >= facts.description.bottom, 'Keep your team only follows the service/value explanation');
      assert.doesNotMatch(facts.text, /helps you save|Same realtor|A-rated/);
      if (width < 1024) {
        assert.ok(facts.actionLink.height >= 44 && facts.actionLink.width > 0, 'Comfortable touch target');
        assert.equal(facts.quoteHref, '/quote');
        assert.ok(facts.action.top > facts.reassurance.bottom, 'Savings action follows context and reassurance');
        assert.ok(facts.action.bottom <= height, `${width}: estimate action and no-obligation caption fit the first screen: ${facts.action.bottom}`);
        assert.ok(facts.calculator.top >= facts.action.bottom, 'Detailed calculator follows the quick action');
        assert.ok(facts.title.top - facts.header.bottom <= 64, 'Opening is not buried below empty space');
        await page.focus('[data-hero-mobile-action] a');
        assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'See my savings →');
      } else {
        assert.equal(facts.action.height, 0, 'No extra CTA competes with the desktop calculator');
        assert.ok(Math.abs(facts.calculator.top - facts.hero.top) <= 65, 'Desktop retains the two-column hero');
      }
      if (process.env.BC_HOMEPAGE_SCREENSHOTS && [390, 1280].includes(width)) {
        await page.mouse.click(width - 1, height - 1);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(process.env.BC_HOMEPAGE_SCREENSHOTS, `opening-${width}.png`) });
      }
    }
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});

test('Full Transparency has top-aligned columns, a compact complete sample and accessible notes below both columns', async () => {
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    const Section = h.load('src/components/FeeReportPreviewSection.tsx').default;
    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent(pageHtml(await css, h.render(React.createElement(Section))));
      const facts = await page.evaluate(() => {
        const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
        return { pageWidth: document.documentElement.scrollWidth, grid: box('[data-fee-preview-grid]'),
          copy: box('[data-fee-preview-copy]'), report: box('[data-fee-preview-report]'), notes: box('details'),
          open: document.querySelector('details').open, notesInGrid: !!document.querySelector('[data-fee-preview-grid] details'),
          visible: document.body.innerText, notesText: document.querySelector('details').textContent };
      });
      assert.equal(facts.pageWidth, width, `${width}: no horizontal overflow`);
      assert.equal(facts.open, false);
      assert.equal(facts.notesInGrid, false);
      assert.ok(facts.notes.top >= facts.grid.bottom, 'Notes follow both columns');
      assert.ok(facts.notes.height < 110, 'Collapsed notes do not dominate the screen');
      assert.doesNotMatch(facts.visible, /competing service package|better loan pricing/);
      assert.doesNotMatch(facts.visible, /purchase in Providence|Calculated with our quote engine|This example saves|in service fees plus/);
      assert.match(facts.visible, /BetterClose Bucks/);
      assert.match(facts.visible, /Save at closing/i);
      assert.match(facts.visible, /Save over the life of the loan/i);
      assert.match(facts.visible, /includes closing savings plus modeled interest avoided/);
      for (const [selector, amount] of [['[data-preview-closing-savings]', '$710'], ['[data-preview-lifetime-savings]', '$1,616']]) {
        const card = await page.$eval(selector, el => {
          const r = el.getBoundingClientRect();
          const amount = el.querySelector('[data-savings-amount]');
          const style = getComputedStyle(amount);
          const cardStyle = getComputedStyle(el);
          return { text: el.innerText, width: r.width, height: r.height, fits: el.scrollWidth <= el.clientWidth,
            background: cardStyle.backgroundColor, border: cardStyle.borderColor, radius: cardStyle.borderRadius, align: cardStyle.textAlign,
            color: style.color, weight: Number(style.fontWeight), fontSize: parseFloat(style.fontSize) };
        });
        assert.ok(card.text.includes(amount), `${width}: expected ${amount} visible in ${selector}`);
        assert.doesNotMatch(card.text, /[−-]\$/);
        assert.ok(card.width > 0 && card.height > 0 && card.fits, 'Both savings figures fit visible cards');
        assert.equal(card.color, 'rgb(5, 150, 105)', 'Savings use the calculator green');
        assert.equal(card.background, 'rgb(236, 253, 245)', 'Cards use the calculator pale-green background');
        assert.equal(card.border, 'rgb(167, 243, 208)');
        assert.equal(card.radius, '16px');
        assert.equal(card.align, 'center');
        assert.match(card.text, selector.includes('closing') ? /Title & settlement/ : /Includes at-closing savings/);
        assert.ok(card.weight >= 800 && card.fontSize >= 30, 'Savings amounts retain strong type emphasis');
      }
      if (width >= 380) {
        const amountTops = await page.$$eval('[data-preview-savings-summary] [data-savings-amount]', els => els.map(el => el.getBoundingClientRect().top));
        assert.ok(Math.abs(amountTops[0] - amountTops[1]) < 1, 'Side-by-side savings amounts align even when the captions wrap');
      }
      assert.match(facts.notesText, /competing service package/);
      const emphasis = await page.evaluate(() => ({
        summaryBackground: getComputedStyle(document.querySelector('[data-preview-savings-summary]')).backgroundColor,
        ctaBackground: getComputedStyle(document.querySelector('[data-fee-preview-copy] a[href="/quote"]')).backgroundColor,
      }));
      assert.equal(emphasis.summaryBackground, 'rgba(0, 0, 0, 0)', 'Savings summary is not a competing filled CTA');
      assert.notEqual(emphasis.ctaBackground, emphasis.summaryBackground, 'Estimate button keeps the primary emphasis');
      const creditLabel = await page.$eval('[data-fee-row="BetterClose Bucks"]', el => el.innerText);
      assert.match(creditLabel, /CREDIT/);
      assert.doesNotMatch(creditLabel, /\bNEW\b/);
      for (const [label, typical, ours, savings] of [['Notary Fee', '$150', '$135', '−$15'], ['Attorney Fee', '$50', '$40', '−$10'], ['Abstractor Title Search', '$100', '$90', '−$10']]) {
        const row = await page.$eval(`[data-fee-row="${label}"]`, el => ({
          typical: el.querySelector('[data-typical-price]').textContent,
          ours: el.querySelector('[data-betterclose-price]').textContent,
          savings: el.querySelector('[data-line-savings]').textContent,
          color: getComputedStyle(el.querySelector('[data-line-savings] span')).color,
        }));
        assert.deepEqual(row, { typical, ours, savings, color: 'rgb(4, 120, 87)' }, `${width}: ${label}`);
      }
      assert.equal(await page.$eval('[data-total-savings]', el => el.textContent), '−$710');
      assert.equal(await page.$eval('[data-fee-row="BetterClose Bucks"] [data-line-savings]', el => el.textContent), '−$535');
      assert.equal(await page.$eval('[data-fee-row="Settlement Fee"] [data-line-savings]', el => el.textContent), '−$140');
      assert.ok(facts.visible.indexOf('BetterClose Bucks', facts.visible.indexOf('TITLE & SETTLEMENT')) < facts.visible.indexOf('RECORDING FEES'), 'Bucks appears before recording fees');
      const headers = await page.$$eval('[data-fee-preview-report] > div > div:first-child span', elements => elements.map(el => ({ text: el.innerText, scroll: el.scrollWidth, width: el.clientWidth })));
      assert.ok(headers.every(el => el.scroll <= el.width), `${width}: column labels fit their own cells: ${JSON.stringify(headers)}`);
      const columnLabels = await page.$$eval('[data-fee-preview-report] > div > div:first-child > span', elements => elements.map(el => el.textContent.trim()));
      assert.deepEqual(columnLabels, ['Item', 'Market', 'BetterClose', 'Savings']);
      const report = h.load('src/lib/sampleReport.ts').buildSampleFeeReport();
      for (const item of report.lineItems) assert.ok(facts.visible.includes(item.label), `${width}: ${item.label} visible`);
      if (width >= 1024) {
        assert.ok(Math.abs(facts.copy.top - facts.report.top) < 1, 'Left copy starts beside report, not halfway down');
        // Offline rendering uses OS fallback fonts, not next/font's production Inter.
        // Allow one extra wrapped line on Linux while still bounding the complete report.
        assert.ok(facts.report.height < 800, `${width}: compact sample height ${facts.report.height}`);
      } else assert.ok(facts.report.top >= facts.copy.bottom, 'Mobile copy precedes the sample');
      await page.focus('summary'); await page.keyboard.press('Enter');
      assert.equal(await page.$eval('details', el => el.open), true);
      assert.match(await page.evaluate(() => document.body.innerText), /competing service package/);
      await page.keyboard.press('Space');
      assert.equal(await page.$eval('details', el => el.open), false);
      if (process.env.BC_HOMEPAGE_SCREENSHOTS && [390, 1280].includes(width)) {
        const section = await page.$('section');
        await section.screenshot({ path: path.join(process.env.BC_HOMEPAGE_SCREENSHOTS, `transparency-${width}.png`) });
        if (width === 1280) {
          const savings = await page.$('[data-preview-savings-summary]');
          await savings.screenshot({ path: path.join(process.env.BC_HOMEPAGE_SCREENSHOTS, 'savings-cards-desktop.png') });
        }
      }
    }
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});

test('calculator uses In your area, handles unavailable/unknown locations and keeps team savings synchronized', async () => {
  const script = await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
    import Hero from './src/components/HeroMagicReveal'; import Team from './src/components/TeamTrustSection';
    import {SavingsProvider} from './src/contexts/SavingsContext';
    let instance=0; const root=createRoot(document.getElementById('root'));
    window.mount=location=>{window.fetch=async url=>{if(url!='/api/geo') throw new Error('Network forbidden');
      if(location==='fail') throw new Error('Synthetic failed geo'); return {json:async()=>location};};
      root.render(<SavingsProvider key={++instance}><Hero/><Team/></SavingsProvider>);};`,
    resolveDir: root, sourcefile: 'synthetic-homepage.tsx', loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'offline-link', setup(builder) {
      builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'next/link', namespace: 'mock' }));
      builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: `import React from 'react'; export default ({children,...props})=><a {...props}>{children}</a>`, loader: 'tsx', resolveDir: root }));
    }}] });
  const browser = await openEmailBrowser();
  const { estimateSavings } = h.load('src/lib/stateSavings.ts');
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [390, 1280]) {
      await page.setViewport({ width, height: 900 });
      await page.setContent(pageHtml(await css, '<div id="root"></div>'));
      await page.addScriptTag({ content: script.outputFiles[0].text });
      for (const location of [{ state: 'TX', city: 'Dallas' }, { state: 'CA', city: 'Los Angeles' }, 'fail']) {
        await page.evaluate(value => window.mount(value), location);
        await page.waitForFunction(expected => document.body.textContent.includes(expected), {}, location === 'fail' ? 'Choose your state' : location.state === 'CA' ? 'CA not yet available' : 'Buyers in your area typically save');
        const body = await page.evaluate(() => document.body.innerText);
        assert.match(body, /In your area:/);
        assert.match(body, /Save hundreds\./);
        assert.doesNotMatch(body, /📍|Auto-detected|Save thousands|[−-]\$/);
        if (location !== 'fail' && location.state === 'CA') assert.doesNotMatch(body, /Buyers in your area typically save/i);
        const savings = estimateSavings(500000, 'purchase', location === 'fail' ? null : location.state);
        await page.waitForFunction(value => document.querySelectorAll('section')[1].innerText.includes('$' + value.toLocaleString() + ' in estimated savings'), {}, savings.saveAtClosing);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      }
      // Manual location selection and switching purchase/refinance retain real model outputs.
      await page.evaluate(() => [...document.querySelectorAll('button')].find(el => el.textContent === 'Choose your state').click());
      await page.select('[aria-label="Your state"]', 'TX');
      await page.waitForFunction(() => document.body.textContent.includes('Buyers in your area typically save'));
      await page.evaluate(() => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === 'done').click());
      await page.evaluate(() => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === 'Refinance').click());
      await page.waitForSelector('[aria-label="Home value"]');
      await page.focus('input[type="range"]'); await page.keyboard.press('ArrowRight');
      const savings = estimateSavings(525000, 'refinance', 'TX');
      await page.waitForFunction(value => document.querySelectorAll('section')[1].innerText.includes('$' + value.toLocaleString() + ' in estimated savings'), {}, savings.saveAtClosing);
      assert.match(await page.evaluate(() => document.body.innerText), /Refinancings in your area typically save/i);
      assert.equal(await page.$eval('input[type="range"]', el => el.value), '525000');
      if (process.env.BC_HOMEPAGE_SCREENSHOTS) await page.screenshot({ path: path.join(process.env.BC_HOMEPAGE_SCREENSHOTS, `hero-team-${width}.png`), fullPage: true });
    }
    assert.equal(requestCount(), 0);
  } finally { await browser.close(); }
});
