import type { PackageManager } from "dkcutter/utils";

export type { PackageManager };
export type Database = "none" | "prisma";
export type AuthProvider = "none" | "clerk" | "betterAuth";
export type AutomatedDepsUpdater = "none" | "renovate" | "dependabot";

export interface ContextProps {
  default: boolean;
  projectSlug: string;
  pkgManager: PackageManager;
  pkgRun: string;
  useAppFolder: boolean;
  authProvider: AuthProvider;
  useReactCompiler: boolean;
  useHusky: boolean;
  useLintStaged: boolean;
  useCommitlint: boolean;
  database: Database;
  useDockerCompose: boolean;
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
