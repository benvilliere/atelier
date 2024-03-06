import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export function createBackend(settings) {
  // Local directories
  const baseDir = process.cwd();
  const dataDirectory = path.join(baseDir, settings.timeline.path);
  const screenshotsDirectory = path.join(baseDir, settings.screenshot.path);
  const recordingsDirectory = path.join(baseDir, settings.recording.path);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDir = path.join(__dirname);

  const backend = express();

  backend.use(cors());
  backend.use("/", express.static(frontendDir));
  backend.use("/screenshots", express.static(screenshotsDirectory));
  backend.use("/recordings", express.static(recordingsDirectory));

  backend.get("/timeline", async (req, res) => {
    try {
      const files = await fs.readdir(dataDirectory);
      const timeline = [];
      for (const file of files) {
        if (path.extname(file) === ".json") {
          const filePath = path.join(dataDirectory, file);
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
