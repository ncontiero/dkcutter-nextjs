import type {
  AuthProvider,
  AutomatedDepsUpdater,
  ContextProps,
  Database,
  PackageManager,
} from "./utils/types";

import fs from "node:fs/promises";
import path from "node:path";
import { logger, remove, rename } from "dkcutter/utils";

import { initializeGit, stageAndCommit } from "./helpers/git";
import { installDependencies } from "./helpers/installDependencies";
import { logNextSteps } from "./helpers/logNextSteps";
import { runLinters } from "./helpers/runLinters";
import { toBoolean } from "./utils/coerce";
import { appendToGitignore, removeFiles } from "./utils/files";
import { getPkgManagerVersion } from "./utils/getPkgManagerVersion";
import { setFlag } from "./utils/setFlag";
import { updatePackageJson } from "./utils/updatePackageJson";

const TEMPLATE_REPO = "ncontiero/dkcutter-nextjs";
const CTX: ContextProps = {
  default: toBoolean("{{ dkcutter.default }}"),
  projectSlug: "{{ dkcutter.projectSlug }}",
  pkgManager: "{{ dkcutter.pkgManager }}" as PackageManager,
  pkgRun: "{{ dkcutter._pkgRun }}",
  useAppFolder: toBoolean("{{ dkcutter.useAppFolder }}"),
  useReactCompiler: toBoolean("{{ dkcutter.useReactCompiler }}"),
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
  useCommitlint: toBoolean("{{ dkcutter.useCommitlint }}"),
  database: "{{ dkcutter.database }}" as Database,
  useDockerCompose: toBoolean("{{ dkcutter.useDockerCompose }}"),
  authProvider: "{{ dkcutter.authProvider }}" as AuthProvider,
  clerkWebhook: toBoolean("{{ dkcutter.clerkWebhook }}"),
  useTriggerDev: toBoolean("{{ dkcutter.useTriggerDev }}"),
  useTanstackQuery: toBoolean("{{ dkcutter.useTanstackQuery }}"),
  automatedDepsUpdater:
    "{{ dkcutter.automatedDepsUpdater }}" as AutomatedDepsUpdater,
  automaticStart: toBoolean("{{ dkcutter.automaticStart }}"),
};

async function setBetterAuthSecretKey(filePath: string) {
  return setFlag({ filePath, flag: "!!!SET BETTER_AUTH_SECRET!!!" });
}

async function setFlagsInEnvs() {
  const envPath = path.join(".env");
  const exampleEnvPath = path.join(".env.example");

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

  const npmrcFiles = [".npmrc"];
  const yarnFiles = [".yarnrc.yml"];
  const pnpmFiles = ["pnpm-workspace.yaml"];
  switch (CTX.pkgManager) {
    case "npm":
      await removeFiles([...yarnFiles, ...pnpmFiles]);
      break;
    case "bun":
      await removeFiles([...npmrcFiles, ...yarnFiles, ...pnpmFiles]);
      break;
    case "yarn":
      await removeFiles([...npmrcFiles, ...pnpmFiles]);
      break;
    case "pnpm":
      await removeFiles([...npmrcFiles, ...yarnFiles]);
      break;
    default:
      break;
  }

  if (!CTX.useReactCompiler) {
    REMOVE_DEV_DEPS.push("babel-plugin-react-compiler");
  }

  if (!CTX.useHusky && !CTX.useLintStaged) {
    REMOVE_DEV_DEPS.push("husky");
    await remove(path.join(projectDir, ".husky"));
  } else if (CTX.useLintStaged) {
    logger.warn("Husky is required for lint-staged. It will be installed.");
    SCRIPTS.prepare = "husky";
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
    await remove(pagesFolder);
    SCRIPTS.postinstall = "next typegen";
  } else {
    await rename(
      path.join(appFolder, "favicon.ico"),
      path.join(publicFolder, "favicon.ico"),
    );
    await remove(path.join(publicFolder, ".gitkeep"));

    if (CTX.authProvider !== "none" || CTX.clerkWebhook) {
      const appDirContents = await fs.readdir(appFolder);
      for (const file of appDirContents) {
        if (file === "api") continue;
        await remove(path.join(appFolder, file));
      }
    } else {
      await remove(appFolder);
    }
  }

  if (CTX.database === "none") {
    REMOVE_DEPS.push(
      "@prisma/adapter-pg",
      "@prisma/client",
      "@auth/prisma-adapter",
      "@better-auth/prisma-adapter",
      "dotenv",
    );
    REMOVE_DEV_DEPS.push("prisma");
    await removeFiles([
      path.join(projectDir, "prisma"),
      path.join(projectDir, "prisma.config.ts"),
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
    await remove(path.join(projectDir, "docker-compose.yml"));
  }

  const removeClerk = async () => {
    REMOVE_DEPS.push("@clerk/nextjs");
    const folder = CTX.useAppFolder ? appFolder : pagesFolder;
    await removeFiles([
      path.join(appFolder, "api", "webhook"),
      path.join(folder, "sign-in"),
      path.join(folder, "sign-up"),
    ]);
  };
  const removeBetterAuth = async () => {
    REMOVE_DEPS.push("better-auth", "@better-auth/prisma-adapter");
    await removeFiles([
      path.join(srcFolder, "lib", "auth"),
      path.join(appFolder, "api", "auth"),
    ]);
  };
  const removeAPIFolder = async () => {
    await remove(path.join(appFolder, "api"));
  };
  const removeProxyFile = async () => {
    await remove(path.join(srcFolder, "proxy.ts"));
  };

  if (CTX.authProvider === "clerk") {
    await removeBetterAuth();
    if (!CTX.clerkWebhook) {
      await removeAPIFolder();
    }
  } else if (CTX.authProvider === "betterAuth") {
    await removeClerk();
  } else {
    await removeClerk();
    await removeBetterAuth();
    await removeProxyFile();
    await removeAPIFolder();
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

  if (!CTX.useTanstackQuery) {
    REMOVE_DEPS.push("@tanstack/react-query");
    REMOVE_DEV_DEPS.push(
      "@tanstack/eslint-plugin-query",
      "@tanstack/react-query-devtools",
    );
    await removeFiles([
      path.join(appFolder, "providers.tsx"),
      path.join(srcFolder, "lib", "query-client.ts"),
    ]);
  }

  if (
    CTX.authProvider !== "betterAuth" &&
    CTX.database === "none" &&
    !CTX.useTanstackQuery
  ) {
    await remove(path.join(srcFolder, "lib"));
  }

  await updatePackageJson({
    projectDir,
    removeDeps: REMOVE_DEPS,
    removeDevDeps: REMOVE_DEV_DEPS,
    scripts: SCRIPTS,
  });

  const githubFolder = path.join(projectDir, ".github");
  if (CTX.automatedDepsUpdater === "renovate") {
    await remove(path.join(githubFolder, "dependabot.yml"));
  } else if (CTX.automatedDepsUpdater === "dependabot") {
    await remove(path.join(githubFolder, "renovate.json"));
  } else {
    await removeFiles([
      path.join(githubFolder, "renovate.json"),
      path.join(githubFolder, "dependabot.yml"),
    ]);
  }

  let hasGitInitialized = false;
  if (CTX.automaticStart) {
    hasGitInitialized = await initializeGit(projectDir, CTX.default);
    await installDependencies(projectDir, CTX.pkgManager);
    await runLinters(projectDir, CTX.pkgManager);
    if (hasGitInitialized) {
      await stageAndCommit(
        projectDir,
        `feat: initial commit from ${TEMPLATE_REPO}`,
      );
    }
  }

  logNextSteps(CTX, hasGitInitialized);
}

main().catch((error) => {
  logger.error("An error occurred:");
  logger.error(error);
  process.exit(1);
});
