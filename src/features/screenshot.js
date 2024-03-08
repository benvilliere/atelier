import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";
import { getScreenshotDir } from "../helpers.js";

export async function takeScreenshot(settings) {
  console.log("📷 Taking screenshot");

  const screenshotDir = getScreenshotDir(settings);

  await mkdir(screenshotDir, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: settings.screenshot.width,
    height: settings.screenshot.height,
    deviceScaleFactor: settings.screenshot.deviceScaleFactor,
  });

  await page.goto(settings.target, { waitUntil: "networkidle0" });

  const fileName = `${Date.now()}.${settings.screenshot.type}`;
  const screenshotPath = `${screenshotDir}/${fileName}`;
  const screenshotOptions = { path: screenshotPath };

  let camera;

  if (settings.screenshot.selector) {
    screenshotOptions.fullPage = false;
    await page.waitForSelector(settings.screenshot.selector);
    const element = await page.$(settings.screenshot.selector);
    await page.waitFor(settings.delay);
    await element.screenshot(screenshotOptions);
  } else {
    screenshotOptions.fullPage = settings.screenshot.fullPage;
  }

  await page.waitFor(settings.delay);

  await page.screenshot(screenshotOptions);

  await browser.close();

  if (settings.verbose) console.log(`📷 Screenshot saved to ${screenshotPath}`);

  return fileName;
}
