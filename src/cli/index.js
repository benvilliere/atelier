#!/usr/bin/env node

import process from "process";
import init from "./init.js";
import watch from "./watch.js";

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];

  switch (command) {
    case "start":
      console.log("Starting atelier...");
      watch();
    case "init":
      init();
    default:
      console.log("Usage: atelier start");
  }
} else {
  console.log("Usage: atelier start");
}
