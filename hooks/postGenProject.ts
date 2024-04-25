import type { PackageManager } from "./utils/types";

import path from "node:path";
import fs from "fs-extra";
import { execa } from "execa";

import { initializeGit, stageAndCommit } from "./helpers/git";
import { installDependencies } from "./helpers/installDependencies";
import { runLinters } from "./helpers/runLinters";
import { logNextSteps } from "./helpers/logNextSteps";
import { updatePackageJson } from "./utils/updatePackageJson";
import { toBoolean } from "./utils/coerce";
import { logger } from "./utils/logger";

const TEMPLATE_REPO = "dkshs/dkcutter-nextjs";
const CTX = {
  projectSlug: "{{ dkcutter.projectSlug }}",
  pkgManager: "{{ dkcutter.pkgManager }}" as PackageManager,
  useAppFolder: toBoolean("{{ dkcutter.useAppFolder }}"),
  useLinters: toBoolean("{{ dkcutter.useLinters }}"),
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
  useCommitlint: toBoolean("{{ dkcutter.useCommitlint }}"),
  useEnvValidator: toBoolean("{{ dkcutter.useEnvValidator }}"),
  database: "{{ dkcutter.database }}",
  useDockerCompose: toBoolean("{{ dkcutter.useDockerCompose }}"),
  authProvider: "{{ dkcutter.authProvider }}",
  clerkWebhook: toBoolean("{{ dkcutter.clerkWebhook }}"),
  automatedDepsUpdater: "{{ dkcutter.automatedDepsUpdater }}",
  automaticStart: toBoolean("{{ dkcutter.automaticStart }}"),
};

async function getPkgManagerVersion() {
  try {
    const pkg = CTX.pkgManager;
    const { stdout } = await execa(pkg, ["-v"]);
    return `${pkg}@${stdout}`;
  } catch (error) {
    logger.warn("Unable to get version from package manager.", error);
  }
}

function appendToGitignore(gitignorePath: string, lines: string) {
  fs.appendFileSync(gitignorePath, lines);
}

function removeFiles(files: string[]) {
  files.forEach((file) => fs.removeSync(file));
}

async function main() {
  const REMOVE_DEPS = [];
  const REMOVE_DEV_DEPS = [];
  const projectDir = path.resolve(".");
  const srcFolder = path.join(projectDir, "src");
  const publicFolder = path.join(projectDir, "public");
  const pagesFolder = path.join(srcFolder, "pages");
  const appFolder = path.join(srcFolder, "app");

  const gitignorePath = path.join(projectDir, ".gitignore");
  appendToGitignore(gitignorePath, "\n# local env files\n.env*.local\n.env\n");

  const pkgVersion = await getPkgManagerVersion();
  if (pkgVersion) {
    updatePackageJson({
      projectDir,
      modifyKey: { packageManager: pkgVersion },
    });
  }

  if (CTX.useAppFolder) {
    fs.removeSync(pagesFolder);
  } else {
    const stylesFolder = path.join(srcFolder, "styles");
    fs.ensureDirSync(stylesFolder);
    fs.moveSync(
      path.join(appFolder, "globals.css"),
      path.join(stylesFolder, "globals.css"),
    );
    fs.moveSync(
      path.join(appFolder, "favicon.ico"),
      path.join(publicFolder, "favicon.ico"),
    );
    removeFiles([path.join(publicFolder, ".gitkeep"), appFolder]);
  }

  if (CTX.useLinters) {
    updatePackageJson({
      projectDir,
      scripts: {
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
      removeDevDeps: ["eslint-config-next"],
    });
    fs.removeSync(path.join(projectDir, ".eslintrc"));
  } else {
    REMOVE_DEV_DEPS.push("@dkshs/eslint-config");
    fs.removeSync(path.join(projectDir, "eslint.config.mjs"));
  }

  if (CTX.useHusky) {
    updatePackageJson({ projectDir, scripts: { prepare: "husky" } });
  } else {
    REMOVE_DEV_DEPS.push("husky");
    fs.removeSync(path.join(projectDir, ".husky"));
  }

  if (CTX.useCommitlint) {
    updatePackageJson({
      projectDir,
      scripts: { commitlint: "commitlint --edit" },
    });
  } else {
    REMOVE_DEV_DEPS.push("@commitlint/cli", "@commitlint/config-conventional");
    const filesToRemove = [path.join(projectDir, ".commitlintrc.json")];
    if (CTX.useHusky) {
      filesToRemove.push(path.join(projectDir, ".husky", "commit-msg"));
    }
    removeFiles(filesToRemove);
  }

  if (CTX.useLintStaged) {
    updatePackageJson({ projectDir, scripts: { "pre-commit": "lint-staged" } });
  } else {
    REMOVE_DEV_DEPS.push("lint-staged");
    updatePackageJson({
      projectDir,
      keys: ["lint-staged"],
    });
  }

  if (!CTX.useEnvValidator) {
    REMOVE_DEPS.push("@t3-oss/env-nextjs", "zod");
    fs.removeSync(path.join(srcFolder, "env.mjs"));
  }

  if (CTX.database === "none") {
    REMOVE_DEPS.push("@prisma/client");
    REMOVE_DEV_DEPS.push("prisma");
    removeFiles([
      path.join(projectDir, "prisma"),
      path.join(srcFolder, "lib", "prisma.ts"),
    ]);
  } else if (CTX.database === "prisma") {
    updatePackageJson({
      projectDir,
      scripts: { postinstall: "prisma generate" },
    });
  }

  if (!CTX.useDockerCompose) {
    fs.removeSync(path.join(projectDir, "docker-compose.yml"));
  }

  if (CTX.authProvider === "clerk") {
    const files = [path.join(srcFolder, "lib", "nextAuth.ts")];
    if (CTX.useAppFolder) {
      files.push(path.join(appFolder, "api", "auth"));
    } else {
      files.push(path.join(pagesFolder, "api", "auth"));
    }
    REMOVE_DEPS.push("next-auth", "@next-auth/prisma-adapter");
    removeFiles(files);
  } else if (CTX.authProvider === "nextAuth") {
    REMOVE_DEPS.push("@clerk/nextjs");
    const files = [path.join(srcFolder, "middleware.ts")];
    if (CTX.useAppFolder) {
      files.push(
        path.join(appFolder, "sign-in"),
        path.join(appFolder, "sign-up"),
      );
    } else {
      files.push(
        path.join(pagesFolder, "sign-in"),
        path.join(pagesFolder, "sign-up"),
      );
    }
    CTX.database !== "prisma" && REMOVE_DEPS.push("@next-auth/prisma-adapter");
    removeFiles(files);
  } else {
    const files = [
      path.join(srcFolder, "lib", "nextAuth.ts"),
      path.join(srcFolder, "middleware.ts"),
    ];
    if (CTX.useAppFolder) {
      files.push(
        path.join(appFolder, "api", "auth"),
        path.join(appFolder, "sign-in"),
        path.join(appFolder, "sign-up"),
      );
    } else {
      files.push(
        path.join(pagesFolder, "api", "auth"),
        path.join(pagesFolder, "sign-in"),
        path.join(pagesFolder, "sign-up"),
      );
    }
    REMOVE_DEPS.push("next-auth", "@next-auth/prisma-adapter", "@clerk/nextjs");
    removeFiles(files);
  }
  if (!CTX.clerkWebhook || CTX.authProvider !== "clerk") {
    const endpoint = [];
    if (CTX.useAppFolder) {
      endpoint.push(path.join(appFolder, "api", "webhook"));
    } else {
      endpoint.push(path.join(pagesFolder, "api", "webhook.ts"));
    }
    REMOVE_DEPS.push("svix", "micro");
    removeFiles(endpoint);
  } else {
    CTX.useAppFolder && REMOVE_DEPS.push("micro");
  }

  if (CTX.authProvider !== "nextAuth" && CTX.database === "none") {
    removeFiles([path.join(srcFolder, "lib")]);
  }
  if (CTX.useAppFolder && CTX.authProvider !== "nextAuth") {
    removeFiles([path.join(appFolder, "api")]);
  }

  updatePackageJson({
    projectDir,
    removeDeps: REMOVE_DEPS,
    removeDevDeps: REMOVE_DEV_DEPS,
  });

  const githubFolder = path.join(projectDir, ".github");
  if (CTX.automatedDepsUpdater === "none") {
    removeFiles([
      path.join(githubFolder, "renovate.json"),
      path.join(githubFolder, "dependabot.yml"),
    ]);
  } else if (CTX.automatedDepsUpdater === "renovate") {
    fs.removeSync(path.join(githubFolder, "dependabot.yml"));
  } else if (CTX.automatedDepsUpdater === "dependabot") {
    fs.removeSync(path.join(githubFolder, "renovate.json"));
  }

  if (CTX.automaticStart) {
    await initializeGit(projectDir);
    await installDependencies(projectDir, CTX.pkgManager);
    CTX.useLinters && (await runLinters(projectDir, CTX.pkgManager));
    await stageAndCommit(projectDir, `Initial commit from ${TEMPLATE_REPO}`);
  }

  await logNextSteps({ ctx: CTX, projectDir, pkgManager: CTX.pkgManager });
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main();
