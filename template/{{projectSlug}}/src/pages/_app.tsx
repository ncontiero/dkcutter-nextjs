import "@/styles/globals.css";
import type { AppProps } from "next/app";
{%- if authProvider == 'nextAuth' %}
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

{%- elif authProvider == 'clerk' %}

import { ClerkProvider } from "@clerk/nextjs";

{%- endif %}
{% if authProvider == 'nextAuth' %}
export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
{% else %}
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
{% endif %}