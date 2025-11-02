import type {
  AuthProvider,
  AutomatedDepsUpdater,
  ContextProps,
  Database,
  PackageManager,
} from "./utils/types";

import path from "node:path";
import fs from "fs-extra";

import { initializeGit, stageAndCommit } from "./helpers/git";
import { installDependencies } from "./helpers/installDependencies";
import { logNextSteps } from "./helpers/logNextSteps";
import { runLinters } from "./helpers/runLinters";
import { toBoolean } from "./utils/coerce";
import { appendToGitignore, removeFiles } from "./utils/files";
import { getPkgManagerVersion } from "./utils/getPkgManagerVersion";
import { logger } from "./utils/logger";
import { setFlag } from "./utils/setFlag";
import { updatePackageJson } from "./utils/updatePackageJson";

const TEMPLATE_REPO = "ncontiero/dkcutter-nextjs";
const CTX: ContextProps = {
  projectSlug: "{{ dkcutter.projectSlug }}",
  pkgManager: "{{ dkcutter.pkgManager }}" as PackageManager,
  pkgRun: "{{ dkcutter._pkgRun }}",
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
  useCommitlint: toBoolean("{{ dkcutter.useCommitlint }}"),
  useAppFolder: toBoolean("{{ dkcutter.useAppFolder }}"),
  database: "{{ dkcutter.database }}" as Database,
  useDockerCompose: toBoolean("{{ dkcutter.useDockerCompose }}"),
  authProvider: "{{ dkcutter.authProvider }}" as AuthProvider,
  clerkWebhook: toBoolean("{{ dkcutter.clerkWebhook }}"),
  useTriggerDev: toBoolean("{{ dkcutter.useTriggerDev }}"),
  automatedDepsUpdater:
    "{{ dkcutter.automatedDepsUpdater }}" as AutomatedDepsUpdater,
  automaticStart: toBoolean("{{ dkcutter.automaticStart }}"),
};

async function setNextAuthSecretKey(filePath: string) {
  return await setFlag({ filePath, flag: "!!!SET AUTH_SECRET!!!" });
}
async function setBetterAuthSecretKey(filePath: string) {
  return await setFlag({ filePath, flag: "!!!SET BETTER_AUTH_SECRET!!!" });
}

async function setFlagsInEnvs() {
  const envPath = path.join(".env");
  const exampleEnvPath = path.join(".env.example");

  await setNextAuthSecretKey(envPath);
  await setNextAuthSecretKey(exampleEnvPath);

  await setBetterAuthSecretKey(envPath);
  await setBetterAuthSecretKey(exampleEnvPath);
}

async function main() {
  const REMOVE_DEPS = [];
  const REMOVE_DEV_DEPS = [];
  const SCRIPTS: Record<string, string> = {};

  const projectDir = path.resolve(".");
  const srcFolder = path.join(projectDir, "src");
  const publicFolder = path.join(projectDir, "public");
  const pagesFolder = path.join(srcFolder, "pages");
  const appFolder = path.join(srcFolder, "app");

  await setFlagsInEnvs();

  const gitignorePath = path.join(projectDir, ".gitignore");
  await appendToGitignore(
    gitignorePath,
    "\n# local env files\n.env*.local\n.env\n",
  );

  const pkgVersion = await getPkgManagerVersion(CTX.pkgManager);
  if (pkgVersion) {
    await updatePackageJson({
      projectDir,
      modifyKey: { packageManager: pkgVersion },
    });
  } else {
    await updatePackageJson({ projectDir, keys: ["packageManager"] });
  }

  if (CTX.useHusky) {
    SCRIPTS.prepare = "husky";
  } else {
    REMOVE_DEV_DEPS.push("husky");
    await fs.remove(path.join(projectDir, ".husky"));
  }

  if (CTX.useLintStaged) {
    SCRIPTS["pre-commit"] = "lint-staged";
  } else {
    REMOVE_DEV_DEPS.push("lint-staged");
    await updatePackageJson({
      projectDir,
      keys: ["lint-staged"],
    });
  }

  if (CTX.useCommitlint) {
    SCRIPTS.commitlint = "commitlint --edit";
  } else {
    REMOVE_DEV_DEPS.push("@commitlint/cli", "@commitlint/config-conventional");
    await removeFiles([
      path.join(projectDir, ".commitlintrc.json"),
      path.join(projectDir, ".husky", "commit-msg"),
    ]);
  }

  if (CTX.useAppFolder) {
    await fs.remove(pagesFolder);
    SCRIPTS.postinstall = "next typegen";
  } else {
    await fs.move(
      path.join(appFolder, "favicon.ico"),
      path.join(publicFolder, "favicon.ico"),
    );
    await fs.remove(path.join(publicFolder, ".gitkeep"));

    if (
      ["nextAuth", "betterAuth"].includes(CTX.authProvider) ||
      CTX.clerkWebhook
    ) {
      const appDirContents = await fs.readdir(appFolder);
      for (const file of appDirContents) {
        if (file === "api") continue;
        await fs.remove(path.join(appFolder, file));
      }
    } else {
      await fs.remove(appFolder);
    }
  }

  if (CTX.database === "none") {
    REMOVE_DEPS.push(
      "@prisma/adapter-pg",
      "@prisma/client",
      "@auth/prisma-adapter",
    );
    REMOVE_DEV_DEPS.push("prisma");
    await removeFiles([
      path.join(projectDir, "prisma"),
      path.join(srcFolder, "lib", "prisma.ts"),
    ]);
  } else if (CTX.database === "prisma") {
    if (SCRIPTS.postinstall) {
      SCRIPTS.postinstall += " && prisma generate";
    } else {
      SCRIPTS.postinstall = "prisma generate";
    }
  }

  if (!CTX.useDockerCompose) {
    await fs.remove(path.join(projectDir, "docker-compose.yml"));
  }

  const removeNextAuth = async () => {
    REMOVE_DEPS.push("next-auth", "@auth/prisma-adapter");
    await removeFiles([
      path.join(srcFolder, "lib", "auth.ts"),
      path.join(appFolder, "api", "auth", "[...nextauth]"),
    ]);
  };
  const removeClerk = async () => {
    REMOVE_DEPS.push("@clerk/nextjs");
    const folder = CTX.useAppFolder ? appFolder : pagesFolder;
    await removeFiles([
      path.join(srcFolder, "proxy.ts"),
      path.join(appFolder, "api", "webhook"),
      path.join(folder, "sign-in"),
      path.join(folder, "sign-up"),
    ]);
  };
  const removeBetterAuth = async () => {
    REMOVE_DEPS.push("better-auth");
    await removeFiles([
      path.join(srcFolder, "lib", "auth"),
      path.join(appFolder, "api", "auth", "[...all]"),
    ]);
  };
  const removeAuthApiFolder = async () => {
    await fs.remove(path.join(appFolder, "api", "auth"));
  };

  if (CTX.authProvider === "clerk") {
    await removeNextAuth();
    await removeBetterAuth();
    await removeAuthApiFolder();
  } else if (CTX.authProvider === "nextAuth") {
    await removeClerk();
    await removeBetterAuth();
  } else if (CTX.authProvider === "betterAuth") {
    await removeClerk();
    await removeNextAuth();
  } else {
    await removeNextAuth();
    await removeClerk();
    await removeBetterAuth();
    await removeAuthApiFolder();
    await fs.remove(path.join(appFolder, "api"));
  }

  if (
    !["nextAuth", "betterAuth"].includes(CTX.authProvider) &&
    CTX.database === "none"
  ) {
    await fs.remove(path.join(srcFolder, "lib"));
  }

  if (!CTX.useTriggerDev) {
    REMOVE_DEPS.push("@trigger.dev/sdk");
    REMOVE_DEV_DEPS.push("@trigger.dev/build", "trigger.dev", "concurrently");
    await removeFiles([
      path.join(projectDir, "trigger.config.ts"),
      path.join(srcFolder, "trigger"),
    ]);
  } else {
    SCRIPTS["trigger:dev"] = "trigger dev";
    SCRIPTS["trigger:deploy"] = "trigger deploy";
    SCRIPTS.dev = `concurrently --kill-others --names "next,trigger" --prefix-colors "black,green" "next dev" "${CTX.pkgRun} trigger:dev"`;
  }

  await updatePackageJson({
    projectDir,
    removeDeps: REMOVE_DEPS,
    removeDevDeps: REMOVE_DEV_DEPS,
    scripts: SCRIPTS,
  });

  const githubFolder = path.join(projectDir, ".github");
  if (CTX.automatedDepsUpdater === "renovate") {
    await fs.remove(path.join(githubFolder, "dependabot.yml"));
  } else if (CTX.automatedDepsUpdater === "dependabot") {
    await fs.remove(path.join(githubFolder, "renovate.json"));
  } else {
    await removeFiles([
      path.join(githubFolder, "renovate.json"),
      path.join(githubFolder, "dependabot.yml"),
    ]);
  }

  if (CTX.automaticStart) {
    await initializeGit(projectDir);
    await installDependencies(projectDir, CTX.pkgManager);
    await runLinters(projectDir, CTX.pkgManager);
    await stageAndCommit(projectDir, `Initial commit from ${TEMPLATE_REPO}`);
  }

  await logNextSteps({ ctx: CTX, projectDir, pkgManager: CTX.pkgManager });
}

main().catch((error) => {
  logger.error(`An error occurred: ${error}`);
  process.exit(1);
});
