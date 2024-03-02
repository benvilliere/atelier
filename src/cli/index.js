#!/usr/bin/env node

import process from "process";
import start from "./start.js";
import { program } from "commander";
import { loadJson } from "../helpers.js";

const { version } = await loadJson("package.json");

program.version(version, "-v, --version", "prints current version");

program
  .command("start", { isDefault: true })
  .description("start the program")
  .option("-V,--verbose", "output more detail")
  .action((options) => start(options));

program.parse(process.argv);
