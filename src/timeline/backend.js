import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const backend = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "../../.atelier/data");
const screenshotsDirectory = path.join(__dirname, "../../.atelier/screenshots");
const recordingsDirectory = path.join(__dirname, "../../.atelier/recordings");
const timelineDirectory = __dirname;

backend.use(cors());
backend.use("/", express.static(timelineDirectory));
backend.use("/screenshots", express.static(screenshotsDirectory));
backend.use("/recordings", express.static(recordingsDirectory));

backend.get("/data", async (req, res) => {
  try {
    const files = await fs.readdir(dataDirectory);
    const dataEntries = [];
    for (const file of files) {
      if (path.extname(file) === ".json") {
        const filePath = path.join(dataDirectory, file);
        const fileContents = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(fileContents);
        dataEntries.push(data);
      }
    }
    res.json(dataEntries);
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

backend.get("*", (req, res) => {
  res.sendFile(path.join(timelineDirectory, "index.html"));
});

// backend.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

export default backend;
