import { mkdir } from "fs/promises";

import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

export async function takeScreenshot(config, target) {
  const screenshotDir = config.screenshot?.basePath || ".atelier/screenshots";
  await mkdir(screenshotDir, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: config.screenshots.width || 2560,
    height: config.screenshots.height || 1440,
    deviceScaleFactor: config.screenshots.deviceScaleFactor || 2,
  });

  await page.goto(target, { waitUntil: "networkidle0" });

  const screenshotPath = `${screenshotDir}/${Date.now()}.${
    config.screenshots.type || "png"
  }`;
  if (config.screenshots.selector) {
    await page.waitForSelector(config.screenshots.selector);
    const element = await page.$(config.screenshots.selector);
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: config.screenshots.fullPage || true,
    });
  }
  await browser.close();

  if (config.features.debug)
    console.log(`Screenshot taken and saved to ${screenshotPath}`);

  return screenshotPath;
}

export async function recordVideo(config, target) {
  console.log("Record video");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Configure the screen recorder
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 25,
    videoFrame: {
      width: config.screenshots.width || 2560,
      height: config.screenshots.height || 1440,
    },
    // Other configuration options...
  });

  // Start recording
  await recorder.start(`./path/to/video-${Date.now()}.mp4`);

  // Your existing code to navigate and interact with the page...
  await page.goto(target, { waitUntil: "networkidle0" });

  // Perform interactions, then stop recording
  await recorder.stop();
}
