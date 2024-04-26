export const PATTERN = /{{(\s?dkcutter)\.(.*?)}}/;

export const SUPPORTED_COMBINATIONS = [
  { useLinters: false },
  { useHusky: true },
  { useLintStaged: true, useHusky: true },
  { useCommitlint: true },
  { useAppFolder: false },
  { database: "prisma" },
  { database: "prisma", useDockerCompose: true },
  { authProvider: "clerk" },
  { authProvider: "clerk", clerkWebhook: true },
  { authProvider: "nextAuth" },
  { useEnvValidator: true },
  { automatedDepsUpdater: "renovate" },
  { automatedDepsUpdater: "dependabot" },
  // Complex combinations
  { useLinters: true, useHusky: true, useLintStaged: true },
  {
    useLinters: true,
    useHusky: true,
    useLintStaged: true,
    useCommitlint: true,
  },
  { database: "prisma", authProvider: "clerk" },
  { database: "prisma", authProvider: "clerk", clerkWebhook: true },
  { database: "prisma", authProvider: "clerk", useEnvValidator: true },
  { database: "prisma", authProvider: "clerk", useAppFolder: false },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useEnvValidator: true,
  },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
  },
  {
    database: "prisma",
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
    useEnvValidator: true,
  },
  { authProvider: "clerk", clerkWebhook: true, useAppFolder: false },
  { authProvider: "clerk", clerkWebhook: true, useEnvValidator: true },
  {
    authProvider: "clerk",
    clerkWebhook: true,
    useAppFolder: false,
    useEnvValidator: true,
  },
  { database: "prisma", authProvider: "nextAuth" },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useEnvValidator: true,
  },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useAppFolder: false,
  },
  {
    database: "prisma",
    authProvider: "nextAuth",
    useAppFolder: false,
    useEnvValidator: true,
  },
  { authProvider: "nextAuth", useAppFolder: false },
  { authProvider: "nextAuth", useEnvValidator: true },
  {
    authProvider: "nextAuth",
    useAppFolder: false,
    useEnvValidator: true,
  },
  { database: "prisma", useEnvValidator: true },
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

// export const ENV = {
//   NEXTAUTH_SECRET: "YOUR_NEXTAUTH_SECRET",
// };
