export async function takeScreenshot(config, target, path) {
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
  return screenshotPath;
}
