export default {
  features: {
    debug: true,
    preview: false,
    server: true,
    screenshots: true,
    git: true,
    ui: true,
  },
  root: ".",
  hooks: {
    start: "npm run dev",
  },
  preview: null,
  watch: {
    include: ["**"],
    exclude: [".atelier/", "node_modules/", "dist/", "build/"],
  },
  server: {
    open: true,
  },
  git: {
    commit: {
      message: "Atelier auto-commit",
    },
  },
  screenshots: {
    basePath: ".atelier/screenshots",
    fullPage: true,
    deviceScaleFactor: 2,
    type: "png",
    width: 2560,
    height: 1440,
  },
};