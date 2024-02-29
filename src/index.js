#!/usr/bin/env node

// CLI entry point
const process = require("process");
const args = process.argv.slice(2); // Get CLI arguments

// Require your watch script
const watch = require("./watch");

// Check the command provided
if (args.length > 0 && args[0] === "start") {
  console.log("Starting atelier...");
  watch(); // This will start the file watching
} else {
  console.log("Usage: atelier start");
}
