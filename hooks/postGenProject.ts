import type {
  AuthProvider,
  AutomatedDepsUpdater,
  ContextProps,
  I18n,
  PackageManager,
} from "./utils/types";

import fs from "node:fs/promises";
import path from "node:path";
import { getPackageInfo, logger, remove } from "dkcutter/utils";

import { initializeGit, stageAndCommit } from "./helpers/git";
import { installDependencies } from "./helpers/installDependencies";
import { logNextSteps } from "./helpers/logNextSteps";
import { toBoolean } from "./utils/coerce";
import { appendToGitignore } from "./utils/files";
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
  authProvider: "{{ dkcutter.authProvider }}" as AuthProvider,
  i18n: "{{ dkcutter.i18n }}" as I18n,
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
  useNanoStaged: toBoolean("{{ dkcutter.useNanoStaged }}"),
  useCommitlint: toBoolean("{{ dkcutter.useCommitlint }}"),
  useReactCompiler: toBoolean("{{ dkcutter.useReactCompiler }}"),
  useReactHookForm: toBoolean("{{ dkcutter.useReactHookForm }}"),
  usePrisma: toBoolean("{{ dkcutter.usePrisma }}"),
  useTriggerDev: toBoolean("{{ dkcutter.useTriggerDev }}"),
  useTanstackQuery: toBoolean("{{ dkcutter.useTanstackQuery }}"),
  useShadcn: toBoolean("{{ dkcutter.useShadcn }}"),
  useTailwindTypography: toBoolean("{{ dkcutter.useTailwindTypography }}"),
  useUnpic: toBoolean("{{ dkcutter.useUnpic }}"),
  useDockerCompose: toBoolean("{{ dkcutter.useDockerCompose }}"),
  useClerkWebhook: toBoolean("{{ dkcutter.useClerkWebhook }}"),
  automatedDepsUpdater:
    "{{ dkcutter.automatedDepsUpdater }}" as AutomatedDepsUpdater,
  installDependencies: toBoolean("{{ dkcutter.installDependencies }}"),
  initializeGit: toBoolean("{{ dkcutter.initializeGit }}"),
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
  const projectDir = path.resolve(".");
  const srcFolder = path.join(projectDir, "src");
  const publicFolder = path.join(projectDir, "public");
  const pagesFolder = path.join(srcFolder, "pages");
  const appFolder = path.join(srcFolder, "app");
  const libFolder = path.join(srcFolder, "lib");

  const { packageJson } = await getPackageInfo(projectDir);

  const REMOVE_DEPS: string[] = [];
  const REMOVE_DEV_DEPS: string[] = [];
  const SCRIPTS = packageJson.scripts || {};
  const FILES_TO_REMOVE: string[] = [];

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

  const npmrcFiles = ".npmrc";
  const yarnFiles = ".yarnrc.yml";
  const pnpmFiles = "pnpm-workspace.yaml";
  switch (CTX.pkgManager) {
    case "npm":
      FILES_TO_REMOVE.push(yarnFiles, pnpmFiles);
      break;
    case "bun":
      FILES_TO_REMOVE.push(npmrcFiles, yarnFiles, pnpmFiles);
      break;
    case "yarn":
      FILES_TO_REMOVE.push(npmrcFiles, pnpmFiles);
      break;
    case "pnpm":
      FILES_TO_REMOVE.push(npmrcFiles, yarnFiles);
      break;
  }

  if (CTX.useAppFolder) {
    FILES_TO_REMOVE.push(pagesFolder, path.join(publicFolder, "favicon.ico"));
  } else {
    delete SCRIPTS.postinstall;

    if (CTX.authProvider === "betterAuth" || CTX.useClerkWebhook) {
      const appDirContents = await fs.readdir(appFolder);
      for (const file of appDirContents) {
        if (file === "api") continue;
        FILES_TO_REMOVE.push(path.join(appFolder, file));
      }
    } else {
      FILES_TO_REMOVE.push(appFolder);
    }
  }

  const removeClerk = () => {
    REMOVE_DEPS.push("@clerk/nextjs");
    const folder = CTX.useAppFolder ? appFolder : pagesFolder;
    FILES_TO_REMOVE.push(
      path.join(appFolder, "api", "webhook"),
      path.join(folder, "sign-in"),
      path.join(folder, "sign-up"),
    );
  };
  const removeBetterAuth = () => {
    REMOVE_DEPS.push("better-auth", "@better-auth/prisma-adapter");
    FILES_TO_REMOVE.push(
      path.join(srcFolder, "lib", "auth"),
      path.join(appFolder, "api", "auth"),
    );
  };
  const removeAPIFolder = () => {
    FILES_TO_REMOVE.push(path.join(appFolder, "api"));
  };

  if (CTX.authProvider === "clerk") {
    removeBetterAuth();
    if (!CTX.useClerkWebhook) {
      removeAPIFolder();
    }
  } else if (CTX.authProvider === "betterAuth") {
    removeClerk();
  } else {
    removeClerk();
    removeBetterAuth();
    removeAPIFolder();
  }

  const i18nFolder = path.join(srcFolder, "i18n");
  const removeNextIntl = () => {
    REMOVE_DEPS.push("next-intl");
    FILES_TO_REMOVE.push(
      path.join(projectDir, "project.inlang"),
      i18nFolder,
      path.join(appFolder, "[locale]"),
    );
  };
  if (CTX.i18n === "none") {
    removeNextIntl();
  } else if (CTX.i18n === "nextIntl" && !CTX.useAppFolder) {
    FILES_TO_REMOVE.push(path.join(i18nFolder, "request.ts"));
  }

  if (CTX.i18n === "none" && CTX.authProvider === "none") {
    FILES_TO_REMOVE.push(path.join(srcFolder, "proxy.ts"));
  }

  if (!CTX.useHusky && !CTX.useLintStaged && !CTX.useNanoStaged) {
    REMOVE_DEV_DEPS.push("husky");
    FILES_TO_REMOVE.push(path.join(projectDir, ".husky"));
    delete SCRIPTS.prepare;
  } else if (CTX.useLintStaged || CTX.useNanoStaged) {
    logger.warn(
      "Husky is required for lint-staged or nano-staged. It will be installed.",
    );
  }

  const removeLintStaged = () => {
    REMOVE_DEV_DEPS.push("lint-staged");
  };
  if (!CTX.useLintStaged) {
    removeLintStaged();
    await updatePackageJson({ projectDir, keys: ["lint-staged"] });
  }

  if (!CTX.useNanoStaged) {
    REMOVE_DEV_DEPS.push("nano-staged");
  }

  if (CTX.useLintStaged && CTX.useNanoStaged) {
    removeLintStaged();
    logger.warn(
      "You have selected both lint-staged and nano-staged. nano-staged will be used for the pre-commit script.",
    );
  }
  if (!CTX.useLintStaged && !CTX.useNanoStaged) {
    delete SCRIPTS["pre-commit"];
    FILES_TO_REMOVE.push(path.join(projectDir, ".husky", "pre-commit"));
  }

  if (!CTX.useCommitlint) {
    REMOVE_DEV_DEPS.push("@commitlint/cli", "@commitlint/config-conventional");
    FILES_TO_REMOVE.push(
      path.join(projectDir, ".commitlintrc.json"),
      path.join(projectDir, ".husky", "commit-msg"),
    );
    delete SCRIPTS["commit-msg"];
  }

  if (!CTX.useReactCompiler) {
    REMOVE_DEV_DEPS.push("babel-plugin-react-compiler");
  }

  if (!CTX.useReactHookForm) {
    REMOVE_DEPS.push("@hookform/resolvers", "react-hook-form");
  }

  if (CTX.usePrisma) {
    const dbGenerate = `${CTX.pkgRun} db:generate`;
    SCRIPTS.build = `${dbGenerate} && ${SCRIPTS.build}`;
    const existing = SCRIPTS.postinstall ? `${SCRIPTS.postinstall} && ` : "";
    SCRIPTS.postinstall = existing + dbGenerate;
  } else {
    REMOVE_DEPS.push(
      "@better-auth/prisma-adapter",
      "@prisma/adapter-pg",
      "@prisma/client",
    );
    REMOVE_DEV_DEPS.push("dotenv-cli", "prisma");
    FILES_TO_REMOVE.push(
      path.join(projectDir, "prisma"),
      path.join(projectDir, "prisma.config.ts"),
      path.join(libFolder, "prisma.ts"),
    );
    delete SCRIPTS["db:generate"];
    delete SCRIPTS["db:push"];
    delete SCRIPTS["db:migrate"];
    delete SCRIPTS["db:studio"];
    delete SCRIPTS["db:seed"];
  }

  if (CTX.useTriggerDev) {
    const newDevScript = `concurrently --kill-others --names "next,trigger" --prefix-colors "black,green" "${SCRIPTS.dev}" "${CTX.pkgRun} trigger:dev"`;
    SCRIPTS.dev = newDevScript;
  } else {
    REMOVE_DEPS.push("@trigger.dev/sdk");
    REMOVE_DEV_DEPS.push("@trigger.dev/build", "trigger.dev", "concurrently");
    FILES_TO_REMOVE.push(
      path.join(projectDir, "trigger.config.ts"),
      path.join(srcFolder, "trigger"),
    );
    delete SCRIPTS["trigger:dev"];
    delete SCRIPTS["trigger:deploy"];
  }

  if (!CTX.useTanstackQuery) {
    REMOVE_DEPS.push("@tanstack/react-query");
    REMOVE_DEV_DEPS.push(
      "@tanstack/eslint-plugin-query",
      "@tanstack/react-query-devtools",
    );
    FILES_TO_REMOVE.push(
      path.join(appFolder, "providers.tsx"),
      path.join(appFolder, "[locale]", "providers.tsx"),
      path.join(srcFolder, "lib", "query-client.ts"),
    );
  }

  if (!CTX.useShadcn) {
    REMOVE_DEPS.push(
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "tailwind-merge",
    );
    REMOVE_DEV_DEPS.push("shadcn", "tw-animate-css");
    FILES_TO_REMOVE.push(
      path.join(projectDir, "components.json"),
      path.join(libFolder, "utils.ts"),
    );
  }

  if (!CTX.useTailwindTypography) {
    REMOVE_DEPS.push("@tailwindcss/typography");
  }

  if (!CTX.useUnpic) {
    REMOVE_DEPS.push("@unpic/react");
  }

  if (
    !CTX.usePrisma &&
    !CTX.useTanstackQuery &&
    !CTX.useShadcn &&
    CTX.authProvider !== "betterAuth"
  ) {
    FILES_TO_REMOVE.push(libFolder);
  }

  if (!CTX.useDockerCompose) {
    FILES_TO_REMOVE.push(path.join(projectDir, "docker-compose.yml"));
  }

  const githubFolder = path.join(projectDir, ".github");
  const removeDependabot = () => {
    FILES_TO_REMOVE.push(path.join(githubFolder, "dependabot.yml"));
  };
  const removeRenovate = () => {
    FILES_TO_REMOVE.push(path.join(githubFolder, "renovate.json"));
  };

  if (CTX.automatedDepsUpdater === "renovate") {
    removeDependabot();
  } else if (CTX.automatedDepsUpdater === "dependabot") {
    removeRenovate();
  } else {
    removeDependabot();
    removeRenovate();
  }

  await updatePackageJson({
    projectDir,
    removeDeps: REMOVE_DEPS,
    removeDevDeps: REMOVE_DEV_DEPS,
    scripts: SCRIPTS,
  });

  for (const file of FILES_TO_REMOVE) {
    await remove(file);
  }

  let hasGitInitialized = false;
  if (CTX.initializeGit) {
    hasGitInitialized = await initializeGit(projectDir, CTX.default);
  }
  if (CTX.installDependencies) {
    await installDependencies(projectDir, CTX.pkgManager);
  }
  if (CTX.initializeGit && hasGitInitialized) {
    await stageAndCommit(
      projectDir,
      `feat: initial commit from ${TEMPLATE_REPO}`,
    );
  }

  logNextSteps(CTX, hasGitInitialized);
}

main().catch((error) => {
  logger.error("An error occurred:");
  logger.error(error);
  process.exit(1);
});
