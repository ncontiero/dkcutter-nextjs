import "@/styles/globals.css";
{%- if dkcutter.i18n == "nextIntl" %}

export default function RootLayout({
  children,
}: LayoutProps<"/">): LayoutProps<"/">["children"] {
  return children;
}
{%- else %}
import type { Metadata } from "next";
{%- if dkcutter.authProvider == "clerk" %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { Inter } from "next/font/google";
{%- if dkcutter.useTanstackQuery %}
import { Providers } from "./providers";
{%- endif %}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "{{ dkcutter.projectName|truncate(60, true, '') }}",
  description: "{{ dkcutter.description }}",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
{%- if dkcutter.authProvider == "clerk" %}
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
{%- if dkcutter.useTanstackQuery %}
        <body className={inter.variable}>
          <Providers>{children}</Providers>
        </body>
{%- else %}
        <body className={inter.variable}>{children}</body>
{%- endif %}
      </html>
    </ClerkProvider>
{%- else %}
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
{%- if dkcutter.useTanstackQuery %}
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
{%- else %}
      <body className={inter.variable}>{children}</body>
{%- endif %}
    </html>
{%- endif %}
  );
}
{%- endif %}
