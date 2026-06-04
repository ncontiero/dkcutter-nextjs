import { resolve } from "node:path";
import { emptyDir, remove } from "dkcutter/utils";
import { x } from "tinyexec";
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
  await emptyDir(TEST_OUTPUT);
});
afterAll(async () => {
  await remove(TEST_OUTPUT);
}, TIMEOUT);

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
  const { args, testName, name } = constructArgs(combination);
  it.concurrent(
    testName,
    async ({ supportedOptions }) => {
      const target = resolve(TEST_OUTPUT, name);

      // Generate the project
      await x("bun", ["run", "generate", "-o", TEST_OUTPUT, ...args, "-y"], {
        nodeOptions: { cwd: TEST_OUTPUT },
      });

      // Check that the project was generated
      const paths = await buildFilesList(target);
      await checkPaths(paths);

      // Install dependencies
      await x("bun", ["install"], { nodeOptions: { cwd: target } });

      // Check types
      await x("bun", ["run", "typecheck"], { nodeOptions: { cwd: target } });

      // Check that the project is linted
      const getWarnings = process.env.GET_WARNINGS === "true";
      await x(
        "bun",
        ["run", "lint", ...(getWarnings ? ["--max-warnings", "0"] : [])],
        { nodeOptions: { cwd: target } },
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
  const { args, testName, name } = constructArgs(combination);
  it.concurrent(
    testName,
    async ({ expect, invalidSlugs, unsupportedOptions }) => {
      // Generate the project and check that it fails
      const { exitCode } = await x(
        "bun",
        ["run", "generate", "-o", TEST_OUTPUT, ...args, "-y"],
        { nodeOptions: { cwd: TEST_OUTPUT } },
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
