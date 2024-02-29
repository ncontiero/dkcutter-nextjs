import path from "node:path";
import { execa } from "execa";
import fs from "fs-extra";

import { logger } from "./utils/logger";
import { handleError } from "./utils/handleError";
import { env } from "./utils/env";

const PATTERN = /{{(\s?dkcutter)[.](.*?)}}/;

const SUPPORTED_COMBINATIONS = [
  { useLinters: false },
  { useHusky: true },
  { useLintStaged: true, useHusky: true },
  { useCommitlint: true },
  { useAppFolder: false },
  { database: "prisma" },
  { database: "prisma", useDockerCompose: true },
  { authProvider: "clerk" },
  { authProvider: "clerk", clerkWebhook: true },
  { authProvider: "nextAuth" },
  { useEnvValidator: true },
  { automatedDepsUpdater: "renovate" },
  { automatedDepsUpdater: "dependabot" },
  // Complex combinations
  { useLinters: true, useHusky: true, useLintStaged: true },
  {
    useLinters: true,
    useHusky: true,
    useLintStaged: true,
    useCommitlint: true,
  },
  { database: "prisma", authProvider: "clerk" },
  { database: "prisma", authProvider: "clerk", clerkWebhook: true },
  { database: "prisma", authProvider: "clerk", useEnvValidator: true },
  { database: "prisma", authProvider: "clerk", useAppFolder: false },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useEnvValidator: true,
  },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
  },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
    useEnvValidator: true,
  },
  { authProvider: "clerk", clerkWebhook: true, useAppFolder: false },
  { authProvider: "clerk", clerkWebhook: true, useEnvValidator: true },
  {
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
    useEnvValidator: true,
  },
  { database: "prisma", authProvider: "nextAuth" },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useEnvValidator: true,
  },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useAppFolder: false,
  },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useAppFolder: false,
    useEnvValidator: true,
  },
  { authProvider: "nextAuth", useAppFolder: false },
  { authProvider: "nextAuth", useEnvValidator: true },
  {
    authProvider: "nextAuth",
    useAppFolder: false,
    useEnvValidator: true,
  },
  { database: "prisma", useEnvValidator: true },
];
const UNSUPPORTED_COMBINATIONS = [
  { database: "XXXXXX" },
  { authProvider: "non" },
  { automatedDepsUpdater: "xpto" },
];
const INVALID_SLUGS = ["", " ", "Test", "teSt", "tes1@", "t!es", "test test"];

/**
 * Build a list containing absolute paths to the generated files.
 */
function buildFilesList(baseDir: string) {
  const files = fs.readdirSync(baseDir);
  const paths: string[] = [];
  files.forEach((file) => {
    const filePath = path.join(baseDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      paths.push(...buildFilesList(filePath));
    } else {
      paths.push(filePath);
    }
  });
  return paths;
}

/**
 * Method to check all paths have correct substitutions.
 */
function checkPaths(paths: string[]) {
  for (const path of paths) {
    const content = fs.readFileSync(path, "utf-8");
    const matches = content.match(PATTERN);
    if (matches) {
      throw new Error(
        `Found match in ${path} at line ${matches.index} with value ${matches[0]}`,
      );
    }
  }
}

async function generateProject(args: string[] = [], output: string = ".test") {
  logger.info(
    `Generating project ${args[1]} with args: ${args.slice(2).join(" ")}`,
  );
  await execa("pnpm", ["generate", "-o", output, ...args, "-y"]);
  const paths = buildFilesList(path.join(output, args[1]));
  checkPaths(paths);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function constructArgs(combination: { [key: string]: any }) {
  const args = ["--projectName", generateRandomString(8)];
  for (const [item, value] of Object.entries(combination)) {
    args.push(`--${item}`, value);
  }
  return args;
}

async function testCMDPassesFunc(
  cmd: string,
  projectDir: string,
  args: string[] = [],
  skipEnvValidation = false,
) {
  const cmdCapitalized = cmd.charAt(0).toUpperCase() + cmd.slice(1);
  const result = await execa(cmd, args, {
    cwd: projectDir,
    env: { SKIP_ENV_VALIDATION: `${skipEnvValidation}`, ...env },
  });
  if (result.failed) {
    throw new Error(`${cmdCapitalized} failed`);
  }
  logger.success(`✓ ${cmdCapitalized} passed`);
}

async function testNextLintPasses(projectDir: string) {
  const args = ["lint", "--dir", "."];
  await testCMDPassesFunc("next", projectDir, args);
}

async function testPrettierPasses(projectDir: string) {
  const ignore = ["--ignore-path", path.resolve(".prettierignore")];
  const args = [".", "-c", ...ignore];
  await testCMDPassesFunc("prettier", projectDir, args);
}

async function main() {
  let test = ".test";
  await fs.ensureDir(test);
  test = path.resolve(test);
  let testsPassed = 0;

  for (const combination of SUPPORTED_COMBINATIONS) {
    const args = constructArgs(combination);
    try {
      await generateProject(args);
      const projectDir = path.join(test, args[1]);
      await testNextLintPasses(projectDir);
      await testCMDPassesFunc("eslint", projectDir);
      await testPrettierPasses(projectDir);
      logger.success(`✓ All checks passed for project ${args[1]}`);
      logger.break();
      testsPassed += 4;
    } catch (e) {
      handleError(
        `Failed to generate project ${args[1]} with args: ${args
          .slice(2)
          .join(" ")}\n${e.message}`,
      );
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
    handleError(
      `Unsupported Combinations: Expected ${UNSUPPORTED_COMBINATIONS.length} errors, but got ${pass}`,
    );
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
    handleError(
      `Project Slug: Expected ${INVALID_SLUGS.length} errors, but got ${pass}`,
    );
  }

  logger.info(`Tests Passed: ${testsPassed}`);
  logger.success("✓ All tests passed");
  await fs.remove(test);
}

main();
