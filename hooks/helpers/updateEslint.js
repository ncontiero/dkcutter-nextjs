import fs from "fs-extra";
import path from "path";

export function updateEslint({ projectDir, extendsConfig = [] }) {
  const eslintPath = path.join(projectDir, ".eslintrc");
  const eslintJson = fs.readJsonSync(eslintPath);

  const extendsSet = new Set(eslintJson.extends);

  extendsConfig.forEach((extend) => {
    if (extendsSet.has(extend)) {
      extendsSet.delete(extend);
    } else {
      extendsSet.add(extend);
    }
  });

  eslintJson.extends = Array.from(extendsSet).sort();
  fs.writeJsonSync(eslintPath, eslintJson, { spaces: 2 });

  return eslintJson;
}
