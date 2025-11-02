export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type Database = "none" | "prisma";
export type AuthProvider = "none" | "nextAuth" | "clerk" | "betterAuth";
export type AutomatedDepsUpdater = "none" | "renovate" | "dependabot";

export type ContextProps = {
  projectSlug: string;
  pkgManager: PackageManager;
  pkgRun: string;
  useHusky: boolean;
  useLintStaged: boolean;
  useCommitlint: boolean;
  useAppFolder: boolean;
  database: Database;
  useDockerCompose: boolean;
  authProvider: AuthProvider;
  clerkWebhook: boolean;
  useTriggerDev: boolean;
  automatedDepsUpdater: AutomatedDepsUpdater;
  automaticStart: boolean;
};

export type SetFlagProps = {
  filePath: string;
  flag: string;
  length?: number;
  value?: string;
  formatted?: string;
};
