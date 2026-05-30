import type { PackageManager } from "../utils/types";

import { colorize, logger, spinner } from "dkcutter/utils";
import { runPgkCommand } from "./runPkgCommand";

export async function installDependencies(
  projectDir: string,
  pkgManager: PackageManager,
) {
  logger.info("Installing dependencies. This might take a while...");

  await runPgkCommand(pkgManager, projectDir);
  spinner.succeed(colorize("success", "Successfully installed dependencies!"));
  logger.break();
}
