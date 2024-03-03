import backend from "../timeline/backend.js";

export default async function timeline(settings) {
  async function run(settings) {
    const port = settings.timeline.port || 3001;

    backend.listen(port, () => {
      console.log(`Timeline server running at http://localhost:${port}`);
    });
  }

  console.log(`Timeline is running`);

  await run(settings);
}
