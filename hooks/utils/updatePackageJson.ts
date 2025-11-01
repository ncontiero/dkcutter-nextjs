import type { PackageJson } from "type-fest";

import path from "node:path";
import fs from "fs-extra";

interface UpdatePackageJsonProps {
  removeDeps?: string[];
  removeDevDeps?: string[];
  scripts?: PackageJson["scripts"];
  keys?: string[];
  modifyKey?: Record<string, string>;
  projectDir: string;
}

export async function updatePackageJson({
  removeDeps = [],
  removeDevDeps = [],
  scripts = {},
  keys = [],
  modifyKey = {},
  projectDir,
}: UpdatePackageJsonProps) {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJSON(packageJsonPath);

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  removeDeps.forEach((dependency) => {
    delete packageJson.dependencies[dependency];
  });
  removeDevDeps.forEach((dependency) => {
    delete packageJson.devDependencies[dependency];
  });
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  keys.forEach((key) => {
    delete packageJson[key];
  });

  if (Object.keys(modifyKey).length > 0) {
    Object.entries(modifyKey).forEach(([key, value]) => {
      packageJson[key] = value;
    });
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  return packageJson;
}
