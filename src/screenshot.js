import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";
import { getScreenshotDir } from "./helpers.js";

export async function takeScreenshot(config, target) {
  const screenshotDir = getScreenshotDir(config);

  await mkdir(screenshotDir, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: config.screenshot.width || 2560,
    height: config.screenshot.height || 1440,
    deviceScaleFactor: config.screenshot.deviceScaleFactor || 2,
  });

  await page.goto(target, { waitUntil: "networkidle0" });

  const screenshotPath = `${screenshotDir}/${Date.now()}.${
    config.screenshot.type || "png"
  }`;

  if (config.screenshot.selector) {
    await page.waitForSelector(config.screenshot.selector);
    const element = await page.$(config.screenshot.selector);
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: config.screenshot.fullPage || true,
    });
  }

  await browser.close();

  if (config.verbose) console.log(`Screenshot saved to ${screenshotPath}`);

  return screenshotPath;
}
