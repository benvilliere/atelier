import simpleGit from "simple-git";

export async function commitChanges(config) {
  const git = simpleGit();
  await git.add(".");
  const { commit: hash } = await git.commit(
    config.git?.commit?.message || "Atelier auto-commit"
  );
  if (config.verbose) console.log("Changes committed", hash);
  return hash;
}
