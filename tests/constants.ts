export const PATTERN = /\{\{(\s?dkcutter)\.(.*?)\}\}/;

export const SUPPORTED_COMBINATIONS = [
  { authProvider: "clerk" },
  { authProvider: "betterAuth" },
  { i18n: "nextIntl" },
  { additionalTools: "husky" },
  { additionalTools: "lintStaged" },
  { additionalTools: "nanoStaged" },
  { additionalTools: "commitlint" },
  { additionalTools: "reactCompiler" },
  { additionalTools: "vitest" },
  { additionalTools: "prisma" },
  { additionalTools: "triggerDev" },
  { additionalTools: "tanstackQuery" },
  { additionalTools: "shadcn" },
  { additionalTools: "tailwindTypography" },
  { additionalTools: "unpic" },
  { automatedDepsUpdater: "renovate" },
  { automatedDepsUpdater: "dependabot" },
  // Complex combinations
  { authProvider: "clerk", i18n: "nextIntl" },
  { authProvider: "betterAuth", i18n: "nextIntl" },
  {
    authProvider: "clerk",
    i18n: "nextIntl",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,vitest,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
  },
  {
    authProvider: "betterAuth",
    i18n: "nextIntl",
    additionalTools:
      "husky,lintStaged,nanoStaged,commitlint,vitest,prisma,triggerDev,tanstackQuery,shadcn,tailwindTypography,unpic",
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
