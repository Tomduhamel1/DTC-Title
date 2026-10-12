import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const disclosure = JSON.parse(await fs.readFile(path.join(root, 'src/lib/marketing-disclosure.json'), 'utf8'))
const browser = await puppeteer.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
const outputs = [
  ['agents-one-pager.html', 'betterclose-for-agents.pdf'],
  ['brokers-one-pager.html', 'betterclose-for-brokers.pdf'],
  ['closing-comparison-guide.html', 'betterclose-closing-comparison-guide.pdf'],
]
try {
  for (const [source, target] of outputs) {
    const page = await browser.newPage()
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 })
    await page.emulateMediaType('print')
    await page.setRequestInterception(true)
    page.on('request', request => request.url().startsWith('file:') || request.url().startsWith('data:')
      ? request.continue() : request.abort())
    await page.goto(pathToFileURL(path.join(root, 'marketing', source)).href, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const facts = await page.evaluate(() => {
      const sheet = document.querySelector('.sheet')
      const elements = [...sheet.querySelectorAll('*')]
      const bounds = sheet.getBoundingClientRect()
      const blocks = [...sheet.children].map(element => element.getBoundingClientRect())
      return {
        text: document.body.innerText,
        width: sheet.scrollWidth,
        height: Math.max(sheet.scrollHeight, ...elements.map(el => el.getBoundingClientRect().bottom - bounds.top)),
        overlap: blocks.some((b, i) => i && b.top < blocks[i - 1].bottom - 1),
        fineFont: parseFloat(getComputedStyle(document.querySelector('.fine')).fontSize),
      }
    })
    for (const phrase of Object.values(disclosure)) assert.ok(facts.text.includes(phrase), `${source}: missing disclosure`)
    assert.doesNotMatch(facts.text, /\bA[\s\u002d\u2010-\u2015]*rated\b|rated A or higher/i)
    assert.ok(facts.width <= 816 && facts.height <= 1056, `${source}: letter-page overflow ${JSON.stringify(facts)}`)
    assert.equal(facts.overlap, false, `${source}: overlapping sections`)
    assert.ok(facts.fineFont >= 10.66, `${source}: disclosure must be at least 8pt`)
    await page.pdf({ path: path.join(root, 'public/pdfs', target), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false })
    console.log(`${target}: disclosure, 8pt minimum and page geometry checked`)
    await page.close()
  }
} finally { await browser.close() }
