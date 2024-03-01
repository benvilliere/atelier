import { promises as fs } from "fs";

export async function loadJson(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    // If there's any error reading or parsing the file, return null or an empty object
    console.log(`Error loading JSON from ${filePath}:`, error);
    return null;
  }
}
