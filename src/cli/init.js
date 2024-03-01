import path from "path";
import {
  ATELIER_CONFIG_FILE_NAME,
  ATELIER_DOT_DIR,
  ATELIER_CAPTURE_DIR_NAME,
} from "../constants.js";
import { createConfigFile } from "../config.js";
import { createDirectory } from "../helpers.js";

export default async function init() {
  const projectRoot = process.cwd();
  const atelierConfigPath = path.join(projectRoot, ATELIER_CONFIG_FILE_NAME);
  const atelierDirPath = path.join(projectRoot, ATELIER_DOT_DIR);
  const screenshotsDirPath = path.join(
    atelierDirPath,
    ATELIER_CAPTURE_DIR_NAME
  );

  await createDirectory(atelierDirPath);
  await createDirectory(screenshotsDirPath);
  await createConfigFile(atelierConfigPath);
}
