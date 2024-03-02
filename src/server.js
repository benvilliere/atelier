import { createServer } from "vite";

export async function initializeServer(settings) {
  const server = await createServer({
    root: settings.root || ".",
    server: {
      open: settings.open == true,
      ...settings.server,
    },
  });
  await server.listen(settings.server.port || 4242);
  return server;
}
