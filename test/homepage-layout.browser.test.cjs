const { test } = require('node:test');
const assert = require('node:assert/strict');
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
      for (const [selector, amount] of [['[data-preview-closing-savings]', '$600'], ['[data-preview-lifetime-savings]', '$1,365']]) {
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
      for (const [label, typical, ours] of [['Notary Fee', '$150', '$140'], ['Attorney Fee', '$50', '$40'], ['Abstractor Title Search', '$100', '$90']]) {
        const row = await page.$eval(`[data-fee-row="${label}"]`, el => ({
          typical: el.querySelector('[data-typical-price]').textContent,
          ours: el.querySelector('[data-betterclose-price]').textContent,
          savings: el.querySelector('[data-line-savings]').textContent,
          color: getComputedStyle(el.querySelector('[data-line-savings] span')).color,
        }));
        assert.deepEqual(row, { typical, ours, savings: '$10', color: 'rgb(4, 120, 87)' }, `${width}: ${label}`);
      }
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
