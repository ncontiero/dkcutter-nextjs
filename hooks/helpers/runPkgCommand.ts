import type { PackageManager } from "../utils/types";
import type { SpawnOptions } from "node:child_process";
import { spinner } from "dkcutter/utils";
import { x } from "tinyexec";

export async function execWithSpinner(
  projectDir: string,
  pkgManager: PackageManager,
  args: string[] = ["install"],
  stdout: SpawnOptions["stdio"] = "pipe",
  onDataHandle?: (data: Buffer) => void,
) {
  spinner.setText(`Running ${pkgManager} ${args.join(" ")}...`);
  !spinner.running && spinner.start();

  const { process } = x(pkgManager, args, {
    nodeOptions: { cwd: projectDir, stdio: stdout },
  });

  await new Promise<void>((resolve, reject) => {
    if (onDataHandle) {
      process?.stdout?.on("data", onDataHandle);
    }

    process?.on("error", (e) => reject(e));
    process?.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

export async function runPgkCommand(
  pkgManager: PackageManager,
  projectDir: string,
  args: string[] = ["install"],
) {
  const onDataHandle = (data: Buffer) => {
    const text = data.toString();
    spinner.setText(
      pkgManager === "pnpm" && text.includes("Progress")
        ? text.includes("|")
          ? (text.split(" | ")[1] ?? "")
          : text
        : text,
    );
  };

  switch (pkgManager) {
    case "npm":
      await x(pkgManager, args, {
        nodeOptions: { cwd: projectDir, stdio: "inherit" },
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
