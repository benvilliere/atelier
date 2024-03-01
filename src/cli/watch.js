import { createServer } from "vite";
import matcher from "picomatch";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "../config.js";
import { commitChanges } from "../git.js";
import { initializeServer } from "../server.js";
import { takeScreenshot } from "../capture.js";

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
