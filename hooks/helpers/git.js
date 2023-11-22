import { execSync } from "child_process";
import path from "node:path";
import { execaSync } from "execa";
import fs from "fs-extra";

export function isGitInstalled(dir) {
  try {
    execSync("git --version", { cwd: dir });
    return true;
  } catch (_e) {
    return false;
  }
}

/** @returns Whether or not the provided directory has a `.git` subdirectory in it. */
export function isRootGitRepo(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

/** @returns Whether or not this directory or a parent directory has a `.git` directory. */
export function isInsideGitRepo(dir) {
  try {
    // If this command succeeds, we're inside a git repo
    execaSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: dir,
      stdout: "ignore",
    });
    return true;
  } catch (_e) {
    // Else, it will throw a git-error and we return false
    return false;
  }
}

function getGitVersion() {
  const stdout = execSync("git --version").toString().trim();
  const gitVersionTag = stdout.split(" ")[2];
  const major = gitVersionTag?.split(".")[0];
  const minor = gitVersionTag?.split(".")[1];
  return { major: Number(major), minor: Number(minor) };
}

/** @returns The git config value of "init.defaultBranch". If it is not set, returns "main". */
function getDefaultBranch() {
  return execSync("git config --global init.defaultBranch || echo main")
    .toString()
    .trim();
}

// This initializes the Git-repository for the project
export function initializeGit({ projectDir }) {
  if (!isGitInstalled(projectDir)) {
    return;
  }

  // We're good to go, initializing the git repo
  try {
    const branchName = getDefaultBranch();

    // --initial-branch flag was added in git v2.28.0
    const { major, minor } = getGitVersion();
    if (major < 2 || (major === 2 && minor < 28)) {
      execaSync("git", ["init"], { cwd: projectDir });
      // symbolic-ref is used here due to refs/heads/master not existing
      // It is only created after the first commit
      // https://superuser.com/a/1419674
      execaSync("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
        cwd: projectDir,
      });
    } else {
      execaSync("git", ["init", `--initial-branch=${branchName}`], {
        cwd: projectDir,
      });
    }
    execaSync("git", ["add", "."], { cwd: projectDir });
  } catch (error) {
    let msg =
      "Failed: could not initialize git. Update git to the latest version!\n";
    if (error.message) msg += `Error: ${error.message}`;
    throw new Error(msg);
  }
}

export function stageAndCommit({ projectDir, message }) {
  const isRoot = isRootGitRepo(projectDir);
  const isInside = isInsideGitRepo(projectDir);

  if (isInside && !isRoot) {
    return;
  }

  execaSync("git", ["add", "."], { cwd: projectDir });
  execaSync("git", ["commit", "-m", message], { cwd: projectDir });
}
