import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getTimelineDir } from "../settings.js";

export function newDataEntry() {
  return {
    commitHash: null,
    timestamp: new Date().toISOString(),
    screenshot: null,
    recording: null,
  };
}

export async function saveData(data, settings) {
  const timestamp = Date().now();
  const filename = `${timestamp.replace(/[:.]/g, "-")}.json`;
  const filePath = path.join(directory, filename);

  await mkdir(getTimelineDir(), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

  if (settings.verbose) {
    console.log("Data saved:", filePath);
  }

  return filePath;
}
