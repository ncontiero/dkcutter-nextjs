{% if dkcutter.usePrisma -%}
import { prismaAdapter } from "@better-auth/prisma-adapter";
{% endif -%}
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";
{%- if dkcutter.usePrisma %}
import { prisma } from "../prisma";
{%- endif %}

export const auth = betterAuth({
{%- if dkcutter.usePrisma %}
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  advanced: {
    database: {
      generateId: false,
    },
  },
{%- endif %}
  // Make sure nextCookies() is the last plugin in the array
  plugins: [nextCookies()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
});
