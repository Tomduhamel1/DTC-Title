const puppeteer = require('puppeteer');
const fs = require('node:fs');

async function openEmailBrowser() {
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  // Fresh disposable headless profile; never the user's Chrome profile/session.
  const browser = await puppeteer.launch({ headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (process.platform === 'darwin' && fs.existsSync(macChrome) ? macChrome : undefined),
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
  return browser;
}
async function offlinePage(browser) {
  const page = await browser.newPage();
  let networkRequests = 0;
  await page.setRequestInterception(true);
  page.on('request', request => { networkRequests++; request.abort(); });
  return { page, requestCount: () => networkRequests };
}
async function layoutFacts(page) {
  return page.evaluate(() => {
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, right: r.right, bottom: r.bottom }; };
    const card = document.querySelector('[data-bc-email]');
    const title = document.querySelector('[data-bc-title]');
    const button = document.querySelector('[data-bc-action] a');
    return {
      documentWidth: document.documentElement.scrollWidth, viewport: innerWidth,
      card: rect(card), heading: rect(title),
      titleFont: getComputedStyle(title).fontSize, titleWeight: getComputedStyle(title).fontWeight,
      brand: document.querySelector('[data-bc-brand]').textContent.trim(),
      footer: rect(document.querySelector('[data-bc-footer]')),
      button: button ? { ...rect(button), background: getComputedStyle(button).backgroundColor,
        fontSize: getComputedStyle(button).fontSize, padding: getComputedStyle(button).padding,
        color: getComputedStyle(button).color } : null,
      badElements: document.querySelectorAll('script,iframe,img').length,
      bodyText: document.body.innerText,
    };
  });
}
module.exports = { openEmailBrowser, offlinePage, layoutFacts };
