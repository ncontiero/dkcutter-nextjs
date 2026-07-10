{% if dkcutter.useEslintWithType -%}
import type { Messages } from "./types";
{% endif -%}
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
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
