import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  tailwindcss: {
    cssGlobalPath: "./src/styles/globals.css",
  },
{%- if dkcutter.useTanstackQuery %}
  tanstackQuery: true,
{%- endif %}
});
