import { resolve } from "node:path";
import { afterAll, beforeAll, it } from "vitest";
import { execa } from "execa";
import fs from "fs-extra";

import { constructArgs } from "./utils";
import { SUPPORTED_COMBINATIONS } from "./constants";

const TEST_OUTPUT = resolve(".test");

beforeAll(async () => {
  await fs.emptyDir(TEST_OUTPUT);
  await execa("pnpm", ["init"], { cwd: TEST_OUTPUT });
  await execa("pnpm", ["add", "-D", "dkcutter"], {
    cwd: TEST_OUTPUT,
  });
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
      const generatedProject = resolve(target, name);

      await fs.copy(
        resolve(TEST_OUTPUT, "package.json"),
        resolve(target, "package.json"),
      );
      await fs.copy(
        resolve(TEST_OUTPUT, "node_modules"),
        resolve(target, "node_modules"),
      );

      // Generate the project
      await execa("pnpm", ["dkcutter", "../..", ...args, "-y"], {
        cwd: target,
      });

      // Check that the project was generated
      expect(
        await fs.pathExists(resolve(generatedProject, "package.json")),
      ).toBe(true);

      // Check that the project is linted
      await execa("pnpm", ["eslint", "."], {
        cwd: generatedProject,
      });
    },
    30_000,
  );
}

for (const combination of SUPPORTED_COMBINATIONS) {
  runProjectTest(combination);
}
