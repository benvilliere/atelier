import { printWelcomeMessage } from "../helpers.js";
import defaultSettings from "../config/default.js";
import { initGitRepository, cloneGitRepository } from "../features/git.js";
import { rm, mkdir } from "fs/promises";
import path from "path";

export const TEMPLATE = {
  fxhash: {
    name: "fx(hash) boilerplate",
    remote: "https://github.com/fxhash/fxhash-boilerplate.git",
  },
  "fxhash-with-p5js": {
    name: "fx(hash) boilerplate with p5.js library",
    remote: "https://github.com/benvilliere/fxhash-boilerplate-with-p5js.git",
  },
};

export default async function create(name, options) {
  await printWelcomeMessage();

  // Create project directory using <name>
  const projectDir = path.resolve(process.cwd(), name);
  await mkdir(projectDir, { recursive: true });

  // Assuming the template URL is in the options or TEMPLATE object
  const remote = options.boilerplate
    ? TEMPLATE[options.boilerplate]?.remote
    : options.clone;

  if (remote) {
    // Clone the repository into the project directory
    await cloneGitRepository(projectDir, remote);
    // Remove the .git directory to detach from the original repository
    await rm(path.join(projectDir, ".git"), { recursive: true });
  }

  // Initialize a new git repository
  await initGitRepository(projectDir);
}
