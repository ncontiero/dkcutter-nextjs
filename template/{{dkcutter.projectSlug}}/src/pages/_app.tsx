import "@/styles/globals.css";
import type { AppProps } from "next/app";
{%- if dkcutter.authProvider == 'nextAuth' %}
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
{% elif dkcutter.authProvider == 'clerk' %}
import { ClerkProvider } from "@clerk/nextjs";
{% endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
{% if dkcutter.authProvider == 'nextAuth' %}
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={session}>
      <div className={inter.variable}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
{%- else %}
export default function App({ Component, pageProps }: AppProps) {
{%- if dkcutter.authProvider == 'clerk' %}
  return (
    <ClerkProvider {...pageProps}>
      <div className={inter.variable}>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
{%- else %}
  return (
    <div className={inter.variable}>
      <Component {...pageProps} />
    </div>
  );
{%- endif %}
}
{%- endif %}
