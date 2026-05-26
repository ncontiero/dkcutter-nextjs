import "@/styles/globals.css";
import type { AppProps } from "next/app";
{%- if dkcutter.authProvider == 'clerk' %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
