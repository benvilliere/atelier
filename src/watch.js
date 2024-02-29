// watch.js
import { createServer } from "vite";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";

const watch = async () => {
  // Start Vite server
  const server = await createServer({
    // Vite-specific configurations go here
  });

  await server.listen();
  const url = server.resolvedUrls.local[0]; // Get the local server URL
  console.log(`Atelier running at ${url}`);

  const git = simpleGit();

  // Use Vite's internal file watcher
  server.watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    try {
      // Commit changes
      await git.add(".");
      const { commit: hash } = await git.commit("Auto-commit");
      console.log("Changes committed", hash);

      return;

      // Ensure the screenshots directory exists
      await mkdir(".atelier/screenshots", { recursive: true });

      // Take a screenshot
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url); // Use the server URL from Vite
      const screenshotPath = `.atelier/screenshots/${hash}.png`;
      await page.screenshot({ path: screenshotPath });
      await browser.close();
      console.log(`Screenshot taken and saved to ${screenshotPath}`);
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
};

export default watch;
