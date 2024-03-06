import { mergeConfigWithCommandLineOptions } from "../settings.js";
import { printWelcomeMessage } from "../helpers.js";
import timeline from "../runners/timeline.js";
import watch from "../runners/watch.js";

export default async function start(options) {
  await printWelcomeMessage();

  const settings = await mergeConfigWithCommandLineOptions(options);

  if (settings.timeline.enabled) {
    timeline(settings);
  }

  if (settings.watch.enabled) {
    watch(settings);
  }
}
