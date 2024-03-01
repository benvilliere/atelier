import { mkdir } from "fs/promises";

import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

export async function takeScreenshot(config, target) {
  const screenshotDir = config.capture.basePath || ".atelier/capture";
  await mkdir(screenshotDir, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: config.capture.width || 2560,
    height: config.capture.height || 1440,
    deviceScaleFactor: config.capture.deviceScaleFactor || 2,
  });

  await page.goto(target, { waitUntil: "networkidle0" });

  const screenshotPath = `${screenshotDir}/${Date.now()}.${
    config.capture.type || "png"
  }`;
  if (config.capture.selector) {
    await page.waitForSelector(config.capture.selector);
    const element = await page.$(config.capture.selector);
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: config.capture.fullPage || true,
    });
  }
  await browser.close();

  if (config.features.debug)
    console.log(`Screenshot taken and saved to ${screenshotPath}`);

  return screenshotPath;
}

export async function recordVideo(config, target, duration = 30) {
  const captureDir = config.capture.basePath || ".atelier/capture";
  await mkdir(captureDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: config.capture.width || 2560,
    height: config.capture.height || 1440,
    deviceScaleFactor: config.capture.deviceScaleFactor || 2,
  });

  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 25,
    videoFrame: {
      width: config.capture.width || 2560,
      height: config.capture.height || 1440,
    },
    outputPath: captureDir,
    recordDurationLimit: duration,
  });

  const videoPath = `${captureDir}/video-${Date.now()}.mp4`;
  await recorder.start(videoPath);
  await page.goto(target, { waitUntil: "networkidle0" });

  const recording = await recorder.stop();
  console.log(recording);
  await browser.close();

  // Wait for the specified duration before stopping the recording
  // await new Promise((resolve) => setTimeout(resolve)); // Convert seconds to milliseconds

  console.log(`Video recorded and saved to ${videoPath}`);
  return videoPath;
}
