import simpleGit from "simple-git";

export async function commitChanges(settings) {
  const git = simpleGit();
  await git.add(".");
  const { commit: hash } = await git.commit(settings.commit.message);
  if (hash) {
    console.log("🔀 Changes committed:", hash);
  }
  return hash;
}

export async function isGitRepository() {
  try {
    await fs.access(path.join(process.cwd(), ".git"));
    return true;
  } catch {
    return false;
  }
}
