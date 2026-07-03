export const PATTERN = /\{\{(\s?dkcutter)\.(.*?)\}\}/;

export const SUPPORTED_COMBINATIONS = [
  { useAppFolder: false },
  { authProvider: "clerk" },
  { authProvider: "betterAuth" },
  { additionalTools: "husky" },
  { additionalTools: "lintStaged" },
  { additionalTools: "nanoStaged" },
  { additionalTools: "commitlint" },
  { additionalTools: "reactCompiler" },
  { additionalTools: "prisma" },
  { additionalTools: "triggerDev" },
  { additionalTools: "tanstackQuery" },
  { additionalTools: "shadcn" },
  { additionalTools: "tailwindTypography" },
  { additionalTools: "unpic" },
  { automatedDepsUpdater: "renovate" },
  { automatedDepsUpdater: "dependabot" },
  // Complex combinations
  {
    authProvider: "clerk",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
  },
  {
    authProvider: "betterAuth",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
  },
  {
    useAppFolder: false,
    authProvider: "clerk",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
  },
  {
    useAppFolder: false,
    authProvider: "betterAuth",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
  },
];

export const UNSUPPORTED_COMBINATIONS = [
  { authProvider: "non" },
  { additionalTools: "XXXXXX" },
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
