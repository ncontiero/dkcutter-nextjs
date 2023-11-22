import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

import { updatePackageJson, updateEslint } from "./helpers/index.js";
import { initializeGit, stageAndCommit } from "./helpers/git.js";

const TEMPLATE_REPO = "dkshs/dkcutter-nextjs";
const CTX = {
  pkgManager: "{{ dkcutter.pkgManager }}",
  useAppFolder: "{{ useAppFolder }}" === "true",
  useLinters: "{{ useLinters }}" === "true",
  useHusky: "{{ useHusky }}" === "true",
  useLintStaged: "{{ useLintStaged }}" === "true",
  useEnvValidator: "{{ useEnvValidator }}" === "true",
  database: "{{ database }}",
  useDockerCompose: "{{ useDockerCompose }}" === "true",
  automaticStart: "{{ automaticStart }}" === "true",
};

function appendToGitignore(gitignorePath, lines) {
  fs.appendFileSync(gitignorePath, lines);
}

function removeFiles(files) {
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

  if (CTX.automaticStart) {
    await initializeGit({ projectDir });
    await execa(CTX.pkgManager, ["install"]);
    CTX.useLinters && (await execa(CTX.pkgManager, ["run", "lint:fix"]));
    await stageAndCommit({
      projectDir,
      message: `Initial commit from ${TEMPLATE_REPO}`,
    });
  }
}

main();
