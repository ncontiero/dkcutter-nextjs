import "./globals.css";
import type { Metadata } from "next";
{%- if dkcutter.authProvider == 'clerk' %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "{{ dkcutter.projectName|truncate(60, true, '') }}",
  description: "{{ dkcutter.description }}",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    {%- if dkcutter.authProvider == 'clerk' %}
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.variable}>{children}</body>
      </html>
    </ClerkProvider>
    {%- else %}
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
    {%- endif %}
  );
}
