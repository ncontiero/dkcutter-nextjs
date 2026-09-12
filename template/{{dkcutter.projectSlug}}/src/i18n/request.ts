{% if dkcutter.useEslintWithType -%}
import type { Messages } from "./types";
{% endif -%}
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

{%- if dkcutter.useEslintWithType %}
  const importedMessages = (await import(`./messages/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale,
    messages: importedMessages.default,
  };
{% else %}
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
{% endif -%}
});
