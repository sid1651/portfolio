import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const baseUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173'
const outputDir = process.env.PORTFOLIO_QA_DIR ?? '/tmp/portfolio-visual-qa'
mkdirSync(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const errors = []

const watchErrors = (page, label) => {
  page.on('pageerror', (error) => errors.push(`${label}: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label}: ${message.text()}`)
  })
}

const traversePage = async (page) => {
  const viewportHeight = page.viewportSize()?.height ?? 900
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < pageHeight; y += Math.round(viewportHeight * 0.72)) {
    await page.evaluate((position) => window.scrollTo(0, position), y)
    await page.waitForTimeout(90)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(220)
}

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
  })
  const desktopPage = await desktop.newPage()
  watchErrors(desktopPage, 'desktop')
  await desktopPage.goto(baseUrl, { waitUntil: 'networkidle' })

  await desktopPage.getByRole('navigation', { name: 'Main navigation' }).waitFor()
  await desktopPage.getByRole('heading', { level: 1, name: 'Narava Venkat Siddharth' }).waitFor()
  assert.equal(await desktopPage.locator('html').getAttribute('data-theme'), 'light')
  assert.equal(await desktopPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true)

  await traversePage(desktopPage)
  await desktopPage.screenshot({ path: `${outputDir}/desktop-light.png`, fullPage: true })
  await desktopPage.getByRole('button', { name: 'Close window shade for dark mode' }).click()
  assert.equal(await desktopPage.locator('html').getAttribute('data-theme'), 'dark')
  assert.equal(await desktopPage.evaluate(() => localStorage.getItem('siddharth-air:theme')), 'dark')
  await desktopPage.waitForTimeout(650)
  await desktopPage.screenshot({ path: `${outputDir}/desktop-dark.png`, fullPage: true })

  await desktopPage.getByRole('link', { name: 'Read LumaLoop case study' }).click()
  await desktopPage.waitForURL('**/work/lumaloop')
  await desktopPage.getByRole('main', { name: 'LumaLoop case study' }).waitFor()
  await desktopPage.getByRole('link', { name: 'View live project' }).waitFor()
  await traversePage(desktopPage)
  await desktopPage.screenshot({ path: `${outputDir}/case-study.png`, fullPage: true })
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
  })
  const mobilePage = await mobile.newPage()
  watchErrors(mobilePage, 'mobile')
  await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' })
  await traversePage(mobilePage)
  await mobilePage.getByRole('button', { name: 'Open navigation menu' }).click()
  await mobilePage.getByRole('link', { name: 'Work', exact: true }).waitFor()
  assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true)
  await mobilePage.screenshot({ path: `${outputDir}/mobile-light.png`, fullPage: true })
  await mobile.close()

  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ ok: true, outputDir, screenshots: 4 }, null, 2))
} finally {
  await browser.close()
}
