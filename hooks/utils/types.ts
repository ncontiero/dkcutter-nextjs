export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type Database = "none" | "prisma";
export type AuthProvider = "none" | "nextAuth" | "clerk" | "betterAuth";
export type AutomatedDepsUpdater = "none" | "renovate" | "dependabot";

export type SetFlagProps = {
  filePath: string;
  flag: string;
  length?: number;
  value?: string;
  formatted?: string;
};
