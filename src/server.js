import { createServer } from "vite";

export async function initializeServer(config) {
  const server = await createServer({
    root: config.root || ".",
    server: config.server,
  });
  await server.listen(config.server.port || 4242);
  return server;
}
