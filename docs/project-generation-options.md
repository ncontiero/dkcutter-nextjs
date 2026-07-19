# Project Generation Options

This page describes all the template options that will be prompted by the [DKCutter CLI](https://github.com/ncontiero/dkcutter) prior to generating your project.

- **Project name**: Your project's human-readable name, capitals and spaces allowed.

- **Project slug**: Your project's slug without spaces. Used to name your repo and in other places.

- **Project description**: Describes your project and gets used in places like README.md and such.

- **Author name**: This is you! The value goes into places like LICENSE and such.

- **Project version**: The version of the project at its inception.

- **Authentication Provider**: Indicates whether the project should be configured using the following authentication providers:
  - None
  - [Clerk](https://clerk.com/)
  - [Better Auth](https://www.better-auth.com/)

- **Internationalization (i18n)**: Indicates whether the project should be configured with internationalization support:
  - None
  - [next-intl](https://next-intl-docs.vercel.app/)

- **Additional Tools**: Indicates whether the project should be configured with the following tools:
  - [Husky](https://typicode.github.io/husky/): Modern native git hooks made easy.
  - [Lint Staged](https://github.com/okonet/lint-staged): Run linters against staged git files.
  - [Nano Staged](https://github.com/usmanyunusov/nano-staged): Tiny tool to run commands for modified, staged, and committed files.
  - [Commitlint](https://commitlint.js.org/): Lint commit messages.
  - [React Compiler](https://react.dev/learn/react-compiler): Automatically optimize React component renders.
  - [React Hook Form](https://react-hook-form.com/): Performant, flexible and extensible forms with easy-to-use validation.
  - [ESLint + Type Information](https://typescript-eslint.io/getting-started/typed-linting): Enable ESLint rules that require type information.
  - [Vitest](https://vitest.dev/): Blazing fast unit test framework powered by Vite.
  - [Prisma](https://www.prisma.io/): Next-generation ORM for Node.js & TypeScript.
  - [Trigger.dev](https://trigger.dev/): The open source background jobs platform.
  - [TanStack Query](https://tanstack.com/query/latest): Powerful asynchronous state management for TS/JS.
  - [Shadcn](https://ui.shadcn.com/): Copy-paste accessible UI components (Tailwind + Radix primitives).
  - [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography): A plugin that provides a set of prose classes you can use to add beautiful typographic defaults to any vanilla HTML.
  - [Unpic](https://unpic.pics): High-performance, framework-agnostic image component.

- **Use Docker Compose**: Indicates whether the project should include a Docker Compose for the database (only prompted if Prisma is selected).

- **Clerk Webhook**: Indicates whether the project must have an endpoint to receive [Clerk events](https://clerk.com/docs/guides/development/webhooks/overview#supported-webhook-events). [More information](https://clerk.com/docs/guides/development/webhooks/syncing).

- **Automated Deps Updater**: Indicates whether the project should be configured using the following automated deps updater:
  - None
  - [Mend Renovate](https://docs.renovatebot.com/)
  - [Github Dependabot](https://docs.github.com/code-security/dependabot/working-with-dependabot/dependabot-options-reference)

- **Install Dependencies**: Indicates whether the dependencies should be automatically installed right after project generation.

- **Initialize Git**: Indicates whether a Git repository should be initialized with an initial commit.
