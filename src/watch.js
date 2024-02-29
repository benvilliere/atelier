// watch.js
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "./config.js";

const watch = async () => {
  const config = await loadConfig();

  // Start Vite server with custom configuration
  const server = await createServer(config.server);

  await server.listen(config.server?.port || 3000); // Use the port from the config, default to 3000 if not specified
  const url = server.resolvedUrls.local[0]; // Get the local server URL
  console.log(`Atelier running at ${url}`);

  const git = simpleGit();

  // Use Vite's internal file watcher
  server.watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    // Filtering out files based on 'include' and 'exclude' patterns from config
    if (
      config.git?.exclude?.some((pattern) => path.includes(pattern)) ||
      (config.git?.include &&
        !config.git.include.some((pattern) => path.includes(pattern)))
    ) {
      console.log("Change not tracked due to config settings.");
      return;
    }

    try {
      // Commit changes
      await git.add(config.git?.include || "."); // Add either specific paths or everything
      const { commit: hash } = await git.commit(
        config.git?.commit || "Auto-commit"
      );
      console.log("Changes committed", hash);

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
