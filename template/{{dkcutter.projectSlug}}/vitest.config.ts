import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
{%- if dkcutter.i18n == "nextIntl" %}
    setupFiles: ["./tests/setup.ts"],
{%- endif %}
  },
});
