// watch.js
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "./config.js";
import match from "micromatch";

const watch = async () => {
  const config = await loadConfig();

  // Start Vite server with custom configuration
  const server = await createServer({ server: config.server });
  await server.listen(config.server?.port || 3000); // Use the port from the config, default to 3000 if not specified
  const url = server.resolvedUrls.local[0]; // Get the local server URL
  console.log(`Atelier running at ${url}`);

  const git = simpleGit();

  // Use Vite's internal file watcher
  server.watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    const isExcluded = match.isMatch(path, config.exclude);
    const isIncluded = match.isMatch(path, config.include);

    if (isExcluded || !isIncluded) {
      console.log("Change not tracked due to config settings.");
      return;
    }

    try {
      const timestamp = new Date();
      console.log(timestamp);
      process.exit();

      if (config.features.git) {
        // Commit changes
        await git.add(".");
        const { commit: hash } = await git.commit(
          config.git?.commit?.message || "Atelier auto-commit"
        );
        console.log("Changes committed", hash);
      }

      // Ensure the screenshots directory exists
      const screenshotDir =
        config.screenshot?.basePath || ".atelier/screenshots";
      await mkdir(screenshotDir, { recursive: true });

      // Take a screenshot
      if (config.screenshot) {
        // Check if screenshot taking is configured
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
          width: config.screenshot.width || 2560,
          height: config.screenshot.height || 1440,
          deviceScaleFactor: config.screenshot.deviceScaleFactor || 2, // Make sure this is being applied
        });
        // Use the server URL from Vite
        await page.goto(url, { waitUntil: "networkidle0" });
        const screenshotPath = `${screenshotDir}/${hash}.${
          config.screenshot.type || "png"
        }`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: config.screenshot.fullPage || true,
        });

        await browser.close();
        console.log(`Screenshot taken and saved to ${screenshotPath}`);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
};

export default watch;
