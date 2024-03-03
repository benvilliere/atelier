export default async function timeline(settings) {
  async function run(settings) {
    console.log(settings);
  }
  console.log(`Timeline is running`);
  await run(settings);
}
