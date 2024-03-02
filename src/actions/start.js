import matcher from "picomatch";
import { getExcludedPaths } from "../helpers.js";
import { mergeSettings } from "../settings.js";
import { commitChanges } from "../features/git.js";
import { initializeServer } from "../features/server.js";
import { recordVideo } from "../features/recording.js";
import { takeScreenshot } from "../features/screenshot.js";
import { newDataEntry, saveData } from "../features/database.js";

let lastTime = 0;

export default async function start(options) {
  const settings = await mergeSettings(options);
  const server = await initializeServer(settings);

  settings.target = settings.target
    ? settings.target
    : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    const currentTime = new Date().getTime();
    const data = newDataEntry();

    if (currentTime - lastTime < settings.throttle * 1000) {
      if (settings.verbose) {
        console.error(`Throttle limit reached, skipping action.`);
      }

      return;
    }

    lastTime = currentTime;

    if (settings.verbose) console.log(`File ${filePath} has been changed`);

    const isExcluded = matcher.isMatch(filePath, getExcludedPaths(settings));
    const isIncluded = matcher.isMatch(filePath, settings.include);

    if (isExcluded || !isIncluded) {
      if (settings.verbose)
        console.log("Change not tracked due to settings.", {
          path: filePath,
          include: settings.include,
          exclude: getExcludedPaths(settings),
        });

      return;
    }

    try {
      if (settings.screenshot.enabled) {
        data.screenshot = await takeScreenshot(settings);
      }

      if (settings.recording.enabled) {
        data.recording = await recordVideo(settings);
      }

      if (settings.commit.enabled) {
        data.commitHash = await commitChanges(settings);
      }

      await saveData(data);
    } catch (err) {
      if (settings.verbose) {
        console.error("Failed to commit changes or take screenshot:", err);
      } else {
        console.error(
          "Something went wrong. Use --verbose to enable debug messages"
        );
      }
    }
  });

  console.log("Atelier is running");
  console.log("Root:", settings.root);
  console.log("Target:", settings.target);
}
