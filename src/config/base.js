export default {
  root: ".", // Root path to watch
  target: null, // Target URL for taking screenshots and making recordings
  open: false, // Opens the target URL in a new tab
  verbose: false, // Outputs developer friendly messages
  include: ["**/*.js", "**/*.css", "**/*.html"], // Paths to include
  exclude: [".atelier/", "node_modules/", "dist/", "build/"], // Paths to exclude
  server: {}, // Vite server options
  throttle: 5, // Time between recordings and screenshots
  commit: {
    enabled: true, // Enables auto-commit
    message: "Atelier auto-commit", // Default commit message
  },
  screenshot: {
    enabled: true, // Enables screenshots
    path: ".atelier/screenshots", // Path where to store the screenshots
    type: "png", // Screenshot type (can be either png or jpg)
    width: 2560,
    height: 1440,
    deviceScaleFactor: 2,
    selector: null,
    fullPage: false,
  },
  recording: {
    enabled: false,
    path: ".atelier/recordings",
    width: 2560,
    height: 1440,
    duration: 10,
  },
};
