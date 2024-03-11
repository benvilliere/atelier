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

export async function initGitRepository(path) {
  const git = simpleGit(path);
  await git.init();
}

export async function cloneGitRepository(path, remote) {
  const git = simpleGit();
  await git.clone(remote, path);
}
