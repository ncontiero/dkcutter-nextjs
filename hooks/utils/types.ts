import type { PackageManager } from "dkcutter/utils";

export type { PackageManager };
export type AuthProvider = "none" | "clerk" | "betterAuth";
export type AutomatedDepsUpdater = "none" | "renovate" | "dependabot";

export interface ContextProps {
  default: boolean;
  projectSlug: string;
  pkgManager: PackageManager;
  pkgRun: string;
  useAppFolder: boolean;
  authProvider: AuthProvider;
  useHusky: boolean;
  useLintStaged: boolean;
  useNanoStaged: boolean;
  useCommitlint: boolean;
  useReactCompiler: boolean;
  useReactHookForm: boolean;
  usePrisma: boolean;
  useTriggerDev: boolean;
  useTanstackQuery: boolean;
  useDockerCompose: boolean;
  useClerkWebhook: boolean;
  automatedDepsUpdater: AutomatedDepsUpdater;
  installDependencies: boolean;
  initializeGit: boolean;
}

export interface SetFlagProps {
  filePath: string;
  flag: string;
  length?: number;
  value?: string;
  formatted?: string;
}
