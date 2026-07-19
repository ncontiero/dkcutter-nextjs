# DKCutter Next.js

[![Build Status](https://img.shields.io/github/actions/workflow/status/ncontiero/dkcutter-nextjs/ci.yml?branch=main)](https://github.com/ncontiero/dkcutter-nextjs/actions/workflows/ci.yml?query=branch%3Amain)
[![license mit](https://img.shields.io/badge/licence-MIT-56BEB8)](LICENSE)

Powered by [DKCutter](https://dkcutter.ncontiero.com/), DKCutter Next.js is a robust template for quickly scaffolding production-ready Next.js applications with modern tooling.

- If you have problems with DKCutter Next.js, please open an [issue](https://github.com/ncontiero/dkcutter-nextjs/issues/new).

## Features

- ⚡️ **Next.js v16**: Modern full-stack React framework with App Router.
- ⚛️ **React Compiler**: Option to enable the experimental React Compiler for optimized performance.
- 🎨 **Styling**: Pre-configured with Tailwind CSS 4.
- 🗄️ **Database**: Optional Prisma ORM integration, complete with Docker Compose setup for your local database.
- 🔐 **Authentication**: Out-of-the-box support for [Clerk](https://clerk.com/) (with webhooks) or [Better Auth](https://www.better-auth.com/).
- ⚙️ **Background Jobs**: Integrated with [Trigger.dev](https://trigger.dev/) to handle complex background tasks.
- 🔄 **Data Fetching**: Optional [TanStack Query](https://tanstack.com/query/latest) configuration for powerful async state management.
- 🔒 **Environment Validation**: Type-safe environment variables via `@t3-oss/env-nextjs` and `zod`.
- 🛠️ **Code Quality & Git Hooks**: Enforce standards with Husky, lint-staged, Commitlint, and optional type-aware ESLint.
- 🧪 **Testing**: Blazing fast unit test framework powered by Vitest.
- 🤖 **Dependency Automation**: Keep your project up-to-date automatically using Mend Renovate or GitHub Dependabot.
- 📦 **Package Manager Agnostic**: Seamlessly use npm, yarn, pnpm, or bun.

## Usage

To scaffold an application using [DKCutter](https://dkcutter.ncontiero.com/), run any of the following commands and answer the command prompt questions:

### npm

```bash
npx dkcutter@latest gh:ncontiero/dkcutter-nextjs
```

### yarn

```bash
yarn dlx dkcutter@latest gh:ncontiero/dkcutter-nextjs
```

### pnpm

```bash
pnpm dlx dkcutter@latest gh:ncontiero/dkcutter-nextjs
```

### bun

```bash
bunx dkcutter@latest gh:ncontiero/dkcutter-nextjs
```

You'll be prompted for some values. Provide them, and a tailored Next.js project will be created for you.

**Warning**: After generation, ensure you update 'author name' and other specific details to your own information.

Answer the prompts with your own desired [options][options-url]. For example:

```bash
✔ What is the project name? … My Awesome Project
✔ What is the project slug? … my-awesome-project
✔ What is the project description? … Behold My Awesome Project!
✔ What is the author name? … Nicolas Contiero <https://github.com/ncontiero>
✔ What is the project version? … 0.1.0
✔ Which Authentication Provider would you like to use? › None / Clerk / Better Auth
✔ Which Internationalization (i18n) solution would you like to use? › None / next-intl
✔ Which Additional Tools would you like to use? › Husky, Lint Staged, Nano Staged, Commitlint, React Compiler, React Hook Form, ESLint + Type Information, Vitest, Prisma, Trigger.dev, TanStack Query, Shadcn, Tailwind CSS Typography, Unpic
✔ Would you like to add Docker Compose for the database? … No / Yes
✔ Would you like to receive Clerk events using webhooks? … No / Yes
✔ Which Automated Dependency Updater do you want to use? › None / Mend Renovate / Github Dependabot
✔ Would you like to install the dependencies? … No / Yes
✔ Would you like to initialize a git repository and create an initial commit? … No / Yes

Next steps:
  cd my-awesome-project
  docker compose up -d
  pnpm dev

✔ Project created!
```

Enter the project and take a look around:

```bash
cd my-awesome-project/
ls
```

Now take a look at your repo. Don't forget to carefully look at the generated `README.md`.

## Advanced Usage

If you want to bypass the interactive prompts and start faster, you can provide configuration via CLI flags. All options in `dkcutter.json` are available as flags:

| Flag                              | Description                                                                                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--projectName <string>`          | The Project name.                                                                                                                                                                                                                  |
| `--projectSlug <string>`          | The Project Slug.                                                                                                                                                                                                                  |
| `--description <string>`          | The Project description.                                                                                                                                                                                                           |
| `--authorName <string>`           | The author name.                                                                                                                                                                                                                   |
| `--projectVersion <string>`       | The project version.                                                                                                                                                                                                               |
| `--authProvider <string>`         | Choose an authentication provider (`none`, `clerk`, `betterAuth`).                                                                                                                                                                 |
| `--i18n <string>`                 | Choose an internationalization solution (`none`, `nextIntl`).                                                                                                                                                                      |
| `--additionalTools <string>`      | Comma-separated list of tools (`husky`, `lintStaged`, `nanoStaged`, `commitlint`, `reactCompiler`, `reactHookForm`, `eslintTypeInfo`, `vitest`, `prisma`, `triggerDev`, `tanstackQuery`, `shadcn`, `tailwindTypography`, `unpic`). |
| `--useDockerCompose [boolean]`    | Include Docker Compose in the project for the database (if Prisma is selected).                                                                                                                                                    |
| `--useClerkWebhook [boolean]`     | Includes an endpoint to receive events from [Clerk](https://clerk.com/).                                                                                                                                                           |
| `--automatedDepsUpdater <string>` | Choose Automated Dependency Updater (`none`, `renovate`, `dependabot`).                                                                                                                                                            |
| `--installDependencies [boolean]` | Indicates whether to automatically install dependencies after generation.                                                                                                                                                          |
| `--initializeGit [boolean]`       | Indicates whether to initialize a git repository and make an initial commit.                                                                                                                                                       |

[See here for more information about options][options-url].

### Examples

Generate a project using Prisma:

```bash
pnpm dlx dkcutter gh:ncontiero/dkcutter-nextjs --additionalTools prisma
```

If you want to use all the default values with the exception of one or more, you can do it as follows:

```bash
pnpm dlx dkcutter gh:ncontiero/dkcutter-nextjs --installDependencies false -y
```

This will use the default values, with the exception of the `--installDependencies` option, skipping the interactive prompt (`-y`).

[options-url]: ./docs/project-generation-options.md
