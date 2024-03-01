export default {
  features: {
    debug: true,
    server: true,
    capture: true,
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
  capture: {
    basePath: ".atelier/capture",
    selector: null,
    fullPage: true,
    deviceScaleFactor: 2,
    type: "png",
    width: 2560,
    height: 1440,
  },
};
