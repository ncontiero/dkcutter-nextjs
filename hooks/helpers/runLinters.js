import chalk from "chalk";
import ora from "ora";

import { logger } from "../utils/logger.js";
import { runPgkCommand } from "./runPkgCommand.js";

export async function runLinters(projectDir, pkgManager) {
  logger.info("Running linters. This might take a while...");

  const linterSpinner = await runPgkCommand(pkgManager, projectDir, [
    "run",
    "lint:fix",
  ]);

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  (linterSpinner ?? ora()).succeed(chalk.green("Successfully ran linters!\n"));
}
