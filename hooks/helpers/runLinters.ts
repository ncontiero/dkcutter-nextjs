import type { PackageManager } from "../utils/types";

import { colorize, logger, spinner } from "dkcutter/utils";
import { runPgkCommand } from "./runPkgCommand";

export async function runLinters(
  projectDir: string,
  pkgManager: PackageManager,
) {
  logger.info("Running linters. This might take a while...");

  await runPgkCommand(pkgManager, projectDir, ["run", "lint:fix"]);
  spinner.succeed(colorize("success", "Successfully ran linters!"));
  logger.break();
}
