import { mergeSettings } from "../settings.js";
import watch from "../runners/watch.js";
import { loadJson } from "../helpers.js";

const { version } = await loadJson("package.json");

export default async function start(options) {
  console.log(`🎨 Atelier (v${version})`);

  const settings = await mergeSettings(options);

  if (settings.watch.enabled) {
    await watch(settings);
  }
}
