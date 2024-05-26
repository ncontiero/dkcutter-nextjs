export const PATTERN = /{{(\s?dkcutter)\.(.*?)}}/;

export const SUPPORTED_COMBINATIONS = [
  { useHusky: true },
  { useLintStaged: true, useHusky: true },
  { useCommitlint: true },
  { useAppFolder: false },
  { database: "prisma" },
  { database: "prisma", useDockerCompose: true },
  { authProvider: "clerk" },
  { authProvider: "clerk", clerkWebhook: true },
  { authProvider: "nextAuth" },
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
  { database: "prisma", authProvider: "nextAuth" },
  { database: "prisma", authProvider: "nextAuth", useAppFolder: false },
  { authProvider: "nextAuth", useAppFolder: false },
  {
    automatedDepsUpdater: "dependabot",
    database: "prisma",
    authProvider: "nextAuth",
    useCommitlint: true,
  },
];

export const UNSUPPORTED_COMBINATIONS = [
  { database: "XXXXXX" },
  { authProvider: "non" },
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
