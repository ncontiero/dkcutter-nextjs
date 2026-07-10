{% if dkcutter.i18n == "nextIntl" -%}
import type { GetStaticPropsContext } from "next";
{%- if dkcutter.useEslintWithType %}
import type { Messages } from "@/i18n/types";
{%- endif %}
import { useTranslations } from "next-intl";
{% endif -%}
import { PageError } from "@/components/PageError";

{%- if dkcutter.i18n == "nextIntl" %}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
{%- if dkcutter.useEslintWithType %}
  const importedMessages = (await import(
    `../i18n/messages/${locale}.json`
  )) as { default: Messages };

  return {
    props: {
      messages: importedMessages.default,
    },
  };
{%- else %}
  return {
    props: {
      messages: (await import(`../i18n/messages/${locale}.json`)).default,
    },
  };
{%- endif %}
}
{%- endif %}

export default function PageNotFound() {
{%- if dkcutter.i18n == "nextIntl" %}
  const t = useTranslations("NotFound");

  const title = t("title");
  const description = t("description");
{%- else %}
  const title = "Page Not Found";
  const description = "The page you are looking for does not exist.";
{%- endif %}

  return <PageError title={title} description={description} />;
}
