import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { getRecordingDir } from "./helpers.js";

export async function recordVideo(config, target) {
  const recordingDir = getRecordingDir(config);

  await mkdir(recordingDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: config.recording.width,
    height: config.recording.height,
    deviceScaleFactor: config.recording.deviceScaleFactor || 2,
  });

  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 25,
    videoFrame: {
      width: config.recording.width,
      height: config.recording.height,
    },
    outputPath: recordingDir,
    recordDurationLimit: config.recording.duration,
  });

  const videoPath = `${recordingDir}/${Date.now()}.mp4`;

  await recorder.start(videoPath);
  await page.goto(target, { waitUntil: "networkidle0" });

  const recording = await recorder.stop();

  if (config.features.debug) console.log(recording);

  await browser.close();

  // Wait for the specified duration before stopping the recording
  // await new Promise((resolve) => setTimeout(resolve)); // Convert seconds to milliseconds

  console.log(`Recording saved to ${videoPath}`);
  return videoPath;
}
