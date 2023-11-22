# DKCutter NextJs

[![license mit](https://img.shields.io/badge/licence-MIT-56BEB8)](LICENSE)

A simple [NextJs](https://nextjs.org/) template with dkcutter.

## Usage

To scaffold an application using [dkcutter](https://github.com/dkshs/dkcutter), run any of the following four commands and answer the command prompt questions:

### npm

```bash
npx dkcutter https://github.com/dkshs/dkcutter-nextjs.git
```

### yarn

```bash
yarn dlx dkcutter https://github.com/dkshs/dkcutter-nextjs.git
```

### pnpm

```bash
pnpm dlx dkcutter https://github.com/dkshs/dkcutter-nextjs.git
```

### bun

```bash
bunx dkcutter https://github.com/dkshs/dkcutter-nextjs.git
```

You'll be prompted for some values. Provide them, then a Next.Js project will be created for you.

**Warning**: After this point, change 'My name', etc to your own information.

Answer the prompts with your own desired [options](./docs/project-generation-options.md). For example:

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
