// Render the actual client components in Chromium. Only auth/network and page
// chrome are replaced; no real sign-in links are requested or sent.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const puppeteer = require('puppeteer');
const root = path.resolve(process.env.BC_TEST_SOURCE_ROOT || path.join(__dirname, '..'));
let browser;
before(async () => {
  browser = await puppeteer.launch({ headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-background-networking', '--disable-component-update'] });
});
after(async () => { if (browser) await browser.close(); });

async function mount(kind, legacy = false) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => req.abort());
  await page.setContent('<!doctype html><html><body><div id="root"></div></body></html>');
  for (const pkg of ['react', 'react-dom']) {
    await page.addScriptTag({ content: fs.readFileSync(path.join(path.dirname(require.resolve(pkg + '/package.json')),
      'umd', pkg + '.development.js'), 'utf8') });
  }
  const filename = kind === 'welcome' ? 'src/app/welcome/page.tsx' : 'src/components/lender-request/TrackThisClosingPrompt.tsx';
  const code = ts.transpileModule(fs.readFileSync(path.join(root, filename), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  await page.evaluate(({ code, kind, legacy }) => {
    window.calls = [];
    const mod = { exports: {} };
    const query = new URLSearchParams({ email: 'synthetic@example.invalid', ...(!legacy ? { closingId: 'synthetic/closing & one' } : {}) });
    const mocks = {
      react: window.React,
      'next-auth/react': { signIn: (...args) => { window.calls.push(args); return new Promise((resolve, reject) => {
        window.completeSignIn = resolve; window.failSignIn = reject;
      }); } },
      'next/navigation': { useSearchParams: () => query },
      '@/components/NavigationCredible': () => null,
      '@/components/FooterComprehensive': () => null,
    };
    new Function('require', 'module', 'exports', 'sessionStorage', code)(name => {
      if (!Object.hasOwn(mocks, name)) throw new Error('Unexpected dependency: ' + name);
      return mocks[name];
    }, mod, mod.exports, { getItem: key => !legacy && key === 'pendingInviteClaim' ? 'synthetic/claim & one' : null });
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(mod.exports.default,
      kind === 'track' ? { prefilledEmail: 'synthetic@example.invalid' } : {}));
  }, { code, kind, legacy });
  await page.waitForSelector('button[type="submit"]');
  return page;
}

for (const kind of ['welcome', 'track']) {
  test(`${kind}: successful sign-in request retains the exact file/invitation destination`, async () => {
    const page = await mount(kind);
    try {
      await page.click('button[type="submit"]');
      await page.waitForFunction(() => window.calls.length === 1);
      const calls = await page.evaluate(() => window.calls);
      const expected = kind === 'welcome'
        ? '/dashboard?closingId=' + encodeURIComponent('synthetic/closing & one')
        : '/dashboard?claim=' + encodeURIComponent('synthetic/claim & one');
      assert.deepEqual(calls[0], ['email', { email: 'synthetic@example.invalid', callbackUrl: expected, redirect: false }]);
      assert.equal(await page.$eval('input[type="email"]', input => input.disabled), true);
      assert.equal(await page.$eval('button[type="submit"]', button => button.disabled), true);
      await page.evaluate(() => window.completeSignIn({ ok: true, status: 200, error: null }));
      await page.waitForFunction(() => document.body.textContent.includes('Check your email'));
      assert.match(await page.$eval('body', body => body.textContent), /synthetic@example.invalid/);
    } finally { await page.close(); }
  });

  test(`${kind}: legacy entry without a file or claim still requests the generic dashboard`, async () => {
    const page = await mount(kind, true);
    try {
      await page.click('button[type="submit"]');
      await page.waitForFunction(() => window.calls.length === 1);
      assert.equal(await page.evaluate(() => window.calls[0][1].callbackUrl), '/dashboard');
    } finally { await page.close(); }
  });

  for (const outcome of ['provider-error', 'missing-result', 'network-error', 'error-despite-ok']) {
    test(`${kind}: ${outcome} shows an actionable error, not a false delivery confirmation, and can retry`, async () => {
      const page = await mount(kind);
      try {
        await page.click('button[type="submit"]');
        await page.waitForFunction(() => window.calls.length === 1);
        await page.evaluate(async outcome => {
          if (outcome === 'network-error') window.failSignIn(new Error('synthetic internal error'));
          else window.completeSignIn(outcome === 'provider-error' ? { ok: false, error: 'EmailSignin', status: 500 }
            : outcome === 'error-despite-ok' ? { ok: true, error: 'EmailSignin', status: 200 } : undefined);
          await new Promise(resolve => setTimeout(resolve, 50));
        }, outcome);
        const text = await page.$eval('body', body => body.textContent);
        assert.ok(!text.includes('Check your email'), 'Failed request must not look successful');
        assert.ok(!text.includes('synthetic internal error') && !text.includes('EmailSignin'));
        assert.match(await page.$eval('[role="alert"]', alert => alert.textContent), /try again/i);
        assert.equal(await page.$eval('button[type="submit"]', button => button.disabled), false);
        if (process.env.BC_JOURNEY_PREVIEW_DIR && kind === 'welcome' && outcome === 'provider-error') {
          const output = path.resolve(process.env.BC_JOURNEY_PREVIEW_DIR);
          fs.mkdirSync(output, { recursive: true });
          const cssDirectory = path.join(root, '.next/static/css');
          for (const file of fs.readdirSync(cssDirectory).filter(file => file.endsWith('.css'))) {
            await page.addStyleTag({ content: fs.readFileSync(path.join(cssDirectory, file), 'utf8') });
          }
          for (const width of [390, 1280]) {
            await page.setViewport({ width, height: 900 });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await page.screenshot({ path: path.join(output, `welcome-retry-${width}.png`), fullPage: true });
          }
        }
        await page.click('button[type="submit"]');
        await page.waitForFunction(() => window.calls.length === 2);
        await page.evaluate(() => window.completeSignIn({ ok: true, status: 200, error: null }));
        await page.waitForFunction(() => document.body.textContent.includes('Check your email'));
        assert.equal(await page.$('[role="alert"]'), null);
      } finally { await page.close(); }
    });
  }
}
