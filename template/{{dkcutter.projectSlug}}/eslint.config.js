import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
{%- if dkcutter.i18n == "nextIntl" and dkcutter.useAppFolder %}
  ignores: ["project.inlang/README.md", "./src/i18n/messages/*.d.json.ts"],
{%- endif %}
{%- if dkcutter.useEslintWithType %}
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
{%- endif %}
  tailwindcss: {
    cssGlobalPath: "./src/styles/globals.css",
  },
{%- if dkcutter.useTanstackQuery %}
  tanstackQuery: true,
{%- endif %}
});
