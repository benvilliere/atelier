import { createServer } from "vite";
import matcher from "picomatch";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "../config.js";
import { commitChanges } from "../git.js";

// Separated function for server initialization
async function initializeServer(config) {
  const server = await createServer({
    root: config.root || ".",
    server: config.server,
  });
  await server.listen(config.server.port || 4242);
  return server;
}

// Function to handle screenshot taking
async function takeScreenshot(config, target, path) {
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

// Git commit function
// Main watch function refactored
export default async function watch() {
  const config = await loadConfig();
  if (config.features.debug) console.log("Configuration:", config);

  const server = await initializeServer(config);
  const target = config.target ? config.target : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    if (config.features.debug) console.log(`File ${filePath} has been changed`);

    const isExcluded = config.watch.exclude
      ? matcher.isMatch(filePath, config.watch.exclude)
      : false;
    const isIncluded = config.watch.include
      ? matcher.isMatch(filePath, config.watch.include)
      : true;

    if (isExcluded || !isIncluded) {
      console.log("Change not tracked due to config settings.", {
        filePath,
        include: config.watch.include,
        exclude: config.watch.exclude,
      });
      return;
    }

    try {
      if (config.features.screenshots) {
        const screenshotPath = await takeScreenshot(config, target, filePath);
        console.log(`Screenshot taken and saved to ${screenshotPath}`);
      }

      if (config.features.git) {
        const hash = await commitChanges(config);
        console.log("Changes committed", hash);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
}
