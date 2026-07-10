{% if dkcutter.i18n == "nextIntl" -%}
import type { GetStaticPropsContext } from "next";
{%- if dkcutter.useEslintWithType %}
import type { Messages } from "@/i18n/types";
{%- endif %}
import { useTranslations } from "next-intl";

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

{% endif -%}

export default function HomePage() {
{%- if dkcutter.i18n == "nextIntl" %}
  const t = useTranslations("Index");

  return <h1 className="text-3xl font-bold underline">{t("title")}</h1>;
{%- else %}
  return <h1 className="text-3xl font-bold underline">Hello World</h1>;
{%- endif %}
}
