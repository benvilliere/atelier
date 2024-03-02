import path from "path";
import { loadJson, saveJson, getDirName } from "./helpers.js";
import { ATELIER_CONFIG_FILE_NAME } from "./constants.js";
import baseConfig from "./config/base.js";
import defaultConfig from "./config/default.js";
import _ from "lodash";

export async function createConfigFile(configPath) {
  try {
    await fs.access(configPath);
    console.log(`Config file already exists: ${configPath}`);
  } catch {
    await saveJson(configPath, defaultConfig);
    console.log(`Created config file with default settings: ${configPath}`);
  }
}

async function loadUserConfig() {
  const projectRoot = path.resolve(getDirName(), "../");
  const userConfigPath = path.join(projectRoot, ATELIER_CONFIG_FILE_NAME);
  const userConfig = (await loadJson(userConfigPath)) || {};

  return userConfig;
}

export async function loadConfig(options) {
  const userConfig = await loadUserConfig();

  return _.merge({}, baseConfig, userConfig);
}
