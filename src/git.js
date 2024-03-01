export async function commitChanges(config) {
  const git = simpleGit();
  await git.add(".");
  const { commit: hash } = await git.commit(
    config.git?.commit?.message || "Atelier auto-commit"
  );
  return hash;
}
