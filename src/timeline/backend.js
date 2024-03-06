import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export function createBackend(settings) {
  // Local directories
  const baseDir = process.cwd();
  const dataDir = path.join(baseDir, settings.timeline.path);
  const screenshotsDir = path.join(baseDir, settings.screenshot.path);
  const recordingsDir = path.join(baseDir, settings.recording.path);

  // Atelier base install directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDir = path.join(__dirname);

  const directories = {
    data: path.join(baseDir, settings.timeline.path),
    screenshots: path.join(baseDir, settings.screenshot.path),
    recordings: path.join(baseDir, settings.recording.path),
    frontend: path.join(__dirname),
  };

  const backend = express();

  backend.use(cors());
  backend.use("/", express.static(frontendDir));
  backend.use("/screenshots", express.static(screenshotsDir));
  backend.use("/recordings", express.static(recordingsDir));

  backend.get("/timeline", async (req, res) => {
    try {
      const files = await fs.readdir(dataDir);
      const timeline = [];
      for (const file of files) {
        if (path.extname(file) === ".json") {
          const filePath = path.join(dataDir, file);
          const fileContents = await fs.readFile(filePath, "utf8");
          const entry = JSON.parse(fileContents);
          timeline.push(entry);
        }
      }
      res.json(timeline.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error("Failed to load data:", err);
      res.status(500).send("Failed to load data");
    }
  });

  backend.get("/revert/:hash", function (req, res) {
    const hash = req.params.hash;
    console.log({ hash });
    res.json({ hash });
  });

  backend.post("/delete/:timestamp", function (req, res) {
    const timestamp = req.params.timestamp;

    // Find file with timestamp
    // Read JSON from file
    // Delete screenshot
    // Delete recording
    // Delete JSON file

    console.log({ timestamp });

    res.json({
      message: "DELETE Request Called",
      data: {
        timestamp,
      },
    });
  });

  backend.get("*", (req, res) => {
    if (req.method !== "GET") {
      return;
    }
    res.sendFile(path.join(frontendDir, "index.html"));
  });

  return backend;
}
