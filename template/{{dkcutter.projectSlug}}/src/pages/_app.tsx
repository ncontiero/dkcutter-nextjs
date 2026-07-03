import "@/styles/globals.css";
import type { AppProps } from "next/app";
{%- if dkcutter.useTanstackQuery %}
import { useState } from "react";
{%- endif %}
{%- if dkcutter.authProvider == "clerk" %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
{%- if dkcutter.useTanstackQuery %}
import {
{%- if dkcutter.useTanstackQuery and dkcutter.useEslintWithType %}
  type DehydratedState,
{%- endif %}
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
{%- endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

{%- if dkcutter.useTanstackQuery and dkcutter.useEslintWithType %}

export default function App({
  Component,
  pageProps,
}: AppProps<{ dehydratedState?: DehydratedState }>) {
{%- else %}

export default function App({ Component, pageProps }: AppProps) {
{%- endif %}
{%- if dkcutter.useTanstackQuery %}
  const [queryClient] = useState(() => new QueryClient());
{% endif %}

{%- if dkcutter.authProvider == 'clerk' %}
  return (
    <ClerkProvider {...pageProps}>
{%- if dkcutter.useTanstackQuery %}
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <div className={inter.variable}>
            <Component {...pageProps} />
          </div>
        </HydrationBoundary>
        <ReactQueryDevtools />
      </QueryClientProvider>
{%- else %}
      <div className={inter.variable}>
        <Component {...pageProps} />
      </div>
{%- endif %}
    </ClerkProvider>
  );
{%- else %}
  return (
{%- if dkcutter.useTanstackQuery %}
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <div className={inter.variable}>
          <Component {...pageProps} />
        </div>
      </HydrationBoundary>
      <ReactQueryDevtools />
    </QueryClientProvider>
{%- else %}
    <div className={inter.variable}>
      <Component {...pageProps} />
    </div>
{%- endif %}
  );
{%- endif %}
}
