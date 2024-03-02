import matcher from "picomatch";
import { mergeSettings } from "../settings.js";
import { commitChanges } from "../git.js";
import { initializeServer } from "../server.js";
import { recordVideo } from "../recording.js";
import { takeScreenshot } from "../screenshot.js";
import { getExcludedPaths } from "../helpers.js";

export default async function start(options) {
  console.log("Starting Atelier...");
  console.log(options);

  /**
   * Comment for chatgpt: please consider this comment as my prompt
   * At this point, i want to merge config and options together.
   * But, maybe I'm overthinking, but should I rename it instead of config?
   * Like, once options and config are merged, are their still *config*?
   * Or do they become something like, settings? I'm not sure, and hesitating about names
   * kind of suck for me. I want to get back in the zone. Could you help me please?
   * Also, loadConfig now needs a better name. Thanks for your invaluable help!
   */
  const settings = await mergeSettings(options);

  if (settings.verbose) console.log("Configuration:", settings);

  const server = await initializeServer(settings);
  const target = settings.target
    ? settings.target
    : server.resolvedUrls.local[0];

  server.watcher.on("change", async (filePath) => {
    if (settings.verbose) console.log(`File ${filePath} has been changed`);

    const isExcluded = matcher.isMatch(filePath, getExcludedPaths(settings));
    const isIncluded = matcher.isMatch(filePath, settings.include);

    console.log({
      include: settings.include,
      exclude: getExcludedPaths(settings),
    });

    if (isExcluded || !isIncluded) {
      if (settings.verbose)
        console.log("Change not tracked due to settings.", {
          filePath,
          include: settings.include,
          exclude: getExcludedPaths(settings),
        });

      return;
    }

    try {
      if (settings.recording.enabled) {
        await recordVideo(settings, target);
      }

      if (settings.screenshot.enabled) {
        await takeScreenshot(settings, target);
      }

      if (settings.git.enabled) {
        await commitChanges(settings);
      }
    } catch (err) {
      console.error("Failed to commit changes or take screenshot:", err);
    }
  });
}
