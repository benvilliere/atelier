import { createBackend } from "../timeline/backend/server.js";
import { openBrowser } from "../helpers.js";

export default async function timeline(settings) {
  async function run(settings) {
    const port = settings.timeline.port || 1234;
    const url = `http://localhost:${port}`;

    const backend = createBackend(settings);

    backend.listen(port, () => {
      console.log("💫 Timeline running at:", url);
    });

    if (settings.timeline.open) {
      openBrowser(url);
    }
  }

  await run(settings);
}
