import { promises as fs } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const init = async () => {
  const projectRoot = path.resolve(process.cwd());
  const atelierConfigPath = path.join(projectRoot, "atelier.config.json");
  const atelierDirPath = path.join(projectRoot, ".atelier");
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

    // Check if atelier.config.json already exists, if not, copy from default.json
    try {
      await fs.access(atelierConfigPath); // Checks for existence of the file
      console.log("atelier.config.json already exists.");
    } catch {
      // If atelier.config.json does not exist, create it by copying default.json
      const defaultConfig = await fs.readFile(defaultConfigPath, "utf8");
      await fs.writeFile(atelierConfigPath, defaultConfig);
      console.log("Created atelier.config.json with default settings.");
    }
  } catch (error) {
    console.error(`Failed to initialize Atelier: ${error.message}`);
  }
};

export default init;
