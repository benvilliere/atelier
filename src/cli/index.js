#!/usr/bin/env node

import process from "process";
import postinstall from "./postinstall.js";
import watch from "./watch.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "start":
    console.log("Starting atelier...");
    watch();
    break;
  case "postinstall":
    postinstall();
    break;
  default:
    console.log("Usage: atelier start");
    break;
}
