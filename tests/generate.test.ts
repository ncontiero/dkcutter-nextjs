import { resolve } from "node:path";
import { afterAll, beforeAll, it } from "vitest";
import { execa } from "execa";
import fs from "fs-extra";

import { constructArgs } from "./utils";
import { SUPPORTED_COMBINATIONS } from "./constants";

const TEST_OUTPUT = resolve(".test");

beforeAll(async () => {
  await fs.emptyDir(TEST_OUTPUT);
});
afterAll(async () => {
  await fs.rm(TEST_OUTPUT, { recursive: true, force: true });
});

function runProjectTest(combination: { [key: string]: any }) {
  const args = constructArgs(combination);
  const name = args[1];
  it.concurrent(
    name,
    async ({ expect }) => {
      const target = resolve(TEST_OUTPUT, name);

      // Generate the project
      await execa("pnpm", ["dkcutter", ".", "-o", TEST_OUTPUT, ...args, "-y"], {
        cwd: TEST_OUTPUT,
      });

      // Check that the project was generated
      expect(await fs.pathExists(resolve(target, "package.json"))).toBe(true);

      // Check that the project is linted
      await execa("pnpm", ["lint"], {
        cwd: target,
      });
    },
    30_000,
  );
}

for (const combination of SUPPORTED_COMBINATIONS) {
  runProjectTest(combination);
}
