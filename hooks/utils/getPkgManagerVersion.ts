import type { PackageManager } from "./types";
import { execa } from "execa";
import { logger } from "./logger";

export async function getPkgManagerVersion(packageManager: PackageManager) {
  try {
    const { stdout } = await execa(packageManager, ["-v"]);
    return `${packageManager}@${stdout}`;
  } catch (error) {
    logger.warn("Unable to get version from package manager.", error);
  }
}
