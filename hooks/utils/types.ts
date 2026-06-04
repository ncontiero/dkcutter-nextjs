export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type Database = "none" | "prisma";
export type AuthProvider = "none" | "clerk" | "betterAuth";
export type AutomatedDepsUpdater = "none" | "renovate" | "dependabot";

export interface ContextProps {
  projectSlug: string;
  pkgManager: PackageManager;
  pkgRun: string;
  useAppFolder: boolean;
  useReactCompiler: boolean;
  useHusky: boolean;
  useLintStaged: boolean;
  useCommitlint: boolean;
  database: Database;
  useDockerCompose: boolean;
  authProvider: AuthProvider;
  clerkWebhook: boolean;
  useTriggerDev: boolean;
  useTanstackQuery: boolean;
  automatedDepsUpdater: AutomatedDepsUpdater;
  automaticStart: boolean;
}

export interface SetFlagProps {
  filePath: string;
  flag: string;
  length?: number;
  value?: string;
  formatted?: string;
}
