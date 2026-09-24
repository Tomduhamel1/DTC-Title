// Optional local visual QA of real server-rendered dashboard bodies exported
// by role-journeys.pg.test.cjs, using this worktree's production-build CSS.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
async function main() {
  assert.ok(process.env.BC_JOURNEY_PREVIEW_DIR, 'Set BC_JOURNEY_PREVIEW_DIR');
  const output = path.resolve(process.env.BC_JOURNEY_PREVIEW_DIR);
  const cssDirectory = path.resolve(__dirname, '../../.next/static/css');
  const css = fs.readdirSync(cssDirectory).filter(file => file.endsWith('.css'))
    .map(file => fs.readFileSync(path.join(cssDirectory, file), 'utf8')).join('\n');
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-background-networking', '--disable-component-update'] });
  try {
    for (const name of ['borrower-two-closings', 'borrower-and-professional']) {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', req => req.abort());
      for (const width of [390, 1280]) {
        await page.setViewport({ width, height: 900 });
        await page.setContent(fs.readFileSync(path.join(output, name + '.html'), 'utf8'));
        await page.addStyleTag({ content: css });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + ': no horizontal page overflow');
        if (name === 'borrower-two-closings') {
          const selected = await page.$eval('select[name="closingId"]', select => select.value);
          const options = await page.$$eval('select[name="closingId"] option', items => items.map(item => item.value));
          assert.equal(options.length, 2);
          await page.select('select[name="closingId"]', options[0]);
          assert.equal(await page.$eval('form', form => new FormData(form).get('closingId')), options[0]);
          await page.select('select[name="closingId"]', selected);
        }
        await page.screenshot({ path: path.join(output, `${name}-${width}.png`) });
      }
      await page.close();
    }
    console.log('Four actual dashboard-body screenshots; no horizontal overflow; file selector posts selected ID. Shared navigation/footer omitted by test harness.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
