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

  const gitignorePath = path.join(projectDir, ".gitignore");
  appendToGitignore(gitignorePath, "\n# local env files\n.env*.local\n.env\n");

  if (CTX.useAppFolder) {
    fs.removeSync(path.join(srcFolder, "pages"));
  } else {
    const stylesFolder = path.join(srcFolder, "styles");
    fs.mkdirSync(stylesFolder);
    fs.moveSync(
      path.join(srcFolder, "app", "globals.css"),
      path.join(stylesFolder, "globals.css"),
    );
    removeFiles([
      path.join(publicFolder, ".gitkeep"),
      path.join(srcFolder, "app"),
    ]);
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
      removeDevDeps: ["prisma"],
    });
    removeFiles([path.join(projectDir, "prisma"), path.join(srcFolder, "lib")]);
  } else if (CTX.database === "prisma") {
    updatePackageJson({
      projectDir,
      scripts: { postinstall: "prisma generate" },
    });
  }

  if (!CTX.useDockerCompose) {
    fs.removeSync(path.join(projectDir, "docker-compose.yml"));
  }

  if (CTX.authProvider === "none") {
    const middleware = path.join(srcFolder, "middleware.ts");
    const pages = [];
    if (CTX.useAppFolder) {
      pages.push(path.join(srcFolder, "app", "sign-in"));
      pages.push(path.join(srcFolder, "app", "sign-up"));
    } else {
      pages.push(path.join(srcFolder, "pages", "sign-in"));
      pages.push(path.join(srcFolder, "pages", "sign-up"));
    }
    updatePackageJson({ projectDir, removeDeps: ["@clerk/nextjs"] });
    removeFiles([middleware, ...pages]);
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
