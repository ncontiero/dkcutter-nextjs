import type { NextConfig } from "next";
{%- if dkcutter.i18n == "nextIntl" %}
import createNextIntlPlugin from "next-intl/plugin";
{%- endif %}
import "./src/env";

const nextConfig: NextConfig = {
  // Add your Next.js configuration options here...
{%- if dkcutter.useReactCompiler or dkcutter.useRustReactCompiler %}
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
  reactCompiler: true,
{%- endif %}
{%- if dkcutter.experimentalFeatures != "none" %}
  experimental: {
{%- if dkcutter.useRustReactCompiler %}
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler
    turbopackRustReactCompiler: true,
{%- endif %}
{%- if dkcutter.useNetworkResilience %}
    // https://nextjs.org/docs/app/guides/offline-support
    useOffline: true,
{%- endif %}
  },
{%- endif %}
};

{%- if dkcutter.i18n == "nextIntl" %}
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/i18n/messages/en.json",
  },
});

export default withNextIntl(nextConfig);
{%- else %}

export default nextConfig;
{%- endif %}
