{% if dkcutter.i18n == "nextIntl" -%}
"use client";

import Error from "next/error";

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
{% else -%}
import type { Metadata } from "next";
import { PageError } from "@/components/PageError";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function PageNotFound() {
  const title = "Page Not Found";
  const description = "The page you are looking for does not exist.";

  return <PageError title={title} description={description} />;
}
{% endif -%}
