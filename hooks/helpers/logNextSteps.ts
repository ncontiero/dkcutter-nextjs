import type { ContextProps } from "../utils/types";
import * as p from "@clack/prompts";
import { dim } from "ansis";
import { logger } from "dkcutter/utils";

export function logNextSteps(ctx: ContextProps, hasGitInitialized: boolean) {
  const {
    projectSlug,
    installDependencies,
    pkgManager,
    initializeGit,
    useDockerCompose,
    authProvider,
    usePrisma,
    pkgRun,
  } = ctx;
  const commands = [`cd ${projectSlug}`];

  if (!installDependencies) {
    commands.push(`${pkgManager} install`);
  }
  if (!initializeGit && !hasGitInitialized) {
    commands.push("git init", "git add .", `git commit -m "initial commit"`);
  }

  useDockerCompose && commands.push("docker compose up -d");
  if (authProvider === "betterAuth" && usePrisma) {
    commands.push(
      `${pkgRun} db:migrate ${pkgManager === "npm" ? "-- " : ""}--name init`,
    );
  }
  commands.push(`${pkgRun} dev`);

  p.note(commands.join("\n"), "Next steps", {
    format: (line: string) => dim(line),
  });
  logger.info(`Next steps:\n  ${commands.join("\n  ")}`);
}
