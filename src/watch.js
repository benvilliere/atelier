// watch.js
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { loadConfig } from "./config.js";

const watch = async () => {
  const config = await loadConfig();

  // Start Vite server with custom configuration
  const server = await createServer(config.vite); // Pass Vite-specific configurations from loaded config

  await server.listen();
  const url = `http://${config.server?.host || "localhost"}:${
    config.server?.port
  }`;
  console.log(`Atelier running at ${url}`);

  const git = simpleGit();

  // Use Vite's internal file watcher
  server.watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    try {
      // Commit changes
      await git.add(config.git?.include || ".");
      const { commit: hash } = await git.commit(
        config.git?.autoCommitMessage || "Auto-commit"
      );
      console.log("Changes committed", hash);

      // Ensure the screenshots directory exists
      const screenshotDir = config.screenshot?.path || ".atelier/screenshots";
      await mkdir(screenshotDir, { recursive: true });

      // Take a screenshot
      if (config.screenshot) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set viewport size based on configuration or use defaults
        await page.setViewport({
          width: config.screenshot?.width || 1280,
          height: config.screenshot?.height || 720,
        });

        await page.goto(url);
        const screenshotPath = `${screenshotDir}/${hash}.${
          config.screenshot.format || "png"
        }`;
        await page.screenshot({ path: screenshotPath });
        await browser.close();
        console.log(`Screenshot taken and saved to ${screenshotPath}`);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
};

export default watch;
