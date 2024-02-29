#!/usr/bin/env node

const process = require("process");
const args = process.argv.slice(2);

const watch = require("./watch");

if (args.length > 0 && args[0] === "start") {
  console.log("Starting atelier...");
  watch();
} else {
  console.log("Usage: atelier start");
}
