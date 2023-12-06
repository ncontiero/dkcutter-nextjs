import "@/styles/globals.css";
import type { AppProps } from "next/app";

{% if authProvider == 'clerk' -%}

import { ClerkProvider } from "@clerk/nextjs";

{% endif -%}

export default function App({ Component, pageProps }: AppProps) {
  {%- if authProvider == 'clerk' %}
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
  {%- else %}
  return <Component {...pageProps} />;
  {%- endif %}
}
