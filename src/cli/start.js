import matcher from "picomatch";
import { loadConfig } from "../config.js";
import { commitChanges } from "../git.js";
import { initializeServer } from "../server.js";
import { recordVideo } from "../recording.js";
import { takeScreenshot } from "../screenshot.js";
import { getExcludedPaths } from "../helpers.js";

export default async function start(options) {
  console.log("Starting Atelier...");
  console.log(options);

  const config = await loadConfig(options);

  if (config.verbose) console.log("Configuration:", config);

  const server = await initializeServer(config);
  const target = config.target ? config.target : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    if (config.verbose) console.log(`File ${filePath} has been changed`);

    const isExcluded = matcher.isMatch(filePath, getExcludedPaths(config));
    const isIncluded = matcher.isMatch(filePath, config.include);

    console.log({
      include: config.include,
      exclude: getExcludedPaths(config),
    });

    if (isExcluded || !isIncluded) {
      if (config.verbose)
        console.log("Change not tracked due to config settings.", {
          filePath,
          include: config.include,
          exclude: getExcludedPaths(config),
        });

      return;
    }

    try {
      if (config.recording.enabled) {
        await recordVideo(config, target);
      }

      if (config.screenshot.enabled) {
        await takeScreenshot(config, target);
      }

      if (config.git.enabled) {
        await commitChanges(config);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
}
