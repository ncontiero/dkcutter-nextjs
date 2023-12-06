import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

{% if authProvider == 'clerk' -%}

import { ClerkProvider } from "@clerk/nextjs";

{% endif -%}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{ projectName }}",
  description: "{{ description }}",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    {%- if authProvider == 'clerk' %}
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
