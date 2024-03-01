import matcher from "picomatch";
import { loadConfig } from "../config.js";
import { commitChanges } from "../git.js";
import { initializeServer } from "../server.js";
import { recordVideo } from "../recording.js";
import { takeScreenshot } from "../screenshot.js";
import { getExcludedPaths } from "../helpers.js";

export default async function watch() {
  const config = await loadConfig();

  if (config.features.debug) console.log("Configuration:", config);

  const server = await initializeServer(config);
  const target = config.target ? config.target : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    if (config.features.debug) console.log(`File ${filePath} has been changed`);

    const isExcluded = config.watch.exclude
      ? matcher.isMatch(filePath, getExcludedPaths(config))
      : false;

    const isIncluded = config.watch.include
      ? matcher.isMatch(filePath, config.watch.include)
      : true;

    if (isExcluded || !isIncluded) {
      if (config.features.debug)
        console.log("Change not tracked due to config settings.", {
          filePath,
          include: config.watch.include,
          exclude: config.watch.exclude,
        });

      return;
    }

    try {
      if (config.features.recording) {
        await recordVideo(config, target);
      }

      if (config.features.screenshot) {
        await takeScreenshot(config, target);
      }

      if (config.features.git) {
        await commitChanges(config);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
}
