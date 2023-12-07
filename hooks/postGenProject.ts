import type { PackageManager } from "./utils/types";

import fs from "fs-extra";
import path from "path";

import { initializeGit, stageAndCommit } from "./helpers/git";
import { installDependencies } from "./helpers/installDependencies";
import { runLinters } from "./helpers/runLinters";
import { logNextSteps } from "./helpers/logNextSteps";
import { updatePackageJson } from "./utils/updatePackageJson";
import { updateEslint } from "./utils/updateEslint";
import { toBoolean } from "./utils/coerce";

const TEMPLATE_REPO = "dkshs/dkcutter-nextjs";
const CTX = {
  projectSlug: "{{ projectSlug }}",
  pkgManager: "{{ dkcutter.pkgManager }}" as PackageManager,
  useAppFolder: toBoolean("{{ useAppFolder }}"),
  useLinters: toBoolean("{{ useLinters }}"),
  useHusky: toBoolean("{{ useHusky }}"),
  useLintStaged: toBoolean("{{ useLintStaged }}"),
  useEnvValidator: toBoolean("{{ useEnvValidator }}"),
  database: "{{ database }}",
  useDockerCompose: toBoolean("{{ useDockerCompose }}"),
  authProvider: "{{ authProvider }}",
  clerkWebhook: toBoolean("{{ clerkWebhook }}"),
  automaticStart: toBoolean("{{ automaticStart }}"),
};

function appendToGitignore(gitignorePath: string, lines: string) {
  fs.appendFileSync(gitignorePath, lines);
}

function removeFiles(files: string[]) {
  files.forEach((file) => fs.removeSync(file));
}

async function main() {
  const projectDir = path.resolve(".");
  const srcFolder = path.join(projectDir, "src");
  const publicFolder = path.join(projectDir, "public");
  const pagesFolder = path.join(srcFolder, "pages");
  const appFolder = path.join(srcFolder, "app");

  const gitignorePath = path.join(projectDir, ".gitignore");
  appendToGitignore(gitignorePath, "\n# local env files\n.env*.local\n.env\n");

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
        lint: "next lint --dir . && eslint . && prettier . -c",
        "lint:fix": "eslint --fix . && prettier . -w",
      },
    });
  } else {
    updatePackageJson({
      projectDir,
      removeDevDeps: ["prettier-plugin-tailwindcss", "@dkshs/eslint-config"],
    });
    updateEslint({ projectDir, extendsConfig: ["@dkshs/eslint-config/react"] });
    removeFiles([
      path.join(projectDir, "prettier.config.js"),
      path.join(projectDir, ".prettierignore"),
    ]);
  }

  if (CTX.useHusky) {
    updatePackageJson({ projectDir, scripts: { prepare: "husky install" } });
  } else {
    updatePackageJson({ projectDir, removeDevDeps: ["husky"] });
    fs.removeSync(path.join(projectDir, ".husky"));
  }

  if (CTX.useLintStaged) {
    updatePackageJson({ projectDir, scripts: { "pre-commit": "lint-staged" } });
  } else {
    updatePackageJson({
      projectDir,
      removeDevDeps: ["lint-staged"],
      keys: ["lint-staged"],
    });
  }

  if (!CTX.useEnvValidator) {
    fs.removeSync(path.join(srcFolder, "env.mjs"));
    updatePackageJson({
      projectDir,
      removeDeps: ["@t3-oss/env-nextjs", "zod"],
    });
  }

  if (CTX.database === "none") {
    updatePackageJson({
      projectDir,
      removeDevDeps: ["prisma", "@prisma/client"],
    });
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
    updatePackageJson({
      projectDir,
      removeDeps: ["next-auth", "@next-auth/prisma-adapter"],
    });
    removeFiles(files);
  } else if (CTX.authProvider === "nextAuth") {
    const removeDeps = ["@clerk/nextjs"];
    const files = [path.join(srcFolder, "middleware.ts")];
    if (CTX.useAppFolder) {
      files.push(path.join(appFolder, "sign-in"));
      files.push(path.join(appFolder, "sign-up"));
    } else {
      files.push(path.join(pagesFolder, "sign-in"));
      files.push(path.join(pagesFolder, "sign-up"));
    }
    CTX.database !== "prisma" && removeDeps.push("@next-auth/prisma-adapter");
    updatePackageJson({ projectDir, removeDeps });
    removeFiles(files);
  } else {
    const files = [
      path.join(srcFolder, "lib", "nextAuth.ts"),
      path.join(srcFolder, "middleware.ts"),
    ];
    if (CTX.useAppFolder) {
      files.push(path.join(appFolder, "api", "auth"));
      files.push(path.join(appFolder, "sign-in"));
      files.push(path.join(appFolder, "sign-up"));
    } else {
      files.push(path.join(pagesFolder, "api", "auth"));
      files.push(path.join(pagesFolder, "sign-in"));
      files.push(path.join(pagesFolder, "sign-up"));
    }
    CTX.database === "none" && files.push(path.join(srcFolder, "lib"));
    updatePackageJson({
      projectDir,
      removeDeps: ["next-auth", "@next-auth/prisma-adapter", "@clerk/nextjs"],
    });
    removeFiles(files);
  }
  if (!CTX.clerkWebhook || CTX.authProvider !== "clerk") {
    const endpoint = [];
    if (CTX.useAppFolder) {
      endpoint.push(path.join(appFolder, "api", "webhook"));
    } else {
      endpoint.push(path.join(pagesFolder, "api", "webhook.ts"));
    }
    updatePackageJson({ projectDir, removeDeps: ["svix", "micro"] });
    removeFiles(endpoint);
  } else {
    CTX.useAppFolder &&
      updatePackageJson({ projectDir, removeDeps: ["micro"] });
  }

  if (CTX.automaticStart) {
    await initializeGit(projectDir);
    await installDependencies(projectDir, CTX.pkgManager);
    CTX.useLinters && (await runLinters(projectDir, CTX.pkgManager));
    await stageAndCommit(projectDir, `Initial commit from ${TEMPLATE_REPO}`);
  }

  await logNextSteps({ ctx: CTX, projectDir, pkgManager: CTX.pkgManager });
}

main();
