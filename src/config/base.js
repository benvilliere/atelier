export default {
  root: ".", // Root path to watch
  target: null, // Target URL for taking screenshots and making recordings
  open: false, // Opens the target URL in a new tab
  verbose: false, // Outputs developer friendly messages
  include: ["**/*.js", "**/*.css", "**/*.html"], // Paths to include
  exclude: [".atelier/", "node_modules/", "dist/", "build/"], // Paths to exclude
  server: {}, // Vite server options
  throttle: 5, // Time in seconds between recordings and screenshots
  watch: {
    enabled: true,
    port: 4242,
    server: {}, // Vite server config for watcher
  },
  timeline: {
    enabled: true, // Enables data storage
    path: ".atelier/timeline", // Path where to store timeline data
    open: true,
  },
  commit: {
    enabled: true, // Enables auto-commit on save
    message: "🎨 @genart/atelier: auto-commit on save", // Default commit message
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
    delay: 0, // Delay in ms before taking a screenshot
  },
  recording: {
    enabled: false,
    path: ".atelier/recordings", // Path where to store the recordings
    width: 2560,
    height: 1440,
    duration: 3000, // Recording duration in ms
    delay: 0, // Delay in ms before recording a video
  },
};
