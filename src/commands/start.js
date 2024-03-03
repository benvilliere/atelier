import { mergeSettings } from "../settings.js";
import { loadJson } from "../helpers.js";
import timeline from "../runners/timeline.js";
import watch from "../runners/watch.js";

const { version } = await loadJson("package.json");

export default async function start(options) {
  console.log(`🎨 Atelier (v${version})`);

  const settings = await mergeSettings(options);

  if (settings.timeline.enabled) {
    timeline(settings);
  }

  if (settings.watch.enabled) {
    watch(settings);
  }
}
