import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "../../.atelier/data");
const screenshotsDirectory = path.join(__dirname, "../../.atelier/screenshots");
const recordingsDirectory = path.join(__dirname, "../../.atelier/recordings");
const timelineDirectory = __dirname;

app.use(cors());
app.use("/", express.static(timelineDirectory));
app.use("/screenshots", express.static(screenshotsDirectory));
app.use("/recordings", express.static(recordingsDirectory));

app.get("/data", async (req, res) => {
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

app.get("/revert/:hash", function (req, res) {
  const hash = req.params.hash;
  console.log({ hash });
  res.json({ hash });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(timelineDirectory, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
