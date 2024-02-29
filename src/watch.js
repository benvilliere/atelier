const chokidar = require("chokidar");
const simpleGit = require("simple-git");
const puppeteer = require("puppeteer"); // Don't forget to add this to your dependencies

const watch = async () => {
  const watcher = chokidar.watch(".", { ignored: /(^|[\/\\])\../ });
  const git = simpleGit();

  watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed`);

    // Commit changes
    try {
      await git.add(".");
      await git.commit("Auto-commit");
      console.log("Changes committed");

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

module.exports = watch;
