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

async function saveScreenshotData(data, settings) {
  if (!data.screenshot) {
    return;
  }

  let entry = newDataEntry();
  entry.commitHash = data.commitHash;
  entry.screenshot = data.screenshot;

  if (settings.verbose) {
    console.log("💾 Screenshot data:", { ...entry });
  }

  await saveEntry(entry, settings);
}

async function saveRecordingData(data, settings) {
  if (!data.recording) {
    return;
  }

  let entry = newDataEntry();
  entry.commitHash = data.commitHash;
  entry.recording = data.recording;

  if (settings.verbose) {
    console.log("💾 Recording data:", { ...entry });
  }

  await saveEntry(entry, settings);
}

export async function saveEntry(entry, settings) {
  entry.timestamp = Date.now();

  const filename = `${entry.timestamp}.json`;
  const filePath = path.join(getTimelineDir(settings), filename);

  await mkdir(getTimelineDir(settings), { recursive: true });
  await writeFile(filePath, JSON.stringify(entry, null, 2), "utf8");

  if (settings.verbose) {
    console.log("💾 Entry saved", {
      filePath,
      entry,
    });
  }

  return filePath;
}

export async function saveData(data, settings) {
  await saveScreenshotData(data, settings);
  await saveRecordingData(data, settings);
}
