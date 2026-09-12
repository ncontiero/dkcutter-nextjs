{% if dkcutter.useI18nBetterAuthPlugin -%}
import { locales as betterAuthLocales, i18n } from "@better-auth/i18n";
{% endif -%}
{% if dkcutter.usePrisma -%}
import { prismaAdapter } from "@better-auth/prisma-adapter";
{% endif -%}
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
{%- if dkcutter.useI18nBetterAuthPlugin and dkcutter.i18n == "nextIntl" %}
import { getLocale } from "next-intl/server";
import { NEXT_LOCALE_COOKIE_NAME } from "@/i18n/routing";
{%- endif %}
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
{%- if dkcutter.useI18nBetterAuthPlugin %}
  plugins: [
    i18n({
      translations: {
        en: betterAuthLocales.en,
      },
{%- if dkcutter.i18n == "nextIntl" %}
      detection: ["cookie", "header", "callback"],
      localeCookie: NEXT_LOCALE_COOKIE_NAME,
      getLocale,
{%- endif %}
    }),
    // Make sure nextCookies() is the last plugin in the array
    nextCookies(),
  ],
{%- else %}
  // Make sure nextCookies() is the last plugin in the array
  plugins: [nextCookies()],
{%- endif %}
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
