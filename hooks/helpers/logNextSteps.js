import { logger } from "../utils/logger.js";
import { isInsideGitRepo, isRootGitRepo } from "./git.js";

export async function logNextSteps(ctx, projectDir, pkgManager) {
  const commands = [`cd ${ctx.projectSlug}`];

  if (!ctx.automaticStart) {
    const installCommand =
      pkgManager === "yarn" ? pkgManager : `${pkgManager} install`;
    commands.push(installCommand);

    const isGitRepo =
      (await isInsideGitRepo(projectDir)) || isRootGitRepo(projectDir);
    if (!isGitRepo) {
      commands.push(`git init`);
    }
    commands.push(`git add .`, `git commit -m "initial commit"`);
  }

  ctx.useDockerCompose && commands.push("docker compose up -d");
  const runDevCommand = ["npm", "bun"].includes(pkgManager)
    ? `${pkgManager} run dev`
    : `${pkgManager} dev`;
  commands.push(runDevCommand);

  logger.info("Next steps:\n  " + commands.join("\n  "));
}
