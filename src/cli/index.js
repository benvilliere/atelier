#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import postinstall from "./postinstall.js";
import watch from "./watch.js";
import atelier from "../../package.json" with { type: "json" };

yargs(hideBin(process.argv))
  .version(atelier.version)
  .scriptName("atelier")
  .usage("$0 <cmd> [args]")
  .command(
    "start",
    "Start the atelier",
    () => {},
    (argv) => {
      console.log("Starting atelier...");
      watch();
    }
  )
  .command(
    "postinstall",
    "Run post-installation tasks",
    () => {},
    (argv) => {
      postinstall();
    }
  )
  .demandCommand(1, "You must provide a valid command.")
  .recommendCommands()
  .strict()
  .help()
  .alias("help", "h").argv;
