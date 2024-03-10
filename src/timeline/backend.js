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

  backend.get("/timeline/since/:when", async (req, res) => {
    try {
      const when = req.params.when;
      const files = await fs.readdir(directories.data);

      let artworks = await Promise.all(
        files
          .filter((file) => path.extname(file) === ".json")
          // .filter((file) => parseInt(file.replace(".json", "")) >= when)
          .map(async (file) => {
            const filePath = path.join(directories.data, file);
            const fileContents = await fs.readFile(filePath, "utf8");
            const artwork = JSON.parse(fileContents);
            artwork.debug = true;
            return artwork;
          })
      );

      artworks = artworks.filter(
        (file) => parseInt(file.replace(".json", "")) >= when
      );

      res.json({
        artworks,
      });
    } catch (err) {
      console.error("Failed to load data:", err);
      res.status(500).send("Failed to load data");
    }
  });

  backend.get("/timeline/total", async (req, res) => {
    try {
      const files = await fs.readdir(directories.data);
      res.json(files.length);
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

      let artworks = await Promise.all(
        files
          .filter((file) => path.extname(file) === ".json")
          .map(async (file) => {
            const filePath = path.join(directories.data, file);
            const fileContents = await fs.readFile(filePath, "utf8");
            return JSON.parse(fileContents);
          })
      );

      artworks.sort((a, b) => b.timestamp - a.timestamp);

      const paginatedItems = artworks.slice(offset, offset + limit);

      res.json({
        artworks: paginatedItems,
        page,
        limit,
        total: artworks.length,
        totalPages: Math.ceil(artworks.length / limit),
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

  backend.post("/delete/:timestamp", async (req, res) => {
    const timestamp = req.params.timestamp;
    const dataDir = directories.data;
    const screenshotDir = directories.screenshots;
    const recordingDir = directories.recordings;

    try {
      // Find the JSON file associated with the timestamp
      const dataFilePath = path.join(dataDir, `${timestamp}.json`);
      const data = await fs.readFile(dataFilePath, "utf8");
      const artwork = JSON.parse(data);

      // Delete associated screenshot and recording files if they exist
      if (artwork.screenshot) {
        const screenshotFilePath = path.join(screenshotDir, artwork.screenshot);
        await fs
          .unlink(screenshotFilePath)
          .catch((err) => console.error("Error deleting screenshot:", err));

        console.log("Deleted screenshot", screenshotFilePath);
      }

      if (artwork.recording) {
        const recordingFilePath = path.join(recordingDir, artwork.recording);
        await fs
          .unlink(recordingFilePath)
          .catch((err) => console.error("Error deleting recording:", err));

        console.log("Deleted recording", recordingFilePath);
      }

      // Delete the JSON file
      await fs.unlink(dataFilePath);

      res.json({
        message: "Successfully deleted artwork",
        timestamp: timestamp,
      });
    } catch (err) {
      console.error("Error during delete operation:", err);
      res.status(500).send("Failed to delete data");
    }
  });

  backend.get("*", (req, res) => {
    if (req.method !== "GET") {
      return;
    }
    res.sendFile(path.join(directories.frontend, "index.html"));
  });

  return backend;
}
