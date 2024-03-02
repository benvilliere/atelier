import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";
import { getScreenshotDir } from "../helpers.js";

export async function takeScreenshot(settings) {
  console.log("Taking screenshot...");

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

  const screenshotPath = `${screenshotDir}/${Date.now()}.${
    settings.screenshot.type
  }`;

  if (settings.screenshot.selector) {
    await page.waitForSelector(settings.screenshot.selector);
    const element = await page.$(settings.screenshot.selector);
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: settings.screenshot.fullPage,
    });
  }

  await browser.close();

  if (settings.verbose) console.log(`Screenshot saved to ${screenshotPath}`);

  return screenshotPath;
}
