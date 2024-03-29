import { mkdir } from "fs/promises";
import { setTimeout } from "node:timers/promises";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { getRecordingDir } from "../helpers.js";

export async function recordVideo(settings) {
  console.log("🎥 Recording");

  const recordingDir = getRecordingDir(settings);

  await mkdir(recordingDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: settings.recording.width,
    height: settings.recording.height,
  });

  const recordingOptions = {
    followNewTab: true,
    fps: 24,
    videoFrame: {
      width: settings.recording.width,
      height: settings.recording.height,
    },
    outputPath: recordingDir,
    recordDurationLimit: settings.recording.duration,
  };

  if (settings.verbose) console.log("🎥 Recording options:", recordingOptions);

  const recorder = new PuppeteerScreenRecorder(page);

  const fileName = `${Date.now()}.mp4`;
  const videoPath = `${recordingDir}/${fileName}`;

  await page.goto(settings.target, { waitUntil: "networkidle0" });

  await setTimeout(settings.recording.delay);

  await recorder.start(videoPath);

  await setTimeout(settings.recording.duration);

  await recorder.stop();
  await browser.close();
  console.log(`🎥 Recording saved to ${videoPath}`);

  return fileName;
}
