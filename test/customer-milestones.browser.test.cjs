const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const { openEmailBrowser, offlinePage } = require('./helpers/email-browser.cjs');

test('actual four-stage timeline fits desktop/mobile and completes despite a pending loan lock', async () => {
  const h = createHarness(new Proxy({}, { get() { throw new Error('No database access'); } }));
  const Timeline = h.load('src/components/dashboard/MilestoneTimeline.tsx').default;
  const { MILESTONE_KINDS } = h.load('src/lib/closing.ts');
  const css = execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--minify'], {
    cwd: path.resolve(__dirname, '..'), input: '@tailwind base; @tailwind components; @tailwind utilities;', encoding: 'utf8',
  });
  const browser = await openEmailBrowser();
  try {
    const { page, requestCount } = await offlinePage(browser);
    for (const width of [375, 1280]) for (const complete of [false, true]) {
      const milestones = MILESTONE_KINDS.map(kind => ({ kind,
        status: kind === 'loan_locked' ? 'pending' : complete || kind === 'title_ordered' ? 'done' : 'pending' }));
      const html = h.render(React.createElement(Timeline, { milestones }));
      await page.setViewport({ width, height: 900 });
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css +
        '</style></head><body><main class="bg-gray-100 p-4 max-w-5xl mx-auto">' + html + '</main></body></html>');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.$$eval('ol > li', rows => rows.length), 4);
      assert.equal(await page.$eval('h3', el => el.textContent), complete ? 'Closed!' : '1 of 4 milestones complete');
      assert.doesNotMatch(await page.$eval('body', el => el.innerText), /loan.locked|interest rate/i);
      assert.equal(await page.$eval('div.transition-all', el => el.style.height), complete ? '100%' : '25%');
      const boxes = await page.$$eval('ol > li', rows => rows.map(el => {
        const r = el.getBoundingClientRect(); return { x: r.x, right: r.right, height: r.height };
      }));
      assert.ok(boxes.every(box => box.x >= 0 && box.right <= width && box.height > 0));
      if (process.env.BC_MILESTONE_PREVIEW_DIR) await page.screenshot({
        path: path.join(process.env.BC_MILESTONE_PREVIEW_DIR, `timeline-${width}-${complete ? 'closed' : 'ordered'}.png`), fullPage: true,
      });
    }
    assert.equal(requestCount(), 0);
    assert.equal(h.sent.length, 0);
  } finally { await browser.close(); }
});
