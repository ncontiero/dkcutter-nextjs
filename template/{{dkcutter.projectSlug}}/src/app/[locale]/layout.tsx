import type { Metadata } from "next";
{%- if dkcutter.authProvider == "clerk" %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
{%- if dkcutter.useTanstackQuery %}
import { Providers } from "./providers";
{%- endif %}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "{{ dkcutter.projectName|truncate(60, true, '') }}",
  description: "{{ dkcutter.description }}",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
{%- if dkcutter.authProvider == "clerk" %}
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
{%- if dkcutter.useTanstackQuery %}
        <body className={inter.variable}>
          <Providers>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </Providers>
        </body>
{%- else %}
        <body className={inter.variable}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
{%- endif %}
      </html>
    </ClerkProvider>
{%- else %}
    <html lang={locale} suppressHydrationWarning>
{%- if dkcutter.useTanstackQuery %}
      <body className={inter.variable}>
        <Providers>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </Providers>
      </body>
{%- else %}
      <body className={inter.variable}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
{%- endif %}
    </html>
{%- endif %}
  );
}
