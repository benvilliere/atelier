// watch.js
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "../config.js";
import match from "micromatch";

const watch = async () => {
  const config = await loadConfig();

  if (config.features?.debug) {
    console.log("Configuration:", config);
  }

  // Start Vite server with custom configuration
  const server = await createServer({
    root: config.root || ".",
    server: config.server,
  });

  await server.listen(config.server?.port || 4242);

  // Get the local server URL
  const url = config.features.server
    ? server.resolvedUrls.local[0]
    : config.preview;

  if (config.features.debug) {
    console.log(`Atelier running at ${url}`);
  }

  const git = simpleGit();

  // Use Vite's internal file watcher
  server.watcher.on("change", async (path) => {
    if (config.features?.debug) {
      console.log(`File ${path} has been changed`);
    }

    const isExcluded = match.isMatch(path, config.watch?.exclude);
    const isIncluded = match.isMatch(path, config.watch?.include);

    if (isExcluded || !isIncluded) {
      console.log("Change not tracked due to config settings.");
      return;
    }

    try {
      const timestamp = Date.now();

      // Take a screenshot
      if (config.features.screenshots) {
        // Ensure the screenshots directory exists
        const screenshotDir =
          config.screenshot?.basePath || ".atelier/screenshots";
        await mkdir(screenshotDir, { recursive: true });

        // Check if screenshot taking is configured
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
          width: config.screenshots.width || 2560,
          height: config.screenshots.height || 1440,
          deviceScaleFactor: config.screenshots.deviceScaleFactor || 2,
        });

        // Use the server URL from Vite or the provided url
        await page.goto(url, { waitUntil: "networkidle0" });
        const screenshotPath = `${screenshotDir}/${timestamp}.${
          config.screenshots.type || "png"
        }`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: config.screenshots.fullPage || true,
        });

        await browser.close();
        console.log(`Screenshot taken and saved to ${screenshotPath}`);
      } else {
        console.log("Screenshot feature is disabled.");
      }

      if (config.features.git) {
        // Commit changes
        await git.add(".");
        const { commit: hash } = await git.commit(
          config.git?.commit?.message || "Atelier auto-commit"
        );
        console.log("Changes committed", hash);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
};

export default watch;
