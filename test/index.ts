import path from "node:path";
import { execa } from "execa";
import fs from "fs-extra";

import { logger } from "./logger";

const SUPPORTED_COMBINATIONS = [
  { useHusky: true },
  { useHusky: false },
  { useLintStaged: true, useHusky: true },
  { useLintStaged: false },
  { useLinters: true },
  { useLinters: false },
  { useAppFolder: true },
  { useAppFolder: false },
  { database: "prisma" },
  { database: "none" },
  { database: "prisma", useDockerCompose: true },
  { useEnvValidator: true },
  { useEnvValidator: false },
];
const UNSUPPORTED_COMBINATIONS = [{ database: "XXXXXX" }];
const INVALID_SLUGS = ["", " ", "Test", "teSt", "tes1@", "t!es"];

async function generateProject(args: string[] = []) {
  logger.info(
    `Generating project ${args[1]} with args: ${args.slice(2).join(" ")}`,
  );
  await execa("pnpm", ["generate", ...args, "-y"]);
  logger.success(`✓ Project ${args[1]} generated`);
}

function generateRandomString(n: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * characters.length);
    result += characters.charAt(index);
  }
  return result;
}

async function runLinters(project: string) {
  try {
    const ignore = ["--ignore-path", path.resolve(".prettierignore")];
    const eslintCmd = ["eslint", "."];
    const prettierCmd = ["prettier", ".", "-c", ...ignore];
    await execa("pnpm", eslintCmd, { cwd: project });
    await execa("pnpm", prettierCmd, { cwd: project });
    logger.success("✓ Linting passed");
    logger.break();
  } catch (e) {
    logger.error("Linting failed");
    logger.error(e.message);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function constructArgs(combination: { [key: string]: any }) {
  const args = ["--projectName", generateRandomString(8)];
  for (const [item, value] of Object.entries(combination)) {
    args.push(`--${item}`, value);
  }
  return args;
}

async function main() {
  let test = ".test";
  await fs.ensureDir(test);
  test = path.resolve(".test");
  let testsPassed = 0;

  for (const combination of SUPPORTED_COMBINATIONS) {
    const args = constructArgs(combination);
    try {
      await generateProject(args);
      const project = path.resolve(args[1]);
      await runLinters(project);
      await fs.move(project, path.resolve(test, args[1]));
      testsPassed += 1;
    } catch (e) {
      logger.error(
        `Failed to generate project ${args[1]} with args: ${args
          .slice(2)
          .join(" ")}`,
      );
      logger.error(e.message);
      process.exit(1);
    }
  }

  let pass = 0;
  for (const combination of UNSUPPORTED_COMBINATIONS) {
    const args = constructArgs(combination);
    try {
      await generateProject(args);
    } catch (e) {
      logger.success(
        `✓ Expected error when creating project ${args[1]} with args: ${args
          .slice(2)
          .join(" ")}`,
      );
      logger.break();
      pass += 1;
      testsPassed += 1;
      continue;
    }
  }
  if (pass !== UNSUPPORTED_COMBINATIONS.length) {
    logger.error(
      `Unsupported Combinations: Expected ${UNSUPPORTED_COMBINATIONS.length} errors, but got ${pass}`,
    );
    process.exit(1);
  }

  pass = 0;
  for (const slug of INVALID_SLUGS) {
    const args = constructArgs({ projectSlug: slug });
    try {
      await generateProject(args);
    } catch (e) {
      logger.success(
        `✓ Expected error when creating project ${args[1]} with slug "${slug}"`,
      );
      logger.break();
      pass += 1;
      testsPassed += 1;
      continue;
    }
  }
  if (pass !== INVALID_SLUGS.length) {
    logger.error(
      `Project Slug: Expected ${INVALID_SLUGS.length} errors, but got ${pass}`,
    );
    process.exit(1);
  }

  logger.info(`Tests Passed: ${testsPassed}`);
  logger.success("✓ All tests passed");
  await fs.remove(test);
}

main();
