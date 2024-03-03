import backend from "../timeline/backend.js";

export default async function timeline(settings) {
  async function run(settings) {
    const port = settings.timeline.port || 1234;

    backend.listen(port, () => {
      console.log(`Timeline running at http://localhost:${port}`);
    });
    console.log(`Timeline running at http://localhost:${port}`);
  }

  await run(settings);
}
