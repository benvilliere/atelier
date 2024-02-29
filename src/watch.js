import { createServer } from "vite";
import chokidar from "chokidar";
import simpleGit from "simple-git";
import puppeteer from "puppeteer";

const watch = async () => {
  const viteServer = await createServer({
    // TODO: Add local server configuration from atelier.config.js {vite: {}}
  });
  await viteServer.listen();
  const serverUrl = viteServer.resolvedUrls.local[0]; // Get the local server URL
  console.log(`Vite server running at ${serverUrl}`);

  const watcher = chokidar.watch(".", { ignored: /(^|[\/\\])\../ });
  const git = simpleGit();

  watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    // Commit changes
    try {
      await git.add(".");
      const commit = await git.commit("Auto-commit");
      console.log("Changes committed", commit);

      // Take a screenshot
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("http://localhost:8080"); // Change this if your local server runs on a different port
      await page.screenshot({ path: `.atelier/screenshots/${Date.now()}.png` }); // Save screenshot with timestamp
      await browser.close();

      console.log("Screenshot taken");
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
};

export default watch;
