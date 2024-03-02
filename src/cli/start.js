import matcher from "picomatch";
import { mergeSettings } from "../settings.js";
import { commitChanges } from "../git.js";
import { initializeServer } from "../server.js";
import { recordVideo } from "../recording.js";
import { takeScreenshot } from "../screenshot.js";
import { getExcludedPaths } from "../helpers.js";

let lastTime = 0;

export default async function start(options) {
  const settings = await mergeSettings(options);
  const server = await initializeServer(settings);

  settings.target = settings.target
    ? settings.target
    : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    const currentTime = new Date().getTime();

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
      if (settings.recording.enabled) {
        await recordVideo(settings);
      }

      if (settings.screenshot.enabled) {
        await takeScreenshot(settings);
      }

      if (settings.commit.enabled) {
        await commitChanges(settings);
      }
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
