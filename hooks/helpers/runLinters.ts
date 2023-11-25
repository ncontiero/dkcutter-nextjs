import type { PackageManager } from "../utils/types";

import chalk from "chalk";
import ora from "ora";

import { logger } from "../utils/logger";
import { runPgkCommand } from "./runPkgCommand";

export async function runLinters(
  projectDir: string,
  pkgManager: PackageManager,
) {
  logger.info("Running linters. This might take a while...");

  const linterSpinner = await runPgkCommand(pkgManager, projectDir, [
    "run",
    "lint:fix",
  ]);

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  (linterSpinner ?? ora()).succeed(chalk.green("Successfully ran linters!\n"));
}
