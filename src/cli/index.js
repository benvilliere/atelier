#!/usr/bin/env node

import process from "process";
import init from "./init.js";
import watch from "./watch.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "start":
    console.log("Starting atelier...");
    // TODO: New version check
    watch();
    break;
  case "init":
    init();
    break;
  default:
    console.log("Usage: atelier start");
    break;
}
