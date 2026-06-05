# DKCutter Next.js

[![Build Status](https://img.shields.io/github/actions/workflow/status/ncontiero/dkcutter-nextjs/ci.yml?branch=main)](https://github.com/ncontiero/dkcutter-nextjs/actions/workflows/ci.yml?query=branch%3Amain)
[![license mit](https://img.shields.io/badge/licence-MIT-56BEB8)](LICENSE)

Powered by [DKCutter](https://dkcutter.ncontiero.com/), DKCutter Next.js is a robust template for quickly scaffolding production-ready Next.js applications with modern tooling.

- If you have problems with DKCutter Next.js, please open an [issue](https://github.com/ncontiero/dkcutter-nextjs/issues/new).

## Features

- ⚡️ **Next.js v16**: Support for App Router and Pages Router.
- ⚛️ **React Compiler**: Option to enable the experimental React Compiler for optimized performance.
- 🎨 **Styling**: Pre-configured with Tailwind CSS 4.
- 🗄️ **Database**: Optional Prisma ORM integration, complete with Docker Compose setup for your local database.
- 🔐 **Authentication**: Out-of-the-box support for [Clerk](https://clerk.com/) (with webhooks) or [Better Auth](https://www.better-auth.com/).
- ⚙️ **Background Jobs**: Integrated with [Trigger.dev](https://trigger.dev/) to handle complex background tasks.
- 🔄 **Data Fetching**: Optional [TanStack Query](https://tanstack.com/query/latest) configuration for powerful async state management.
- 🔒 **Environment Validation**: Type-safe environment variables via `@t3-oss/env-nextjs` and `zod`.
- 🛠️ **Code Quality & Git Hooks**: Enforce standards with Husky, lint-staged, Commitlint, and optional type-aware ESLint.
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
✔ Do you want to use Next.Js app folder? … No / Yes
✔ Do you want to use React compiler? … No / Yes
✔ Do you want to use husky? … No / Yes
✔ Do you want to use lint staged? … No / Yes
✔ Do you want to use Commitlint? … No / Yes
✔ Do you want to use ESLint with type information? This will make the linting process slower but will provide more accurate linting results. … No / Yes
✔ What database ORM would you like to use? › None / Prisma
✔ Do you want to use Docker compose for the database? … No / Yes
✔ What Authentication Provider would you like to use? › None / Clerk / Better Auth
✔ Do you want to receive events from the Clerk using a webhook? … No / Yes
✔ Do you want to use Trigger.dev? … No / Yes
✔ Do you want to use TanStack Query? … No / Yes
✔ What Automated Dependency Updater do you want to use? › None / Mend Renovate / Github Dependabot
✔ Do you want the project to be configured? … No / Yes

Next steps:
  cd my-awesome-project
  pnpm install
  git add .
  git commit -m "initial commit"
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

| Flag                                       | Description                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `--projectName <string>`                   | The Project name.                                                                                |
| `--projectSlug <string>`                   | The Project Slug.                                                                                |
| `--description <string>`                   | The Project description.                                                                         |
| `--authorName <string>`                    | The author name.                                                                                 |
| `--projectVersion <string>`                | The project version.                                                                             |
| `--useAppFolder [boolean]`                 | Use [Next.js app folder](https://nextjs.org/docs/app) structure.                                 |
| `--useReactCompiler [boolean]`             | Use the [React compiler](https://react.dev/learn/react-compiler).                                |
| `--useHusky [boolean]`                     | Include [husky](https://github.com/typicode/husky) in the project.                               |
| `--useLintStaged [boolean]`                | Include [lint-staged](https://github.com/lint-staged/lint-staged) in the project.                |
| `--useCommitlint [boolean]`                | Include [commitlint](https://commitlint.js.org/#/) in the project.                               |
| `--useESLintWithTypeInformation [boolean]` | Include ESLint with type information.                                                            |
| `--database <string>`                      | Choose a database ORM (`none`, `prisma`).                                                        |
| `--useDockerCompose [boolean]`             | Include Docker Compose in the project for the database (if `database` is not `none`).            |
| `--authProvider <string>`                  | Choose an authentication provider (`none`, `clerk`, `betterAuth`).                               |
| `--clerkWebhook [boolean]`                 | Includes an endpoint to receive events from [Clerk](https://clerk.com/).                         |
| `--useTriggerDev [boolean]`                | Include [Trigger.dev](https://trigger.dev/) in the project.                                      |
| `--useTanstackQuery [boolean]`             | Include [TanStack Query](https://tanstack.com/query/latest) in the project.                      |
| `--automatedDepsUpdater <string>`          | Choose Automated Dependency Updater (`none`, `renovate`, `dependabot`).                          |
| `--automaticStart [boolean]`               | This option will install the application packages, start a git repo and make the initial commit. |

[See here for more information about options][options-url].

### Examples

Generate a project using [Commitlint](https://commitlint.js.org/):

```bash
pnpm dlx dkcutter gh:ncontiero/dkcutter-nextjs --useCommitlint true
```

If you want to use all the default values with the exception of one or more, you can do it as follows:

```bash
pnpm dlx dkcutter gh:ncontiero/dkcutter-nextjs --useHusky true --useLintStaged true -y
```

This will use the default values, with the exception of the `--useHusky` and `--useLintStaged` options, skipping the interactive prompt (`-y`).

[options-url]: ./docs/project-generation-options.md
