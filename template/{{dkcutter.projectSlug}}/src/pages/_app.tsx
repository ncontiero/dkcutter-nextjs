import "@/styles/globals.css";
import type { AppProps } from "next/app";
{%- if dkcutter.useTanstackQuery %}
import { useState } from "react";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
{%- endif %}
{%- if dkcutter.authProvider == 'clerk' %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
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
