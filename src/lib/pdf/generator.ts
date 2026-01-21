import puppeteer from 'puppeteer'

export interface GeneratePdfOptions {
  url: string
  timeout?: number
}

/**
 * Generate a PDF from a URL using Puppeteer
 */
export async function generatePdfFromUrl({
  url,
  timeout = 30000,
}: GeneratePdfOptions): Promise<Buffer> {
  let browser

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
    })

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout,
    })

    // Generate PDF
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      preferCSSPageSize: false,
    })

    return Buffer.from(pdf)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Generate PDF from HTML string
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  let browser

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    await page.setViewport({
      width: 1200,
      height: 1600,
    })

    // Set HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Generate PDF
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    })

    return Buffer.from(pdf)
  } catch (error) {
    console.error('Error generating PDF from HTML:', error)
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
