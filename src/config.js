import { readFile } from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, "../..");

export async function loadConfig() {
  const possibleConfigFiles = ["atelier.json", "atelier.config.json"];

  for (const configFile of possibleConfigFiles) {
    try {
      const configPath = path.join(projectRoot, configFile);
      const configContent = await readFile(configPath, "utf8");
      return JSON.parse(configContent);
    } catch (err) {
      console.log(`No configuration found in ${configFile}`);
    }
  }

  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJsonContent = await readFile(packageJsonPath, "utf8");
    const packageJsonConfig = JSON.parse(packageJsonContent);
    if (packageJsonConfig.atelier) {
      return packageJsonConfig.atelier;
    }
  } catch (err) {
    console.error("Failed to load configuration from package.json:", err);
  }

  return {};
}
