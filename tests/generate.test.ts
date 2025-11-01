import { resolve } from "node:path";
import { execa } from "execa";
import fs from "fs-extra";
import { afterAll, beforeAll, it as vitestIt } from "vitest";

import {
  INVALID_SLUGS,
  SUPPORTED_COMBINATIONS,
  UNSUPPORTED_COMBINATIONS,
} from "./constants";
import { buildFilesList, checkPaths, constructArgs } from "./utils";

const TEST_OUTPUT = resolve(".test");

const isWindows = process.platform === "win32";
const TIMEOUT = isWindows ? 300_000 : 150_000;

beforeAll(async () => {
  await fs.emptyDir(TEST_OUTPUT);
});
afterAll(async () => {
  await fs.rm(TEST_OUTPUT, { recursive: true, force: true });
});

const it = vitestIt.extend<{
  supportedOptions: string[];
  unsupportedOptions: string[];
  invalidSlugs: string[];
}>({
  supportedOptions: [],
  unsupportedOptions: [],
  invalidSlugs: [],
});

function runProjectTest(combination: { [key: string]: any }) {
  const { args, testName } = constructArgs(combination);
  const name = args[1];
  it.concurrent(
    testName,
    async ({ supportedOptions }) => {
      const target = resolve(TEST_OUTPUT, name);

      // Generate the project
      await execa("pnpm", ["generate", "-o", TEST_OUTPUT, ...args, "-y"], {
        cwd: TEST_OUTPUT,
      });

      // Check that the project was generated
      const paths = await buildFilesList(target);
      await checkPaths(paths);

      // Check that the project is linted
      const getWarnings = process.env.GET_WARNINGS === "true";
      await execa(
        "pnpm",
        ["lint", ...(getWarnings ? ["--max-warnings", "0"] : [])],
        { cwd: target },
      );

      supportedOptions.push(name);
    },
    TIMEOUT,
  );
}

function runUnsupportedOptionsTest(
  combination: { [key: string]: any },
  testOption: "slug" | "options" = "options",
) {
  const { args, testName } = constructArgs(combination);
  const name = args[1];
  it.concurrent(
    testName,
    async ({ expect, invalidSlugs, unsupportedOptions }) => {
      // Generate the project and check that it fails
      const { exitCode } = await execa(
        "pnpm",
        ["generate", "-o", TEST_OUTPUT, ...args, "-y"],
        { cwd: TEST_OUTPUT, reject: false },
      );
      expect(exitCode).toBe(1);
      if (exitCode !== 1) return;
      if (testOption === "slug") invalidSlugs.push(name);
      if (testOption === "options") unsupportedOptions.push(name);
    },
    30_000,
  );
}

for (const combination of SUPPORTED_COMBINATIONS) {
  runProjectTest(combination);
}
for (const combination of UNSUPPORTED_COMBINATIONS) {
  runUnsupportedOptionsTest(combination);
}
for (const slug of INVALID_SLUGS) {
  runUnsupportedOptionsTest({ projectSlug: slug }, "slug");
}

it("should have the same number of supported options", ({
  expect,
  supportedOptions,
}) => {
  expect(supportedOptions.length).toBe(SUPPORTED_COMBINATIONS.length);
});
it("should have the same number of unsupported options", ({
  expect,
  unsupportedOptions,
}) => {
  expect(unsupportedOptions.length).toBe(UNSUPPORTED_COMBINATIONS.length);
});
it("should have the same number of invalid slugs", ({
  expect,
  invalidSlugs,
}) => {
  expect(invalidSlugs.length).toBe(INVALID_SLUGS.length);
});
