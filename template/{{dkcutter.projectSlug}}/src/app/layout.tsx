import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
{%- if dkcutter.authProvider == 'clerk' %}
import { ClerkProvider } from "@clerk/nextjs";
{%- endif %}
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{ dkcutter.projectName }}",
  description: "{{ dkcutter.description }}",
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    {%- if dkcutter.authProvider == 'clerk' %}
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
    {%- else %}
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    {%- endif %}
  );
}
