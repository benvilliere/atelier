export default {
  features: {
    debug: true,
    server: true,
    screenshot: true,
    recording: true,
    git: true,
    ui: true,
  },
  root: ".",
  target: null,
  hooks: {
    start: "npm run dev",
  },
  watch: {
    include: ["**"],
    exclude: [".atelier/", "node_modules/", "dist/", "build/"],
  },
  server: {
    open: false,
  },
  git: {
    commit: {
      message: "Atelier auto-commit",
    },
  },
  screenshot: {
    path: ".atelier/screenshots",
    type: "png",
    width: 2560,
    height: 1440,
    deviceScaleFactor: 2,
    selector: null,
    fullPage: true,
  },
  recording: {
    path: ".atelier/recordings",
    width: 2560,
    height: 1440,
    duration: 10,
  },
};
