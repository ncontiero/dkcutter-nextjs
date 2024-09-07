{% if not dkcutter.useAppFolder -%}
import type { GetServerSidePropsContext } from "next";

{% endif -%}
{%- if dkcutter.database == 'prisma' %}
import { PrismaAdapter } from "@next-auth/prisma-adapter";
{%- endif %}
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env.js";
{%- if dkcutter.database == 'prisma' %}
import { prisma } from "@/lib/prisma";
{%- endif %}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
{%- if dkcutter.database == 'prisma' %}
  adapter: PrismaAdapter(prisma),
{%- endif %}
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
{%- if dkcutter.useAppFolder %}
export const getServerAuthSession = () => getServerSession(authOptions);
{%- else %}
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
{%- endif %}
