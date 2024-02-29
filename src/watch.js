const chokidar = require("chokidar");
const simpleGit = require("simple-git");

const watch = () => {
  // Set up file watcher
  const watcher = chokidar.watch(".", {
    ignored: /(^|[\/\\])\../,
  });

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
};

// Export the function
module.exports = watch;
