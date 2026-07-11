# {{dkcutter.projectName}}

[![license mit](https://img.shields.io/badge/licence-MIT-7c3aed)](/LICENSE)
[![Built with dkcutter-nextjs](https://img.shields.io/badge/built%20with-DKCutter%20NextJs-7c3aed.svg)](https://github.com/ncontiero/dkcutter-nextjs)

{{ dkcutter.description }}

## ✨ Features

- ⚡️ **Next.js v16**: Modern full-stack React framework with App Router.
{%- if dkcutter.authProvider == "clerk" %}
- 🔐 **Authentication**: Out-of-the-box support for Clerk{% if dkcutter.useClerkWebhook %} (with webhooks){% endif %}.
{%- elif dkcutter.authProvider == "betterAuth" %}
- 🔐 **Authentication**: Self-hosted user accounts and sessions via Better Auth.
{%- endif %}
{%- if dkcutter.i18n == "nextIntl" %}
- 🌍 **Internationalization**: i18n support powered by next-intl.
{%- endif %}
{%- if dkcutter.usePrisma %}
- 🗄️ **Database ORM**: Prisma configured for type-safe database access.
{%- if dkcutter.useDockerCompose %}
- 🐳 **Local Database**: Docker Compose configured for an easy local database setup.
{%- endif %}
{%- endif %}
{%- if dkcutter.useTriggerDev %}
- ⚙️ **Background Jobs**: Integrated with Trigger.dev for serverless background tasks.
{%- endif %}
{%- if dkcutter.useTanstackQuery %}
- 🔄 **Data Fetching**: TanStack Query configuration for powerful async state management.
{%- endif %}
{%- if dkcutter.useReactHookForm %}
- 📝 **Form Validation**: Type-safe and performant forms via React Hook Form and Zod.
{%- endif %}
{%- if dkcutter.useShadcn %}
- 🎨 **Styling**: Tailwind CSS configured with beautifully designed Shadcn UI components.
{%- else %}
- 🎨 **Styling**: Pre-configured with Tailwind CSS out-of-the-box.
{%- endif %}
{%- if dkcutter.useTailwindTypography %}
- 📖 **Typography**: Tailwind CSS Typography plugin for beautiful text styles.
{%- endif %}
{%- if dkcutter.useUnpic %}
- 🖼️ **Images**: High-performance, framework-agnostic image component via Unpic.
{%- endif %}

## Getting Started

First, run the development server:

```bash
{{ dkcutter._pkgRun }} dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
