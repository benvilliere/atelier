import simpleGit from "simple-git";

export async function commitChanges(settings) {
  const git = simpleGit();
  await git.add(".");
  const { commit: hash } = await git.commit(
    settings.commit.message || "Atelier auto-commit"
  );
  if (settings.verbose) console.log("Changes committed", hash);
  return hash;
}
