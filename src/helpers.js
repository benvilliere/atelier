import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

export function getDirName() {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
}