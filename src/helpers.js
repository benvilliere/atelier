import { exec } from "child_process";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  ATELIER_BASE_DIR,
  ATELIER_SCREENSHOT_DIR,
  ATELIER_RECORDING_DIR,
  ATELIER_TIMELINE_DIR,
} from "./constants.js";

export async function printWelcomeMessage() {
  const { version } = await loadJson("package.json");
  console.log(`------------------------`);
  console.log(`| 🎨 Atelier (v${version}) |`);
  console.log(`------------------------`);
}

export async function loadJson(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.log(`Error loading JSON from ${filePath}:`, error);
    return null;
  }
}

export async function saveJson(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, "utf8");
    console.log(`Successfully saved JSON to ${filePath}`);
  } catch (error) {
    console.error(`Error saving JSON to ${filePath}:`, error);
  }
}

export async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}: ${error}`);
  }
}

export function getRecordingDir(config) {
  return (
    config.recording.path || `${ATELIER_BASE_DIR}/${ATELIER_RECORDING_DIR}`
  );
}

export function getScreenshotDir(config) {
  return (
    config.screenshot.path || `${ATELIER_BASE_DIR}/${ATELIER_SCREENSHOT_DIR}`
  );
}

export function getTimelineDir(config) {
  return config.timeline.path || `${ATELIER_BASE_DIR}/${ATELIER_TIMELINE_DIR}`;
}

export function getExcludedPaths(config) {
  return [...config.exclude, getRecordingDir(config), getScreenshotDir(config)];
}

export function openBrowser(url) {
  switch (process.platform) {
    case "darwin":
      exec(`open ${url}`);
      break;
    case "win32":
      exec(`start ${url}`);
      break;
    default:
      exec(`xdg-open ${url}`);
  }
}
