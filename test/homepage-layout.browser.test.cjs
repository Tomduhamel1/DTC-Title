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
      assert.match(facts.visible, /BetterClose Bucks/);
      assert.match(facts.visible, /Save at closing/i);
      assert.match(facts.visible, /Save over the life of the loan/i);
      assert.match(facts.visible, /includes closing savings plus modeled interest avoided/);
      for (const [selector, amount] of [['[data-preview-closing-savings]', '$114'], ['[data-preview-lifetime-savings]', '$259']]) {
        const card = await page.$eval(selector, el => {
          const r = el.getBoundingClientRect();
          return { text: el.innerText, width: r.width, height: r.height, fits: el.scrollWidth <= el.clientWidth };
        });
        assert.ok(card.text.includes(amount), `${width}: expected ${amount} visible in ${selector}`);
        assert.doesNotMatch(card.text, /[−-]\$/);
        assert.ok(card.width > 0 && card.height > 0 && card.fits, 'Both savings figures fit visible cards');
      }
      assert.match(facts.notesText, /competing service package/);
      const headers = await page.$$eval('[data-fee-preview-report] > div > div:first-child span', elements => elements.map(el => ({ text: el.innerText, scroll: el.scrollWidth, width: el.clientWidth })));
      assert.ok(headers.every(el => el.scroll <= el.width), `${width}: column labels fit their own cells: ${JSON.stringify(headers)}`);
      for (const item of ["Lender's Title Insurance", 'Settlement Fee', 'Notary Fee', 'Mortgage Recording Fee', 'Satisfaction (Release) Recording Fee', 'Total']) assert.ok(facts.visible.includes(item));
      if (width >= 1024) {
        assert.ok(Math.abs(facts.copy.top - facts.report.top) < 1, 'Left copy starts beside report, not halfway down');
        assert.ok(facts.report.height < 750, `${width}: compact sample height ${facts.report.height}`);
      } else assert.ok(facts.report.top >= facts.copy.bottom, 'Mobile copy precedes the sample');
      await page.focus('summary'); await page.keyboard.press('Enter');
      assert.equal(await page.$eval('details', el => el.open), true);
      assert.match(await page.evaluate(() => document.body.innerText), /competing service package/);
      await page.keyboard.press('Space');
      assert.equal(await page.$eval('details', el => el.open), false);
      if (process.env.BC_HOMEPAGE_SCREENSHOTS && [390, 1280].includes(width)) {
        await page.screenshot({ path: path.join(process.env.BC_HOMEPAGE_SCREENSHOTS, `transparency-${width}.png`), fullPage: true });
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
