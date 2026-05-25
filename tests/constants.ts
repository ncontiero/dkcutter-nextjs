export const PATTERN = /\{\{(\s?dkcutter)\.(.*?)\}\}/;

export const SUPPORTED_COMBINATIONS = [
  { useHusky: true },
  { useLintStaged: true, useHusky: true },
  { useCommitlint: true },
  { useAppFolder: false },
  { database: "prisma" },
  { database: "prisma", useDockerCompose: true },
  { authProvider: "clerk" },
  { authProvider: "clerk", clerkWebhook: true },
  { authProvider: "betterAuth", database: "prisma" },
  { useTriggerDev: true },
  { automatedDepsUpdater: "renovate" },
  { automatedDepsUpdater: "dependabot" },
  // Complex combinations
  { useHusky: true, useLintStaged: true },
  { useHusky: true, useLintStaged: true, useCommitlint: true },
  { database: "prisma", authProvider: "clerk" },
  { database: "prisma", authProvider: "clerk", clerkWebhook: true },
  { database: "prisma", authProvider: "clerk", useAppFolder: false },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
  },
  { authProvider: "clerk", clerkWebhook: true, useAppFolder: false },
  { database: "prisma", authProvider: "betterAuth", useAppFolder: false },
  { database: "prisma", useTriggerDev: true },
];

export const UNSUPPORTED_COMBINATIONS = [
  { database: "XXXXXX" },
  { authProvider: "non" },
  // Better Auth is only supported with Database
  { authProvider: "betterAuth" },
  { automatedDepsUpdater: "xpto" },
];

export const INVALID_SLUGS = [
  "",
  " ",
  "Test",
  "teSt",
  "tes1@",
  "t!es",
  "test test",
];

export const EXCLUDED_DIRS = ["node_modules"];
