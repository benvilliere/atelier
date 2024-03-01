import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { loadJson, saveJson } from "./helpers.js";
import { ATELIER_CONFIG_FILE_NAME } from "./constants.js";

async function loadBaseConfig() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const baseConfigPath = path.join(__dirname, "base.json");
  const baseConfig = (await loadJson(baseConfigPath)) || {};

  return baseConfig;
}

async function loadUserConfig() {
  const projectRoot = path.resolve(__dirname, "../../");
  const userConfigPath = path.join(projectRoot, ATELIER_CONFIG_FILE_NAME);
  const userConfig = (await loadJson(userConfigPath)) || {};

  return userConfig;
}

export async function loadConfig() {
  const baseConfig = await loadBaseConfig();
  const userConfig = await loadUserConfig();

  return { ...baseConfig, ...userConfig };
}

export async function createConfigFile(configPath) {
  try {
    await fs.access(configPath);
    console.log(`Config file already exists: ${configPath}`);
  } catch {
    const defaultConfig = await loadJson("./src/config/default.json");
    if (defaultConfig) {
      await saveJson(configPath, defaultConfig);
      console.log(`Created config file with default settings: ${configPath}`);
    } else {
      console.error("Failed to load default configuration.");
    }
  }
}
