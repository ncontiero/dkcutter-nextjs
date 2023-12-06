# DKCutter NextJs

[![license mit](https://img.shields.io/badge/licence-MIT-56BEB8)](LICENSE)

A simple [NextJs](https://nextjs.org/) template with dkcutter.

## Usage

To scaffold an application using [dkcutter](https://github.com/dkshs/dkcutter), run any of the following four commands and answer the command prompt questions:

### npm

```bash
npx dkcutter gh:dkshs/dkcutter-nextjs.git
```

### yarn

```bash
yarn dlx dkcutter gh:dkshs/dkcutter-nextjs.git
```

### pnpm

```bash
pnpm dlx dkcutter gh:dkshs/dkcutter-nextjs.git
```

### bun

```bash
bunx dkcutter@latest gh:dkshs/dkcutter-nextjs.git
```

You'll be prompted for some values. Provide them, then a Next.Js project will be created for you.

**Warning**: After this point, change 'My name', etc to your own information.

Answer the prompts with your own desired [options][options-url]. For example:

```bash
✔ What is the project name? … My Awesome Project
✔ What is the project slug? … my-awesome-project
✔ What is the project description? … Behold My Awesome Project!
✔ What is the author name? … DKSHS
✔ What is the project version? … 0.1.0
✔ Do you want to use linters? … No / Yes
✔ Do you want to use husky? … No / Yes
✔ Do you want to use Next.Js app folder? … No / Yes
✔ What database ORM would you like to use? › Prisma
✔ Do you want to use Docker compose for the database? … No / Yes
✔ Do you want to use T3 Env? … No / Yes
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

| Flag                           | Description                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `--projectName <string>`       | The Project name.                                                                                |
| `--projectSlug <string>`       | The Project Slug.                                                                                |
| `--description <string>`       | The Project description.                                                                         |
| `--authorName <string>`        | The author name.                                                                                 |
| `--version <string>`           | The project version.                                                                             |
| `--useLinters [boolean]`       | Include linters in the project. Such as ESLint and Prettier.                                     |
| `--useHusky [boolean]`         | Include [husky](https://github.com/typicode/husky) in the project.                               |
| `--useLintStaged [boolean]`    | Include [lint-staged](https://github.com/lint-staged/lint-staged) in the project.                |
| `--useAppFolder [boolean]`     | Use [Next.Js app folder](https://nextjs.org/docs/app) structure.                                 |
| `--database <string>`          | Choose a database ORM. [See for more info][options-url].                                         |
| `--useDockerCompose [boolean]` | Include docker compose in the project for the database. If `database` is different from `none`.  |
| `--authProvider <string>`      | Choose a authentication provider. [See for more info][options-url].                              |
| `--clerkWebhook [boolean]`     | Includes an endpoint to receive events from the [Clerk](https://clerk.com/).                     |
| `--useEnvValidator [boolean]`  | Include [T3-env](https://github.com/t3-oss/t3-env) validator in the project.                     |
| `--automaticStart [boolean]`   | This option will install the application packages, start a git repo and make the initial commit. |

[See for more information about options][options-url].

### Example

The following would be the structure of an application with T3-env:

```bash
pnpm dlx dkcutter https://github.com/dkshs/dkcutter-nextjs.git --useEnvValidator
```

If you want to use all the default values with the exception of one or more, you can do it as follows:

```bash
pnpm dlx dkcutter https://github.com/dkshs/dkcutter-nextjs.git --useHusky --useLintStaged -y
```

This will use the default values, with the exception of the `--useHusky` and `--useLintStaged` options.

[options-url]: ./docs/project-generation-options.md
