import type { PackageManager } from "../utils/types";

import { type StdoutStderrOption, execa } from "execa";
import ora, { type Ora } from "ora";

export async function execWithSpinner(
  projectDir: string,
  pkgManager: PackageManager,
  args: string[] = ["install"],
  stdout: StdoutStderrOption = "pipe",
  onDataHandle?: (spinner: Ora) => (data: Buffer) => void,
) {
  const spinner = ora(`Running ${pkgManager} ${args.join(" ")}...`).start();
  const subprocess = execa(pkgManager, args, { cwd: projectDir, stdout });

  await new Promise<void>((resolve, reject) => {
    if (onDataHandle) {
      subprocess.stdout?.on("data", onDataHandle(spinner));
    }

    subprocess.on("error", (e) => reject(e));
    subprocess.on("close", () => resolve());
  });

  return spinner;
}

export async function runPgkCommand(
  pkgManager: PackageManager,
  projectDir: string,
  args: string[] = ["install"],
): Promise<Ora | null> {
  const onDataHandle = (spinner: Ora) => (data: Buffer) => {
    const text = data.toString();
    spinner.text =
      pkgManager === "pnpm" && text.includes("Progress")
        ? text.includes("|")
          ? (text.split(" | ")[1] ?? "")
          : text
        : text;
  };

  switch (pkgManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case "npm":
      await execa(pkgManager, args, {
        cwd: projectDir,
        stderr: "inherit",
      });

      return null;
    case "pnpm":
    case "yarn":
    case "bun":
      return execWithSpinner(
        projectDir,
        pkgManager,
        args,
        pkgManager === "bun" ? "ignore" : "pipe",
        onDataHandle,
      );
  }
}
