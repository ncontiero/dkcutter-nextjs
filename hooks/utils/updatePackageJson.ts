import { getPackageInfo, writeJsonFile } from "dkcutter/utils";

interface UpdatePackageJsonProps {
  removeDeps?: string[];
  removeDevDeps?: string[];
  scripts?: Awaited<
    ReturnType<typeof getPackageInfo>
  >["packageJson"]["scripts"];
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
  const { packageJsonPath, packageJson } = await getPackageInfo(projectDir);

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  removeDeps.forEach((dependency) => {
    delete packageJson.dependencies?.[dependency];
  });
  removeDevDeps.forEach((dependency) => {
    delete packageJson.devDependencies?.[dependency];
  });
  packageJson.scripts = scripts;
  keys.forEach((key) => {
    delete packageJson[key];
  });

  if (Object.keys(modifyKey).length > 0) {
    Object.entries(modifyKey).forEach(([key, value]) => {
      packageJson[key] = value;
    });
  }

  await writeJsonFile(packageJsonPath, packageJson);

  return packageJson;
}
