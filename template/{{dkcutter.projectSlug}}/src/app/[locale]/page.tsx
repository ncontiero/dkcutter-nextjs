import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Index");

  return <h1 className="text-3xl font-bold underline">{t("title")}</h1>;
}
