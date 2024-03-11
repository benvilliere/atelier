import { printWelcomeMessage } from "../helpers.js";
import { initGitRepository, cloneGitRepository } from "../features/git.js";
import { rm, mkdir } from "fs/promises";
import path from "path";
import inquirer from "inquirer";

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

async function askForTemplate() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "boilerplate",
      message: "Choose a template for your project:",
      choices: Object.entries(TEMPLATE).map(([key, { name }]) => ({
        name,
        value: key,
      })),
    },
  ]);
  return answers.boilerplate;
}

export default async function create(name, options) {
  await printWelcomeMessage();

  // Create project directory using <name>
  const projectDir = path.resolve(process.cwd(), name);
  await mkdir(projectDir, { recursive: true });

  // When no template or clone URL is provided, ask for a template
  if (!options.boilerplate && !options.clone) {
    options.boilerplate = await askForTemplate();
  }

  // Either find the template or resort to use the clone value as remote
  const remote = options.boilerplate
    ? TEMPLATE[options.boilerplate]?.remote
    : options.clone;

  if (remote) {
    // Clone the repository into the project directory
    await cloneGitRepository(projectDir, remote);
    // Remove the .git directory to detach from the original repository
    await rm(path.join(projectDir, ".git"), { recursive: true, force: true });
  }

  // Initialize a new git repository
  await initGitRepository(projectDir);
}
