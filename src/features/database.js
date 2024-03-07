import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getTimelineDir } from "../helpers.js";

export function newDataEntry() {
  return {
    commitHash: null,
    timestamp: null,
    screenshot: null,
    recording: null,
  };
}

export async function saveEntry(data, settings) {
  data.timestamp = Date.now();

  const filename = `${data.timestamp}.json`;
  const filePath = path.join(getTimelineDir(settings), filename);

  await mkdir(getTimelineDir(settings), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

  if (settings.verbose) {
    console.log("💾 Data saved", {
      filePath,
      data,
    });
  }

  return filePath;
}

export async function saveData(data, settings) {
  const entry = newDataEntry();
  if (settings.verbose) {
    console.log("💾 Received data", { data });
  }

  if (data.screenshot) {
    data = { recording: undefined };
    await saveEntry(data, settings);
  }

  if (data.recording) {
    data = { screenshot: undefined };
    await saveEntry(data, settings);
  }
}
