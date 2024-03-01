// Import necessary modules
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "../config.js";
import matcher from "picomatch";

// Separate function to initialize server
async function initializeServer(config) {
  const server = await createServer({
    root: config.root || ".",
    server: config.server,
  });
  await server.listen(config.server.port || 4242);
  return server;
}

// Separate function for taking screenshots
async function takeScreenshot(config, path, timestamp) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: config.screenshots.width || 2560,
    height: config.screenshots.height || 1440,
    deviceScaleFactor: config.screenshots.deviceScaleFactor || 2,
  });
  await page.goto(config.target, { waitUntil: "networkidle0" });
  const screenshotPath = `${config.screenshots.basePath}/${timestamp}.${
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
  console.log(`Screenshot taken and saved to ${screenshotPath}`);
}

// Separate function for handling git operations
async function handleGitOperations(config, timestamp) {
  const git = simpleGit();
  await git.add(".");
  const { commit: hash } = await git.commit(
    config.git.commit.message || "Atelier auto-commit"
  );
  console.log(`Changes committed with hash: ${hash}`);
}

// Main watch function
export default async function watch() {
  const config = await loadConfig();
  const server = await initializeServer(config);
  const target = config.target || server.resolvedUrls.local[0];

  console.log(`Atelier running at ${target}`);

  server.watcher.on("change", async (path) => {
    const timestamp = Date.now();
    const isExcluded = config.watch.exclude
      ? matcher.isMatch(path, config.watch.exclude)
      : false;
    const isIncluded = config.watch.include
      ? matcher.isMatch(path, config.watch.include)
      : true;

    if (isExcluded || !isIncluded) {
      console.log("Change not tracked due to config settings.");
      return;
    }

    if (config.features.screenshots) {
      await mkdir(config.screenshots.basePath, { recursive: true });
      await takeScreenshot(config, path, timestamp);
    }

    if (config.features.git) {
      await handleGitOperations(config, timestamp);
    }
  });
}
