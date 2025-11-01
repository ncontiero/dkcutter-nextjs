# DKCutter Next.js

[![Build Status](https://img.shields.io/github/actions/workflow/status/ncontiero/dkcutter-nextjs/ci.yml?branch=main)](https://github.com/ncontiero/dkcutter-nextjs/actions/workflows/ci.yml?query=branch%3Amain)
[![license mit](https://img.shields.io/badge/licence-MIT-56BEB8)](LICENSE)

Powered by [DKCutter](https://dkcutter.ncontiero.com/), DKCutter Next.js is a framework for quickly starting Next.js projects.

- If you have problems with DKCutter Next.js, please open an [issue](https://github.com/ncontiero/dkcutter-nextjs/issues/new).

## Usage

To scaffold an application using [DKCutter](https://dkcutter.ncontiero.com/), run any of the following four commands and answer the command prompt questions:

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

You'll be prompted for some values. Provide them, then a Next.js project will be created for you.

**Warning**: After this point, change 'author name', etc to your own information.

Answer the prompts with your own desired [options][options-url]. For example:

```bash
✔ What is the project name? … My Awesome Project
✔ What is the project slug? … my-awesome-project
✔ What is the project description? … Behold My Awesome Project!
✔ What is the author name? … Nicolas Contiero <https://github.com/ncontiero>
✔ What is the project version? … 0.1.0
✔ Do you want to use husky? … No / Yes
✔ Do you want to use lint staged? … No / Yes
✔ Do you want to use Commitlint? … No / Yes
✔ Do you want to use Next.Js app folder? … No / Yes
✔ What database ORM would you like to use? › Prisma
✔ Do you want to use Docker compose for the database? … No / Yes
✔ What Authentication Provider would you like to use? › Clerk
✔ Do you want to receive events from the Clerk using a webhook? … No / Yes
✔ What Automated Dependency Updater do you want to use? › Mend Renovate
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

Now take a look at your repo. Don't forget to carefully look at the generated README.

## Advanced usage

If you want to start faster, you can use the following options:

| Flag                              | Description                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `--projectName <string>`          | The Project name.                                                                                |
| `--projectSlug <string>`          | The Project Slug.                                                                                |
| `--description <string>`          | The Project description.                                                                         |
| `--authorName <string>`           | The author name.                                                                                 |
| `--projectVersion <string>`       | The project version.                                                                             |
| `--useHusky [boolean]`            | Include [husky](https://github.com/typicode/husky) in the project.                               |
| `--useLintStaged [boolean]`       | Include [lint-staged](https://github.com/lint-staged/lint-staged) in the project.                |
| `--useCommitlint [boolean]`       | Include [commitlint](https://commitlint.js.org/#/) in the project.                               |
| `--useAppFolder [boolean]`        | Use [Next.js app folder](https://nextjs.org/docs/app) structure.                                 |
| `--database <string>`             | Choose a database ORM. [See for more info][options-url].                                         |
| `--useDockerCompose [boolean]`    | Include docker compose in the project for the database. If `database` is different from `none`.  |
| `--authProvider <string>`         | Choose a authentication provider. [See for more info][options-url].                              |
| `--clerkWebhook [boolean]`        | Includes an endpoint to receive events from the [Clerk](https://clerk.com/).                     |
| `--automatedDepsUpdater <string>` | Choose Automated Dependency Updater. [See for more info][options-url].                           |
| `--automaticStart [boolean]`      | This option will install the application packages, start a git repo and make the initial commit. |

[See for more information about options][options-url].

### Example

The following would be the structure of an application with [Commitlint](https://commitlint.js.org/):

```bash
pnpm dlx dkcutter https://github.com/ncontiero/dkcutter-nextjs.git --useCommitlint
```

If you want to use all the default values with the exception of one or more, you can do it as follows:

```bash
pnpm dlx dkcutter https://github.com/ncontiero/dkcutter-nextjs.git --useHusky --useLintStaged -y
```

This will use the default values, with the exception of the `--useHusky` and `--useLintStaged` options.

[options-url]: ./docs/project-generation-options.md
