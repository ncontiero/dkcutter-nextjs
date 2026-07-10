import type { NextConfig } from "next";
{%- if dkcutter.i18n == "nextIntl" and dkcutter.useAppFolder %}
import createNextIntlPlugin from "next-intl/plugin";
{%- endif %}
import "./src/env";

const nextConfig: NextConfig = {
{%- if dkcutter.useReactCompiler %}
  reactCompiler: true,
{%- endif %}
{%- if dkcutter.i18n == "nextIntl" and not dkcutter.useAppFolder %}
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
{%- endif %}
  // Add your Next.js configuration options here...
};

{%- if dkcutter.i18n == "nextIntl" and dkcutter.useAppFolder %}
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/i18n/messages/en.json",
  },
});

export default withNextIntl(nextConfig);
{%- else %}
export default nextConfig;
{%- endif %}
