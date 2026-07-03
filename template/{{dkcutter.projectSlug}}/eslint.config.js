import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
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
