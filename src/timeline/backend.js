import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export function createBackend(settings) {
  const baseDir = process.cwd();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const directories = {
    // Local directories
    data: path.join(baseDir, settings.timeline.path),
    screenshots: path.join(baseDir, settings.screenshot.path),
    recordings: path.join(baseDir, settings.recording.path),
    // Atelier base install directory
    frontend: path.join(__dirname),
  };

  const backend = express();

  backend.use(cors());
  backend.use("/", express.static(directories.frontend));
  backend.use("/screenshots", express.static(directories.screenshots));
  backend.use("/recordings", express.static(directories.recordings));

  backend.get("/settings", async (req, res) => {
    try {
      res.json(settings);
    } catch (err) {
      console.error("Failed to load data:", err);
      res.status(500).send("Failed to load data");
    }
  });

  backend.get("/timeline", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 32;
      const page = parseInt(req.query.page, 10) || 1;
      const offset = (page - 1) * limit;
      const files = await fs.readdir(directories.data);

      let entries = await Promise.all(
        files
          .filter((file) => path.extname(file) === ".json")
          .map(async (file) => {
            const filePath = path.join(directories.data, file);
            const fileContents = await fs.readFile(filePath, "utf8");
            return JSON.parse(fileContents);
          })
      );

      entries.sort((a, b) => b.timestamp - a.timestamp);

      const paginatedItems = entries.slice(offset, offset + limit);

      res.json({
        entries: paginatedItems,
        page,
        limit,
        totalPages: Math.ceil(entries.length / limit),
      });
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
    res.sendFile(path.join(directories.frontend, "index.html"));
  });

  return backend;
}
