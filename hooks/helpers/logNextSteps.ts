import type { ContextProps } from "../utils/types";
import * as p from "@clack/prompts";
import { dim } from "ansis";
import { logger } from "dkcutter/utils";

export function logNextSteps(ctx: ContextProps, hasGitInitialized: boolean) {
  const { projectSlug, pkgManager, automaticStart } = ctx;
  const commands = [`cd ${projectSlug}`];

  if (!automaticStart) {
    commands.push(`${pkgManager} install`);

    if (!hasGitInitialized) {
      commands.push("git init", "git add .", `git commit -m "initial commit"`);
    }
  }

  ctx.useDockerCompose && commands.push("docker compose up -d");
  if (["betterAuth"].includes(ctx.authProvider) && ctx.database === "prisma") {
    commands.push(`${pkgManager} prisma migrate dev --name init`);
  }
  commands.push(`${ctx.pkgRun} dev`);

  p.note(commands.join("\n"), "Next steps", {
    format: (line: string) => dim(line),
  });
  logger.info(`Next steps:\n  ${commands.join("\n  ")}`);
}
