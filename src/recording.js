import { mkdir } from "fs/promises";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { getRecordingDir } from "./helpers.js";

export async function recordVideo(settings, target) {
  const recordingDir = getRecordingDir(settings);

  await mkdir(recordingDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: settings.recording.width,
    height: settings.recording.height,
    deviceScaleFactor: settings.recording.deviceScaleFactor || 2,
  });

  const recordingOptions = {
    followNewTab: true,
    fps: 24,
    videoFrame: {
      width: settings.recording.width,
      height: settings.recording.height,
    },
    outputPath: recordingDir,
    recordDurationLimit: settings.recording.duration * 1000,
  };

  if (settings.verbose) console.log("Recording options:", recordingOptions);

  const recorder = new PuppeteerScreenRecorder(page);

  const videoPath = `${recordingDir}/${Date.now()}.mp4`;

  await recorder.start(videoPath);
  await page.goto(target, { waitUntil: "networkidle0" });

  console.log("Recording...");

  setTimeout(async () => {
    await recorder.stop();
    await browser.close();
    console.log(`Recording saved to ${videoPath}`);
  }, settings.recording.duration * 1000);

  return videoPath;
}
