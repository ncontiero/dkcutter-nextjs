import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
{%- if dkcutter.database != 'none' %}
    // Database ({{ dkcutter.database | capitalize }})
    DATABASE_URL: z.url(),
{%- endif %}
{%- if dkcutter.authProvider == 'nextAuth' %}
    // Auth.js
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    // Add ` on ID and SECRET if you want to make sure they're not empty
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
{%- elif dkcutter.  authProvider == 'clerk' %}
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
{%- if dkcutter.clerkWebhook %}
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
{%- endif %}
{%- endif %}
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
{%- if dkcutter.authProvider == 'clerk' %}
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
{%- endif %}
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
{%- if dkcutter.database != 'none' %}
    // Database ({{ dkcutter.database | capitalize }})
    DATABASE_URL: process.env.DATABASE_URL,
{%- endif %}
{%- if dkcutter.authProvider == 'nextAuth' %}
    // Auth.js
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
{%- elif dkcutter.authProvider == 'clerk' %}
    // Clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
{%- if dkcutter.clerkWebhook %}
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
{%- endif %}
{%- endif %}

    // Client
    // ----------------------------
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
{%- if dkcutter.authProvider == 'clerk' %}
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
{%- endif %}
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
