#!/usr/bin/env node

import process from "process";
import { program } from "commander";
import { loadJson } from "./helpers.js";
import start from "./commands/start.js";

const { version } = await loadJson("package.json");

program.version(version, "-v, --version", "prints current version");

program
  .command("start", { isDefault: true })
  .description("start the program")
  .option("-r, --root <path>", "path to watch")
  .option("-t, --target <url>", "url to target")
  .option("-o, --open", "open target in a new browser tab")
  .option("-V, --verbose", "output more detail")
  .option("-i, --include <paths...>", "paths to include")
  .option("-e, --exclude <paths...>", "paths to exclude")
  .option("--throttle <number>", "time in seconds between actions")
  .option("-m, --message <message>", "commit message")
  .option("-c, --auto-commit, --commit", "enables auto-commit")
  .option(
    "-w, --width <number>",
    "width used for both screenshots and recordings"
  )
  .option(
    "-h, --height <number>",
    "height used for both screenshots and recordings"
  )
  .option("-S, --screenshot", "enables recording")
  .option("-sw, --screenshot-width <number>", "screenshot width")
  .option("-sh, --screenshot-height <number>", "screenshot height")
  .option("-sp, --screenshot-path <string>", "path where to store screenshots")
  .option(
    "-st, --type, --screenshot-type <string>",
    "screenshot file type (can be either png or jpg)"
  )
  .option(
    "-s, --selector, --screenshot-selector <selector>",
    "css selector for screenshots"
  )
  .option("--full-page", "full-page screenshots")
  .option("-R, --record, --recording", "enables recording")
  .option("-rw, --recording-width <number>", "recording width")
  .option("-rh, --recording-height <number>", "recording height")
  .option("-rp, --recording-path <string>", "path to store recordings")
  .option("-d, --duration <number>", "recording duration")
  .option("-D, --data", "enables data storage")
  .option("-dp, --data-path <string>", "path where to store data")
  .option("--ui", "enables user interface")
  .action((options) => start(options));

program.parse(process.argv);
