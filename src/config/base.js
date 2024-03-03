export default {
  root: ".", // Root path to watch
  target: null, // Target URL for taking screenshots and making recordings
  open: false, // Opens the target URL in a new tab
  verbose: false, // Outputs developer friendly messages
  include: ["**/*.js", "**/*.css", "**/*.html"], // Paths to include
  exclude: [".atelier/", "node_modules/", "dist/", "build/"], // Paths to exclude
  server: {}, // Vite server options
  throttle: 5, // Time in seconds between recordings and screenshots
  commit: {
    enabled: true, // Enables auto-commit
    message: "@genart/atelier: auto-commit on save", // Default commit message
  },
  data: {
    enabled: true, // Enables data storage
    path: ".atelier/data", // Path where to store the data
  },
  screenshot: {
    enabled: true, // Enables screenshots
    path: ".atelier/screenshots", // Path where to store the screenshots
    type: "png", // Screenshot type (can be either png or jpg)
    width: 2560, // Screenshot width
    height: 1440, // Screenshot height
    deviceScaleFactor: 2,
    selector: null, // CSS selector of the element to screenshot
    fullPage: false, // Wether the screenshot should take the full page
  },
  recording: {
    enabled: false,
    path: ".atelier/recordings", // Path where to store the recordings
    width: 2560,
    height: 1440,
    duration: 10,
  },
};
