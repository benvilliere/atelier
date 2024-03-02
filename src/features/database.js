import { promises as fs } from "fs";
import path from "path";

export function newDataEntry() {
  return {
    commitHash: null,
    timestamp: new Date().toISOString(),
    screenshot: null,
    recording: null,
  };
}

export async function saveData(data, settings, directory = ".atelier/data") {
  const timestamp = new Date().toISOString();
  const filename = `${timestamp.replace(/[:.]/g, "-")}.json`;
  const filePath = path.join(directory, filename);

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

  if (settings.verbose) {
    console.log("Data saved:", filePath);
  }

  return filePath;
}
