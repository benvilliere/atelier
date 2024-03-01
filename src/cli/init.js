import { promises as fs } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ATELIER_CONFIG_FILE_NAME, ATELIER_DOT_DIR } from "../config.js";

const init = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const projectRoot = path.resolve(process.cwd());
  const atelierConfigPath = path.join(projectRoot, ATELIER_CONFIG_FILE_NAME);
  const atelierDirPath = path.join(projectRoot, ATELIER_DOT_DIR);
  const screenshotsDirPath = path.join(atelierDirPath, "screenshots");
  const defaultConfigPath = path.join(__dirname, "../config/default.json");

  try {
    // Create .atelier directory if it doesn't exist
    await fs.mkdir(atelierDirPath).catch((e) => {
      if (e.code !== "EEXIST") throw e; // Ignore 'directory already exists' error
    });

    // Create screenshots directory within .atelier
    await fs.mkdir(screenshotsDirPath).catch((e) => {
      if (e.code !== "EEXIST") throw e;
    });

    // Check if atelier.json already exists, if not, copy from default.json
    try {
      await fs.access(atelierConfigPath); // Checks for existence of the file
      console.log(`Config file ${ATELIER_CONFIG_FILE_NAME} already exists`);
    } catch {
      // If atelier.json does not exist, create it by copying default.json
      const defaultConfig = await fs.readFile(defaultConfigPath, "utf8");
      await fs.writeFile(atelierConfigPath, defaultConfig);
      console.log(`Created ${ATELIER_CONFIG_FILE_NAME} with default settings.`);
    }
  } catch (error) {
    console.error(`Failed to initialize Atelier: ${error.message}`);
  }
};

export default init;
