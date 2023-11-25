import type { PackageManager } from "../utils/types";

import chalk from "chalk";
import ora from "ora";

import { logger } from "../utils/logger";
import { runPgkCommand } from "./runPkgCommand";

export async function installDependencies(
  projectDir: string,
  pkgManager: PackageManager,
) {
  logger.info("Installing dependencies. This might take a while...");

  const installSpinner = await runPgkCommand(pkgManager, projectDir);

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  (installSpinner ?? ora()).succeed(
    chalk.green("Successfully installed dependencies!\n"),
  );
}
