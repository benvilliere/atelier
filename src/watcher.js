const chokidar = require("chokidar");
const simpleGit = require("simple-git");

// Set up file watcher
const watcher = chokidar.watch(".", {
  ignored: /(^|[\/\\])\../,
}); // adjust the path and ignore pattern

// Function to handle the 'change' event
const onChange = (path) => {
  console.log(`File ${path} has been changed`);
  const git = simpleGit();
  git
    .add(".")
    .then(() => git.commit("Auto-commit"))
    .then(() => console.log("Changes committed"))
    .catch((err) => console.error("Failed to commit changes:", err));
};

// Add event listener for file changes
watcher.on("change", onChange);
