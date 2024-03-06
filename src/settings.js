import { promises as fs } from "fs";
import path from "path";
import _ from "lodash";
import baseConfig from "./config/base.js";
import defaultConfig from "./config/default.js";
import { loadJson } from "./helpers.js";
import { isGitRepository } from "./features/git.js";
import { ATELIER_CONFIG_FILE_NAME } from "./constants.js";

export async function createConfigFile(configPath) {
  try {
    await fs.access(configPath);
    console.log(`Config file already exists: ${configPath}`);
  } catch {
    await fs.writeFile(
      configPath,
      JSON.stringify(defaultConfig, null, 2),
      "utf8"
    );
    console.log(`Created config file with default settings: ${configPath}`);
  }
}

async function loadUserConfig() {
  const userConfigPath = path.join(process.cwd(), ATELIER_CONFIG_FILE_NAME);
  try {
    const userConfig = await loadJson(userConfigPath);
    return userConfig || {};
  } catch (error) {
    console.error(`Failed to load user config: ${error}`);
    return {};
  }
}

function convertOptionsToConfig(options) {
  const converted = {};

  converted.root = options.root;
  converted.target = options.target;
  converted.open = options.open;
  converted.verbose = options.verbose;
  converted.include = options.include;
  converted.exclude = options.exclude;
  converted.throttle = Number(options.throttle) || undefined;

  converted.watch = {
    enabled: options.watch,
  };

  converted.commit = {
    enabled: options.commit,
    message: options.message,
  };

  converted.screenshot = {
    enabled: options.screenshot,
    path: options.screenshotPath,
    type: options.screenshotType,
    width:
      Number(options.width) || Number(options.screenshotWidth) || undefined,
    height:
      Number(options.height) || Number(options.screenshotHeight) || undefined,
    selector: options.selector || null,
    fullPage: options.fullPage,
  };

  converted.recording = {
    enabled: options.recording,
    path: options.recordingPath,
    width: Number(options.width) || Number(options.recordingWidth) || undefined,
    height:
      Number(options.height) || Number(options.recordingHeight) || undefined,
    duration: Number(options.duration) || undefined,
  };

  converted.timeline = {
    enabled: options.enabled,
    path: options.dataPath,
    open: options.open,
  };

  if (options.timelineOnly) {
    console.log("Running in timeline only mode");
    converted.timeline.enabled = true;
    converted.timeline.open = true;
    converted.commit.enabled = false;
    converted.watch.enabled = false;
    converted.screenshot.enabled = false;
    converted.recording.enabled = false;
  }

  return converted;
}

export async function setBaseConfigSmartDefaults(config) {
  config.git.enabled = await isGitRepository();

  return config;
}

export async function mergeDefaultAndUserConfig() {
  const userConfig = await loadUserConfig();
  const options = _.merge({}, baseConfig, userConfig);
  return options;
}

export async function mergeConfigWithCommandLineOptions(options) {
  const initialConfig = await mergeDefaultAndUserConfig();
  const commandLineConfig = convertOptionsToConfig(options);
  const settings = _.merge({}, initialConfig, commandLineConfig);
  if (settings.verbose) {
    console.log("Settings:", settings);
  }
  return settings;
}
