{% if dkcutter.i18n == "nextIntl" -%}
import { redirect } from "next/navigation";

// This page only renders when the app is built statically (output: "export")
export default function RootPage() {
  redirect("/en");
}
{% else -%}
export default function HomePage() {
  return <h1 className="text-3xl font-bold underline">Hello World</h1>;
}
{% endif -%}
