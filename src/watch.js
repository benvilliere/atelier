const chokidar = require("chokidar");
const simpleGit = require("simple-git");

const watch = () => {
  const watcher = chokidar.watch(".", {
    ignored: /(^|[\/\\])\../,
  });

  const onChange = (path) => {
    console.log(`File ${path} has been changed`);
    const git = simpleGit();
    git
      .add(".")
      .then(() => git.commit("Auto-commit"))
      .then(() => console.log("Changes committed"))
      .catch((err) => console.error("Failed to commit changes:", err));
  };

  watcher.on("change", onChange);
};

module.exports = watch;
