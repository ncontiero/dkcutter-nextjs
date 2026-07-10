import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageError } from "@/components/PageError";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  const title = t("title");

  return {
    title,
  };
}

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.
export default function PageNotFound() {
  const t = useTranslations("NotFound");

  const title = t("title");
  const description = t("description");

  return <PageError title={title} description={description} />;
}
