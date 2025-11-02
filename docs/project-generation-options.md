# Project Generation Options

This page describes all the template options that will be prompted by the [DKCutter CLI](https://github.com/ncontiero/dkcutter) prior to generating your project.

- **Project name**: Your project's human-readable name, capitals and spaces allowed.

- **Project slug**: Your project's slug without spaces. Used to name your repo and in other places.

- **Project description**: Describes your project and gets used in places like README.md and such.

- **Author name**: This is you! The value goes into places like LICENSE and such.

- **Project version**: The version of the project at its inception.

- **Use husky**: Indicates that the project should be configured with [husky](https://typicode.github.io/husky/).

- **Use lint staged**: Indicates that the project should be configured with [lint-staged](https://github.com/okonet/lint-staged). This question will only be asked if `Use husky` is chosen.

- **Use app folder**: Indicates whether the project should be configured use the app folder from [Next.js](https://nextjs.org/docs/app).

- **Database ORM**: Indicates whether the project should be configured using the following ORM:
  - None
  - [Prisma](https://www.prisma.io/)

- **Use Docker Compose**: Indicates whether the project should include a Docker Compose for the database. This question will only be asked if `Database ORM` is different from `none`.

- **Authentication Provider**: Indicates whether the project should be configured using the following authentication providers:
  - None
  - [Clerk](https://clerk.com/)
  - [NextAuth.js](https://authjs.dev/)
  - [Better Auth](https://www.better-auth.com/)

- **Clerk Webhook**: Indicates whether the project must have an endpoint to receive [Clerk events](https://clerk.com/docs/guides/development/webhooks/overview#supported-webhook-events). [More information](https://clerk.com/docs/guides/development/webhooks/syncing).

- **Use Trigger.dev**: Indicates whether the project should be configured with [Trigger.dev](https://trigger.dev/).

- **Automated Deps Updater**: Indicates whether the project should be configured using the following automated deps updater:
  - None
  - [Mend Renovate](https://docs.renovatebot.com/)
  - [Github Dependabot](https://docs.github.com/code-security/dependabot/working-with-dependabot/dependabot-options-reference)

- **Automatic start**: Indicates whether the project should be configured and started automatically, installing dependencies, running linters if chosen and starting a `git` repository.
