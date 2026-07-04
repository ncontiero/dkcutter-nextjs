import fs from "node:fs/promises";

export async function appendToGitignore(gitignorePath: string, lines: string) {
  await fs.appendFile(gitignorePath, lines);
}
