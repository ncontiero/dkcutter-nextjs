import { execa } from "execa";
import ora from "ora";

export async function execWithSpinner(
  projectDir,
  pkgManager,
  args = ["install"],
  stdout = "pipe",
  onDataHandle,
) {
  const spinner = ora(`Running ${pkgManager} ${args.join(" ")}...`).start();
  const subprocess = execa(pkgManager, args, { cwd: projectDir, stdout });

  await new Promise((resolve, reject) => {
    if (onDataHandle) {
      subprocess.stdout?.on("data", onDataHandle(spinner));
    }

    subprocess.on("error", (e) => reject(e));
    subprocess.on("close", () => resolve());
  });

  return spinner;
}

export async function runPgkCommand(
  pkgManager,
  projectDir,
  args = ["install"],
) {
  const onDataHandle = (spinner) => (data) => {
    const text = data.toString();
    spinner.text =
      pkgManager === "pnpm" && text.includes("Progress")
        ? text.includes("|")
          ? text.split(" | ")[1] ?? ""
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
