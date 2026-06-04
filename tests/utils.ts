import fs from "node:fs/promises";
import path from "node:path";
import { PATTERN } from "./constants";

/**
 * Build a list containing absolute paths to the generated files.
 */
export async function buildFilesList(baseDir: string) {
  const files = await fs.readdir(baseDir);
  const paths: string[] = [];
  for (const file of files) {
    const filePath = path.join(baseDir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      paths.push(...(await buildFilesList(filePath)));
    } else {
      paths.push(filePath);
    }
  }
  return paths;
}

/**
 * Method to check all paths have correct substitutions.
 */
export async function checkPaths(paths: string[]) {
  for (const path of paths) {
    const content = await fs.readFile(path, "utf-8");
    const matches = content.match(PATTERN);
    if (matches) {
      throw new Error(
        `Found match in ${path} at line ${matches.index} with value ${matches[0]}`,
      );
    }
  }
}

export interface Combination {
  [key: string]: string | boolean;
}

/**
 * Construct the args for the project.
 */
export function constructArgs(combination: Combination) {
  const args: string[] = [];
  let name = "";
  for (const [item, value] of Object.entries(combination)) {
    name += `${item}-${value}_`.replace(" ", "");
    args.push(`--${item}`, String(value));
  }
  name = name.slice(0, -1);
  const projectName = name.toLowerCase();
  const projectNameWithRandomSuffix = projectName
    .slice(0, 16)
    .concat(Math.random().toString().slice(2, 14));
  args.unshift("--projectName", projectNameWithRandomSuffix);
  return { args, testName: projectName, name: projectNameWithRandomSuffix };
}
