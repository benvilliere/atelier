import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { loadJson } from "./helpers.js";

export const ATELIER_DOT_DIR = ".atelier";
export const ATELIER_CONFIG_FILE_NAME = "atelier.json";

// Load base configuration
async function loadBaseConfig() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const baseConfigPath = path.join(__dirname, "base.json");
  const baseConfig = (await loadJson(baseConfigPath)) || {};

  return baseConfig;
}

// Load user configuration from the project root
async function loadUserConfig() {
  const projectRoot = path.resolve(__dirname, "../../");
  const userConfigPath = path.join(projectRoot, ATELIER_CONFIG_FILE_NAME);
  const userConfig = (await loadJson(userConfigPath)) || {};

  return userConfig;
}

// Merge configurations, giving priority to userConfig
export async function loadConfig() {
  const baseConfig = await loadBaseConfig();
  const userConfig = await loadUserConfig();
  return { ...baseConfig, ...userConfig };
}
