export default {
  root: ".",
  target: null,
  verbose: false,
  include: ["**/*.js", "**/*.css", "**/*.html"],
  exclude: [".atelier/", "node_modules/", "dist/", "build/"],
  watch: {
    include: ["**/*.js", "**/*.css", "**/*.html"],
    exclude: [".atelier/", "node_modules/", "dist/", "build/"],
  },
  server: {
    open: false,
  },
  git: {
    enabled: true,
    commit: {
      message: "Atelier auto-commit",
    },
  },
  screenshot: {
    enabled: true,
    path: ".atelier/screenshots",
    type: "png",
    width: 2560,
    height: 1440,
    deviceScaleFactor: 2,
    selector: null,
    fullPage: true,
  },
  recording: {
    enabled: false,
    path: ".atelier/recordings",
    width: 2560,
    height: 1440,
    duration: 10,
  },
};
