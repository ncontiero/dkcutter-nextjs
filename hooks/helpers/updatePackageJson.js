import fs from "fs-extra";
import path from "path";

export function updatePackageJson({
  removeDeps = [],
  removeDevDeps = [],
  scripts = {},
  keys = [],
  projectDir,
}) {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = fs.readJSONSync(packageJsonPath);

  removeDeps.forEach((dependency) => {
    delete packageJson.dependencies?.[dependency];
  });
  removeDevDeps.forEach((dependency) => {
    delete packageJson.devDependencies?.[dependency];
  });
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  keys.forEach((key) => {
    delete packageJson[key];
  });

  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

  return packageJson;
}
